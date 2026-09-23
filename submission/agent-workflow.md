# Coding Agent Development Log

## Project

ByteGeist Support Lab

## Hackathon

AWS Zero to Shipped 2026

## Development approach

The application was built iteratively with an AI coding agent assisting with architecture, implementation, AWS deployment, regression testing, and documentation.

The agent was used as a development partner rather than as the runtime decision-maker for grading. Runtime learner scoring remains deterministic application code.

## Major development stages

### 1. Incident simulator MVP

Built the first React interface, scenario queue, simulated terminal, diagnosis / resolution form, and deterministic scoring pipeline.

The project structure separated:

- React frontend
- Lambda backend handlers
- AWS SAM infrastructure
- DynamoDB scenario seed data
- documentation
### 2. Multi-scenario troubleshooting

Added three incident types:

- DNS / hostname resolution
- Active Directory file-share authorization
- AWS IAM / S3 AccessDenied

Each incident defines supported terminal commands, deterministic outputs, expected diagnosis / resolution, and scoring keywords.

### 3. Bedrock final coaching

Integrated Amazon Bedrock with Amazon Nova Micro to produce post-incident coaching after deterministic scoring.

The agent helped refine prompts so AI feedback stayed grounded in the actual terminal transcript rather than praising actions the learner did not perform.

### 4. Session-aware AI tutor

Added a DynamoDB tutor-session table and moved learner context server-side.

The tutor session records:

- terminal transcript
- coach conversation history
- hint level
- concepts demonstrated
- concepts needing reinforcement
- misconceptions
### 5. Structured tutoring

Bedrock Converse tool use was added so Nova returns a structured coaching object instead of uncontrolled prose.

The structured contract includes:

- tutoring message
- teaching type
- concept
- suggested next action
- suggested supported command
- learner-understanding signal
- misconception signal
- diagnosis assessment
- fix assessment

### 6. AI Coach frontend

Added the AI Coach panel with:

- Ask Coach
- Get Hint
- Explain Last Output
- Check My Thinking

The frontend automatically creates a session when an incident starts and attaches the session ID to terminal and coaching requests.
### 7. Coach hardening

Regression testing exposed cases where the coach could over-interpret simulator rejections or provide technically weak advice.

The agent helped trace those failures to the data contract and prompt boundary rather than merely adding more prose instructions.

Fixes included:

- marking terminal entries as supported, help, or unsupported
- treating unsupported-command rejection text as non-evidence
- constraining exact recommendations to supported simulator commands
- verifying the exact command/output pair selected for explanation
- deterministic four-level hint progression
- explicit S3 `s3:ListBucket` correctness rules
- direct diagnosis/fix assessment
- completion checks for exact-command hints

### 8. Regression and smoke testing

Targeted tests were run against the deployed AWS API for:

- unsupported evidence
- exact selected evidence
- incorrect S3 permission reasoning
- four-level hint progression

A complete smoke pass then covered all three incidents.
All three passed:

- session creation
- supported terminal execution
- exact-output explanation
- diagnosis/fix assessment
- 100/100 deterministic scoring
- fresh-session retry

### 9. Public AWS deployment

The production frontend was built with Vite and deployed to AWS Amplify Hosting.

Live URL:

https://main.dgew3vrz26q4r.amplifyapp.com

The backend runs through the `bytegeist-support-lab` CloudFormation stack in `us-east-1`.

### 10. Submission preparation

The agent generated:

- public-app verification
- architecture documentation
- ship-gate checklist
- three live-site screenshots
- a silent browser demo recording
- Builder Center submission draft

A separate visual screenshot proving the coding-agent AWS connection still needs to be added before final submission.
