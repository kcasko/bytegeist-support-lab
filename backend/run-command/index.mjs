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
    const command = body.command;

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    if (!command || typeof command !== "string") {
      return response(400, {
        error: "Command is required.",
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

    const normalizedCommand = normalizeCommand(command);

    const output =
      scenario.commands?.[normalizedCommand] ??
      `'${command.trim()}' is not available in this training environment.

Try commands such as:
ipconfig /all
ping 8.8.8.8
ping fileserver01
nslookup fileserver01`;

    return response(200, {
      scenarioId,
      command: command.trim(),
      output,
    });
  } catch (error) {
    console.error("RunCommand error:", error);

    return response(500, {
      error: "Internal server error.",
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