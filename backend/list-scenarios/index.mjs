import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.SCENARIO_TABLE;

export const handler = async () => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({
        TableName: tableName,

        // Important:
        // Do NOT return commands or answer data to the homepage.
        ProjectionExpression:
          "scenarioId, ticketNumber, title, category, difficulty, issue",
      }),
    );

    const scenarios = (result.Items ?? []).sort((a, b) =>
      a.ticketNumber.localeCompare(b.ticketNumber),
    );

    return response(200, {
      scenarios,
    });
  } catch (error) {
    console.error("ListScenarios error:", error);

    return response(500, {
      error: "Unable to load scenarios.",
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