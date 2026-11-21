![Evalo banner](public/home.png)

# Evalo

Evalo is a two-sided mock technical interview platform connecting candidates with vetted industry interviewers for live practice sessions and AI-driven performance evaluations.

## Overview

Preparing for technical interviews often lacks realistic simulation, structured feedback, and access to experienced industry practitioners. Evalo addresses this challenge by providing an on-demand booking platform where candidates practice live technical interviews over WebRTC video and chat. Interviewers define their availability, run structured sessions, and earn credits redeemable for monetary payouts. The platform tracks co-presence to settle sessions automatically and processes post-session audio transcripts with Google Gemini to generate comprehensive evaluation reports.

## Key Features

- **Role-Based Workflows**: Separate onboarding pipelines and role-gated dashboards for candidates and interviewers managed through Clerk authentication and Next.js edge route gating.
- **Availability Management**: Weekly recurring slot scheduling and availability status management for interviewers.
- **Slot Reservation & Escrow**: Atomic slot reservations with double-entry credit ledger accounting and transactional balance locks.
- **Live Interview Room**: Interactive WebRTC video and real-time chat powered by Stream SDK.
- **AI Question Generation**: Context-aware technical interview questions generated in real time during live calls via Google Gemini.
- **Algorithmic Co-Presence Settlement**: Automated webhook processing of Stream business events to compute simultaneous participant presence, classify completion outcomes, and resolve escrow without human mediation.
- **Automated AI Candidate Feedback**: Post-session transcription processing with Google Gemini delivering structured rubrics across technical accuracy, communication, and problem-solving.
- **Interviewer Ratings & Reviews**: Post-interview candidate evaluation loop featuring ratings, written reviews, and aggregate scoring metrics.
- **Cancellation & Automated Refunds**: Policy-based session cancellation with transactional credit restitution and self-service refund claims for unfulfilled sessions.
- **Payments & Payouts**: Cashfree integration supporting subscription plan mandates for candidate credits and payout processing for interviewer earnings.
- **Abuse Prevention**: Arcjet rate limiting on booking endpoints to mitigate automated slot exhaustion.

## Tech Stack

| Category | Technology |
|---|---|
| **Language** | TypeScript, JavaScript |
| **Framework** | Next.js 16 (App Router, Standalone build) |
| **Frontend & UI** | React 19, Tailwind CSS v4, Radix UI primitives, Lucide React, Zustand, Sonner |
| **Database & ORM** | PostgreSQL (hosted on Supabase), Prisma ORM |
| **Authentication** | Clerk (Role-Based Access Control) |
| **Video & Chat** | Stream Video & Chat SDKs |
| **AI / Evaluation** | Google Gemini API |
| **Payments** | Cashfree (Payment Gateway & Cashgram Payouts) |
| **Security & Rate Limiting** | Arcjet, Svix (webhook signature verification) |
| **HTTP Client** | Ky |

## Deployment

- Multi-stage Docker container utilizing Next.js standalone output for minimal image footprint.
- GitHub Actions CI workflow running lint checks, Prisma client generation, static type verification, and build validation on pull requests targeting main, staging, and production branches.
- Staging deployment building and publishing Docker container images to GitHub Packages (GHCR) and triggering updates via Render deploy hooks on pushes to staging branch.
- Production deployment hosted on Vercel with automated deployments triggered on pushes to production branch.

## License

Copyright (c) 2026 Samim Middey. All rights reserved.

This source code is provided for viewing and evaluation purposes only.
No permission is granted to copy, modify, distribute, or use it
without prior written permission from the copyright holder.
