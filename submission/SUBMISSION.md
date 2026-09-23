# ByteGeist Support Lab — Zero to Shipped 2026 Submission Bundle

Everything a reviewer or the Builder Center form needs, in one folder.

## Quick facts

- Project name: **ByteGeist Support Lab**
- One-liner: AWS-hosted troubleshooting simulator where learners investigate realistic IT incidents and get evidence-grounded, adaptive coaching from Amazon Bedrock. AI teaches; code grades.
- Live app: https://main.dgew3vrz26q4r.amplifyapp.com
- Source (GitHub): https://github.com/kcasko/bytegeist-support-lab
- Category: **Social Good**
- Focus track: **Community**
- Theme: IT education / workforce development
- Region: us-east-1
- Amplify App ID: `dgew3vrz26q4r` (branch `main`)
- API base: `https://28rhvoyde7.execute-api.us-east-1.amazonaws.com`
- Backend stack: `bytegeist-support-lab` (AWS SAM / CloudFormation)
- Latest commit on main: `2159dad` — hero banner artwork
- Latest Amplify deploy: job **19**, status **SUCCEED**

## AWS services used

Amplify Hosting, API Gateway (HTTP API), Lambda, DynamoDB, Amazon Bedrock (Nova Micro), SAM / CloudFormation.

## What's in this folder

- `SUBMISSION.md` — this index
- `hackathon-submission.md` — the full submission draft (paste into Builder Center long fields)
- `README.md` — repo README copy for reviewers
- `architecture.md` — AWS architecture write-up
- `agent-workflow.md` — how the AI coding agent was used
- `aws-connection.md` — proof-of-connection notes
- `screenshots/` — 6 screenshots (queue, S3 coach, review, learner report, INC-1005 coach, coding-agent-AWS proof)
- `demo/bytegeist-support-lab-demo.webm` — silent browser walkthrough (~2 MB)

## Builder Center field crib

- Title: **ByteGeist Support Lab**
- Tagline: **AI-guided IT troubleshooting practice on AWS. AI teaches; code grades.**
- Live URL: `https://main.dgew3vrz26q4r.amplifyapp.com`
- Source URL: `https://github.com/kcasko/bytegeist-support-lab`
- Category: Social Good
- Focus track: Community
- Long description: paste from `hackathon-submission.md` sections "The problem" → "Community impact".

## Suggested reviewer demo flow

1. Open the incident queue (INC-1001 … INC-1005 all render).
2. Start "AccessDenied in S3" (INC-1003).
3. Run `aws sts get-caller-identity`, then **Explain This Output**.
4. Run `aws s3 ls s3://bytegeist-reports` and see AccessDenied.
5. Walk the 4-level hint ladder or inspect the IAM policy.
6. Diagnose: missing `s3:ListBucket`. Fix: grant `s3:ListBucket` on the bucket ARN.
7. **Check My Thinking**, then submit — 100/100 review.

## Ship-gate remaining

- [ ] Create/finalize the Builder Center project entry
- [ ] Submit before Oct 2, 2026 at 11:59 p.m. PT
