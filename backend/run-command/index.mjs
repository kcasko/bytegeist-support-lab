import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const scenarioTable = process.env.SCENARIO_TABLE;
const sessionTable = process.env.SESSION_TABLE;

function normalizeCommand(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function recordCommand({
  sessionId,
  scenarioId,
  command,
  output,
}) {
  if (!sessionId) {
    return;
  }

  const now = new Date();

  const expiresAt =
    Math.floor(now.getTime() / 1000) + 86400;

  await dynamodb.send(
    new UpdateCommand({
      TableName: sessionTable,

      Key: {
        sessionId,
      },

      UpdateExpression: `
        SET
          commandHistory =
            list_append(
              if_not_exists(commandHistory, :empty),
              :entries
            ),
          updatedAt = :updatedAt,
          expiresAt = :expiresAt
      `,

      ConditionExpression:
        "scenarioId = :scenarioId",

      ExpressionAttributeValues: {
        ":empty": [],

        ":entries": [
          {
            command,
            output,
            timestamp: now.toISOString(),
          },
        ],

        ":updatedAt": now.toISOString(),
        ":expiresAt": expiresAt,
        ":scenarioId": scenarioId,
      },
    }),
  );
}

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");

    const submittedCommand = body.command;
    const sessionId = body.sessionId ?? null;

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
        TableName: scenarioTable,

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

    const recommendedCommands =
      scenario.recommendedCommands ?? [];

    let output;

    if (normalizedCommand === "help") {
      const suggestions =
        recommendedCommands.length > 0
          ? recommendedCommands
              .map(
                (command) =>
                  `  ${command}`,
              )
              .join("\n")
          : "  No suggested commands are available.";

      output = `Available troubleshooting commands:

${suggestions}`;
    } else {
      const matchedCommand =
        Object.keys(commands).find(
          (availableCommand) =>
            normalizeCommand(
              availableCommand,
            ) === normalizedCommand,
        );

      if (matchedCommand) {
        output = commands[matchedCommand];
      } else {
        output = `'${submittedCommand}' is not available in this training environment.

Type "help" to view available troubleshooting commands.`;
      }
    }

    try {
      await recordCommand({
        sessionId,
        scenarioId,
        command: submittedCommand,
        output,
      });
    } catch (error) {
      console.error(
        "Unable to record command in session:",
        error,
      );

      if (
        error.name ===
        "ConditionalCheckFailedException"
      ) {
        return response(400, {
          error:
            "The training session does not match this scenario.",
        });
      }

      throw error;
    }

    return response(200, {
      output,
    });
  } catch (error) {
    console.error(
      "RunCommand error:",
      error,
    );

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