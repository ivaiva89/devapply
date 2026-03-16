# TASKS.md

Implementation backlog for DevApply.

This file is the **source of truth for execution tasks**.

All coding agents (Codex CLI, Copilot, etc.) must reconcile their work
with this file.

---

# Status legend

[ ] TODO  
[~] IN PROGRESS  
[x] DONE  
[!] BLOCKED

Priority:

P0 — critical for MVP  
P1 — important but not blocking launch  
P2 — nice to have

---

# Rules for coding agents

Before implementing work:

1. Check whether the task already exists in this file.
2. Align with the correct milestone section.
3. Do not duplicate tasks.

After implementing work:

1. Mark the task complete `[x]`.
2. If additional work is discovered, add a new task.
3. If implementation reveals bugs or tech debt, add tasks in **Follow-up** or **Bugs** sections.
4. Never finish implementation without updating this file.

---

# Milestone 1 — Project Foundation

Goal: stable development environment and infrastructure.

## Environment and tooling

- [x] Initialize Next.js App Router project
- [x] Configure TypeScript
- [ ] Configure ESLint + Prettier
  Priority: P1

- [ ] Configure project folder structure
  Priority: P0
  Definition of done:
    - app/
    - components/
    - features/
    - lib/
    - server/

## UI foundation

- [x] Install Tailwind CSS
  Priority: P0

- [x] Install shadcn/ui
  Priority: P0

- [x] Configure base layout
  Definition of done:
    - navigation shell
    - responsive layout
    - sidebar navigation

## Infrastructure

- [x] Setup Prisma
  Priority: P0

- [x] Setup Neon database
  Priority: P0

- [x] Setup Prisma migrations

- [ ] Setup Vercel deployment

---

# Milestone 2 — Authentication

Goal: users can securely access their personal dashboard.

## Authentication system

- [x] Integrate Clerk authentication
  Priority: P0

- [x] Configure sign-in page
- [x] Configure sign-up page

- [x] Protect authenticated routes

Definition of done:

- unauthenticated users redirected to sign-in
- authenticated users access dashboard
- user ID available in server context

## User database sync

- [x] Sync Clerk user with database

Definition of done:

- User row created on first login
- userId stored in all domain entities

---

# Milestone 3 — Dashboard

Goal: landing page for authenticated users.

- [x] Dashboard layout
- [x] Quick stats widgets

Example metrics:

- applications count
- interviews
- offers
- rejections

Definition of done:

- dashboard loads under 500ms
- data scoped to authenticated user

---

# Milestone 4 — Applications CRUD

Goal: manage job applications.

## Data model

- [x] Implement Application Prisma model

Fields:

- company
- role
- location
- source
- status
- salaryMin
- salaryMax
- jobUrl
- notes
- appliedDate

## Backend

- [x] Create application
- [x] Update application
- [x] Delete application
- [x] Fetch user applications

Security requirement:

- every query must filter by `userId`

## UI

- [x] Application list page
- [x] Application creation form
- [x] Application edit form

Definition of done:

- user can create/update/delete applications
- only own applications are visible

---

# Milestone 5 — Applications Table

Goal: fast overview of applications.

- [ ] Table view

Columns:

- company
- role
- status
- location
- appliedDate
- lastActivity

- [x] Sorting
- [x] Filtering by status
- [x] Search by company

---

# Milestone 6 — Kanban Pipeline

Goal: visual job pipeline.

Columns:

- Wishlist
- Applied
- Interview
- Offer
- Rejected

Tasks:

- [x] Build Kanban board
- [x] Drag and drop status change
- [x] Persist status updates

Definition of done:

- moving cards updates database
- board scoped to authenticated user

---

# Milestone 7 — Reminders

Goal: follow-up reminders.

## Data model

- [x] Implement Reminder Prisma model

Fields:

- userId
- applicationId (optional)
- title
- dueDate

## Backend

- [x] Create reminder
- [x] List reminders
- [x] Mark reminder done

## UI

- [x] Reminders list
- [x] Reminder creation form

---

# Milestone 8 — Resume Attachments

Goal: attach resumes to applications.

- [x] Implement Resume model
- [x] Implement ApplicationAttachment

- [x] File upload (Vercel Blob)

- [x] Attach resume to application

Definition of done:

- user can upload multiple resumes
- applications can reference resume

---

# Milestone 9 — Basic Analytics

Goal: give users insight into job search progress.

- [ ] Applications per status chart
- [ ] Applications over time

Example metrics:

- response rate
- interview rate
- offer rate

---

# Milestone 10 — Billing & Plan Limits

Goal: monetize product.

- [ ] Stripe integration

Plans:

Free
Pro

Limits example:

Free:
- 50 applications

Pro:
- unlimited applications

Tasks:

- [x] Plan enforcement
- [x] Subscription UI
- [ ] Billing portal

---

# Milestone 11 — Launch Preparation

Goal: production-ready MVP.

## Security

- [ ] Validate user ownership checks
- [ ] Server-side validation

## Performance

- [x] Add DB indexes

Examples:

Application(userId, status)

## UX polish

- [x] Loading states
- [x] Error states
- [x] Empty states

## Release checklist

- [ ] Run launch checklist from docs/launch-checklist.md

---

# Follow-up tasks discovered during implementation

Add tasks here if implementation reveals missing work.

Example:

- [ ] Add DB index for Application(userId, updatedAt)
- [ ] Extract shared application form validation schema

---

# Bugs

Track implementation bugs.

Example:

- [ ] Kanban drag fails on mobile
- [ ] Reminder date timezone bug

---

# Technical debt

Non-critical improvements discovered during implementation.

Example:

- [ ] Extract application service layer
- [ ] Improve Prisma query typing
