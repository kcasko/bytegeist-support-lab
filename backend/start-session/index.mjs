import crypto from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const scenarioTable = process.env.SCENARIO_TABLE;
const sessionTable = process.env.SESSION_TABLE;

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    const scenarioResult = await dynamodb.send(
      new GetCommand({
        TableName: scenarioTable,
        Key: {
          scenarioId,
        },
        ProjectionExpression:
          "scenarioId, ticketNumber, title",
      }),
    );

    if (!scenarioResult.Item) {
      return response(404, {
        error: "Scenario not found.",
      });
    }

    const now = new Date();
    const sessionId = crypto.randomUUID();

    // Session expires after 24 hours.
    const expiresAt =
      Math.floor(now.getTime() / 1000) + 86400;

    const session = {
      sessionId,
      scenarioId,

      hintLevel: 1,

      commandHistory: [],
      coachHistory: [],

      diagnosis: "",
      solution: "",

      conceptsDemonstrated: [],
      conceptsNeedingHelp: [],
      misconceptionsDetected: [],

      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),

      expiresAt,
    };

    await dynamodb.send(
      new PutCommand({
        TableName: sessionTable,
        Item: session,

        ConditionExpression:
          "attribute_not_exists(sessionId)",
      }),
    );

    return response(201, {
      sessionId,
      scenarioId,
      hintLevel: 1,
    });
  } catch (error) {
    console.error("StartSession error:", error);

    return response(500, {
      error: "Unable to start training session.",
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