# AWS Zero to Shipped 2026 — Submission Draft

## Project

**ByteGeist Support Lab**

## Live application

https://supportlab.casko.dev

Underlying AWS Amplify deployment: https://main.dgew3vrz26q4r.amplifyapp.com

## Classification

- App category: **Social Good**
- Focus track: **Community**
- Theme: IT education / workforce development

## One-line description

ByteGeist Support Lab is an AWS-hosted troubleshooting simulator where learners investigate realistic IT incidents and receive evidence-grounded, adaptive coaching from Amazon Bedrock.

## The problem

Learning IT support is often split into memorizing commands, reading documentation, and watching someone else troubleshoot. That does not fully teach the reasoning required when a real user says, “I can get online, but the file server does not work.”

ByteGeist Support Lab turns troubleshooting into a repeatable practice loop: receive a ticket, gather evidence, interpret the evidence, form a diagnosis, propose a fix, and review the result.
## What I built

The application includes five interactive incidents:

1. A Windows workstation that can reach the internet but cannot resolve an internal file server.
2. An Active Directory user who can reach a file server but is missing the security-group membership required for an Accounting share.
3. An AWS developer who authenticates successfully but receives AccessDenied when listing an S3 bucket because the identity lacks `s3:ListBucket`.
4. A Linux systemd service that will not stay started because its configuration file is owned by root and unreadable to the service user.
5. An internal web application that is unreachable even though the EC2 instance is running and the security group is correct — the app service on the host is stopped.

Together these cover Windows networking/DNS, Active Directory and file-share authorization, AWS IAM and S3 resource-level permissions, Linux service and permissions troubleshooting, and layered infrastructure-vs-application reachability on AWS.

Learners investigate each incident in a simulated terminal. Commands produce deterministic scenario outputs instead of touching real production systems.

During the investigation, the ByteGeist AI Coach can:

- answer troubleshooting questions
- provide progressive hints
- explain an exact terminal result
- identify misconceptions
- evaluate a draft diagnosis
- evaluate a proposed fix

The final numeric score is deterministic application logic. AI is used to teach, not to decide the grade.
## What makes the AI use different

The difficult part was not adding a chat box. It was making the AI respect the same evidence boundaries a good technician should respect.

Every terminal entry is classified by the backend as a supported simulated command, help output, or unsupported command. Unsupported commands are explicitly marked as non-evidence before they reach the model.

The coach also receives the exact list of commands supported by the current simulator. If it recommends an exact command, that command must come from that list.

“Explain This Output” is tied to a specific command/output pair. The backend verifies that pair exists in the server-owned session before Bedrock is asked to explain it.

For progressive hints, the system moves from broad reasoning to evidence category, then technology/command family, and finally one exact supported command.

For the S3 scenario, the tutor enforces the important distinction between object access and bucket listing: listing objects requires `s3:ListBucket` on the bucket ARN.
## AWS architecture

The application is fully hosted on AWS:

- **AWS Amplify Hosting** — public React/Vite frontend
- **Amazon API Gateway** — HTTP API
- **AWS Lambda** — scenario, terminal, session, coaching, and scoring logic
- **Amazon DynamoDB** — scenario truth and server-owned tutor sessions
- **Amazon Bedrock** — Amazon Nova Micro for adaptive tutoring and final coaching
- **AWS SAM / CloudFormation** — infrastructure deployment

The tutor session stores command history, coach history, hint level, concepts demonstrated, concepts needing help, and detected misconceptions.

Bedrock uses the Converse API with structured tool output so the frontend receives predictable tutoring fields rather than relying on parsing free-form text.
## Development with an AI coding agent

I used an AI coding agent throughout the development process to help:

- design the AWS architecture
- build and refactor Lambda handlers
- wire the React frontend to the API
- deploy and inspect AWS resources
- diagnose prompt and evidence failures
- run live regression tests
- harden the AI tutor against invented evidence
- prepare project documentation and submission assets

One of the most useful parts of the process was using the agent to test the tutor adversarially. A regression test found that an unsupported ping command could be misread by the AI as proof of connectivity. Instead of hiding the symptom, the architecture was changed so supported/unsupported evidence is represented explicitly in the session data.

That same process caught incorrect S3 guidance and incomplete level-four hints before submission.
## Validation

The final targeted regression tests verified:

- unsupported commands are never treated as successful diagnostic tests
- S3 listing guidance correctly requires `s3:ListBucket`
- recommendations stay inside the simulator's supported command set
- explanations are tied to the selected command/output pair
- four hint levels become progressively more useful
- “Check My Thinking” separately assesses diagnosis and fix

A full smoke pass then ran through all five incidents.

Each incident successfully completed:

- session creation
- supported terminal execution
- unsupported-command rejection
- per-scenario progressive hint ladder (levels 1..4)
- AI explanation tied to server-recorded evidence
- diagnosis/fix coaching
- deterministic scoring
- learner performance report
- retry with a fresh session

All five produced **100/100** with the correct investigation path and resolution.
## Community impact

The project is aimed at learners trying to move from theory into real troubleshooting practice: students, career changers, home-lab builders, and people preparing for entry-level IT support roles.

The simulator gives them a place to practice reasoning without needing access to a corporate Active Directory environment, a production file server, or a real AWS account with deliberately broken permissions.

The same architecture can expand into additional help-desk, networking, cloud, security, and systems-administration scenarios.

## Demo assets

Screenshots:

- `docs/screenshots/01-incident-queue.png`
- `docs/screenshots/02-ai-coach-s3.png`
- `docs/screenshots/03-incident-review.png`

Silent browser demo:

- `docs/demo/bytegeist-support-lab-demo.webm`

## Ship-gate status

- [x] Live application on AWS
- [x] Publicly reachable URL
- [x] AWS backend deployed
- [x] Builder Center submission copy prepared
- [x] App category selected
- [x] Focus track selected
- [x] Add screenshot proving the coding agent was connected to AWS
- [ ] Create/finalize the Builder Center project entry
- [ ] Submit before October 2, 2026 at 11:59 p.m. PT
## Suggested demo flow

A short demo can follow this sequence:

1. Open the incident queue.
2. Start “AccessDenied in S3.”
3. Run `aws sts get-caller-identity`.
4. Click **Explain This Output** and show the evidence-grounded coaching.
5. Run `aws s3 ls s3://bytegeist-reports` and show AccessDenied.
6. Request progressive hints or inspect the IAM policy.
7. Enter the diagnosis: missing `s3:ListBucket`.
8. Enter the fix: grant `s3:ListBucket` on the bucket ARN.
9. Click **Check My Thinking**.
10. Submit the resolution and show the 100/100 review.

## Originality

ByteGeist Support Lab was developed for the Zero to Shipped 2026 hackathon submission and is being prepared as a newly published project for this event.
