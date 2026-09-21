import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.SCENARIO_TABLE;

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    const result = await dynamodb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          scenarioId,
        },

        // Only return information the learner is allowed to see.
        ProjectionExpression:
          "scenarioId, ticketNumber, title, category, difficulty, issue, #user, objective",

        ExpressionAttributeNames: {
          "#user": "user",
        },
      }),
    );

    if (!result.Item) {
      return response(404, {
        error: "Scenario not found.",
      });
    }

    return response(200, result.Item);
  } catch (error) {
    console.error("GetScenario error:", error);

    return response(500, {
      error: "Unable to load scenario.",
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