# Developer Job Application Tracker

A SaaS product designed for developers to manage job applications, track
interview progress, organize resume versions, and schedule follow‑ups.

## Product Vision

This project evolves in three stages:

1.  Job Application Tracker
2.  Developer Job CRM
3.  Developer Career Toolkit

The final platform connects:

-   Job Application Tracker
-   Resume Builder
-   Cover Letter Generator
-   Interview Preparation Tracker
-   Salary Comparison Tool

## Current Focus

The current milestone is **Stage 1: Job Application Tracker MVP**.

Features included:

-   authentication
-   dashboard
-   application CRUD
-   applications table
-   kanban pipeline
-   reminders
-   resume attachments
-   analytics basics
-   billing and plan limits

## Tech Stack

Frontend - Next.js App Router - React - TypeScript - Tailwind CSS -
shadcn/ui

Backend - Next.js Server Actions - Prisma ORM - PostgreSQL

Infrastructure - Vercel - Stripe - Resend - PostHog

## Development

Install dependencies

npm install

Run database migrations

npx prisma migrate dev

Run seed data

npx prisma db seed

Start development

npm run dev
