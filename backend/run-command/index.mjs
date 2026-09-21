import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.SCENARIO_TABLE;

function normalizeCommand(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");

    const submittedCommand = body.command;

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    if (
      !submittedCommand ||
      typeof submittedCommand !== "string"
    ) {
      return response(400, {
        error: "Command is required.",
      });
    }

    if (submittedCommand.length > 500) {
      return response(400, {
        error: "Command is too long.",
      });
    }

    const result = await dynamodb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          scenarioId,
        },
      }),
    );

    const scenario = result.Item;

    if (!scenario) {
      return response(404, {
        error: "Scenario not found.",
      });
    }

    const normalizedCommand =
      normalizeCommand(submittedCommand);

    const commands = scenario.commands ?? {};

    const matchedCommand = Object.keys(commands).find(
      (availableCommand) =>
        normalizeCommand(availableCommand) ===
        normalizedCommand,
    );

    if (matchedCommand) {
      return response(200, {
        output: commands[matchedCommand],
      });
    }

    const recommendedCommands =
      scenario.recommendedCommands ?? [];

    const suggestions =
      recommendedCommands.length > 0
        ? recommendedCommands
            .map((command) => `  ${command}`)
            .join("\n")
        : "  No suggested commands are available.";

    return response(200, {
      output: `'${submittedCommand}' is not available in this training environment.

Try commands such as:
${suggestions}`,
    });
  } catch (error) {
    console.error("RunCommand error:", error);

    return response(500, {
      error: "Unable to run command.",
    });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}