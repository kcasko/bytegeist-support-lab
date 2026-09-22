# AWS Connection and Ship-Gate Evidence

This document collects the evidence needed for the AWS Zero to Shipped ship gate.

## Public application

**Live URL:** https://main.dgew3vrz26q4r.amplifyapp.com

The production frontend is hosted by AWS Amplify Hosting.

Verified on September 22, 2026:

- HTTP status: `200 OK`
- Delivery path: Amplify / CloudFront / Amazon S3
- Amplify app: `bytegeist-support-lab`
- App ID: `dgew3vrz26q4r`
- Branch: `main`

## Backend deployment

CloudFormation stack:

`bytegeist-support-lab`

Region:

`us-east-1`

Public API:

https://28rhvoyde7.execute-api.us-east-1.amazonaws.com
Deployed AWS resources include:

- Amazon API Gateway HTTP API
- AWS Lambda functions
- Amazon DynamoDB scenario table
- Amazon DynamoDB tutor-session table
- Amazon Bedrock integration
- AWS Amplify Hosting

The stack was updated successfully through AWS SAM during the final regression cycle.

## Coding-agent AWS connection proof

The hackathon requires documented proof that the AI coding agent was connected to AWS.

**A visual proof screenshot still needs to be added before submission. Do not mark the ship gate complete until this exists.**

Recommended evidence screenshot:

1. Open the coding agent used during development.
2. Show its AWS connection / MCP or tool status as connected.
3. In the same development context, show an AWS action or resource lookup from the agent.
4. Save the screenshot as:

`docs/screenshots/00-coding-agent-aws-connection.png`

The screenshot should make the coding agent and AWS connection visible enough for a reviewer to understand what is being proven.
## Supporting deployment evidence

Useful terminal/API evidence captured during development:

```text
CloudFormation stack: bytegeist-support-lab
Status: UPDATE_COMPLETE
Region: us-east-1
```

```text
Amplify app: bytegeist-support-lab
App ID: dgew3vrz26q4r
Production branch: main
Deployment status: SUCCEED
```

```text
Public frontend:
https://main.dgew3vrz26q4r.amplifyapp.com

Public API:
https://28rhvoyde7.execute-api.us-east-1.amazonaws.com
```

## Ship-gate checklist

- [x] Application backend runs on AWS.
- [x] Frontend is publicly hosted on AWS.
- [x] Public application URL returns HTTP 200.
- [x] Project uses an AI coding-agent workflow during development.
- [ ] Add visual proof screenshot showing the coding agent connected to AWS.
- [ ] Create / finalize the AWS Builder Center project entry.
- [ ] Confirm final Builder Center submission links to the public app.
- [ ] Select one app category and one focus track.
## Planned submission classification

- App category: **Social Good**
- Focus track: **Community**
- Positioning: practical IT education and workforce-development training

## Screenshots already captured

- `01-incident-queue.png`
- `02-ai-coach-s3.png`
- `03-incident-review.png`

These screenshots demonstrate the public application itself. They do **not** replace the separate coding-agent/AWS-connection proof screenshot required by the hackathon.
