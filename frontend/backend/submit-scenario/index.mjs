import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.SCENARIO_TABLE;

function normalize(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export const handler = async (event) => {
  try {
    const scenarioId = event.pathParameters?.id;
    const body = JSON.parse(event.body || "{}");

    const diagnosis = body.diagnosis;
    const solution = body.solution;
    const commandsUsed = body.commandsUsed ?? [];

    if (!scenarioId) {
      return response(400, {
        error: "Scenario ID is required.",
      });
    }

    if (!diagnosis || typeof diagnosis !== "string") {
      return response(400, {
        error: "Diagnosis is required.",
      });
    }

    if (!solution || typeof solution !== "string") {
      return response(400, {
        error: "Solution is required.",
      });
    }

    if (diagnosis.length > 2000 || solution.length > 2000) {
      return response(400, {
        error: "Diagnosis or solution is too long.",
      });
    }

    if (!Array.isArray(commandsUsed) || commandsUsed.length > 50) {
      return response(400, {
        error: "Invalid command history.",
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

    const normalizedDiagnosis = normalize(diagnosis);
    const normalizedSolution = normalize(solution);

    const diagnosisKeywords = scenario.diagnosisKeywords ?? [];
    const solutionKeywords = scenario.solutionKeywords ?? [];
    const recommendedCommands = scenario.recommendedCommands ?? [];

    const diagnosisMatches = diagnosisKeywords.filter((keyword) =>
      normalizedDiagnosis.includes(normalize(keyword)),
    );

    const solutionMatches = solutionKeywords.filter((keyword) =>
      normalizedSolution.includes(normalize(keyword)),
    );

    const normalizedCommandsUsed = [
      ...new Set(
        commandsUsed
          .filter((command) => typeof command === "string")
          .map(normalize),
      ),
    ];

    const recommendedCommandsUsed = recommendedCommands.filter((command) =>
      normalizedCommandsUsed.includes(normalize(command)),
    );

    let diagnosisScore = 0;

    if (diagnosisMatches.length >= 2) {
      diagnosisScore = 50;
    } else if (diagnosisMatches.length === 1) {
      diagnosisScore = 35;
    }

    let solutionScore = 0;

    if (solutionMatches.length >= 3) {
      solutionScore = 30;
    } else if (solutionMatches.length === 2) {
      solutionScore = 20;
    } else if (solutionMatches.length === 1) {
      solutionScore = 10;
    }

    const troubleshootingScore = Math.min(
      recommendedCommandsUsed.length * 5,
      20,
    );

    const total =
      diagnosisScore +
      solutionScore +
      troubleshootingScore;

    return response(200, {
      total,
      diagnosisScore,
      solutionScore,
      troubleshootingScore,
      commandsUsed: recommendedCommandsUsed.length,
      expectedDiagnosis: scenario.expectedDiagnosis,
      expectedSolution: scenario.expectedSolution,
    });
  } catch (error) {
    console.error("SubmitScenario error:", error);

    return response(500, {
      error: "Unable to score incident.",
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