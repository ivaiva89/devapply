# TASK_EXECUTION_TEMPLATE.md

## Task
[Describe the feature, bug, or refactor clearly]

## Product context
- Product: Developer Job Application Tracker
- Stage: MVP
- User: developer managing 20-200 job applications
- Goal: production-quality implementation without overengineering

## Technical context
- Stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Prisma, PostgreSQL
- Follow repository guidance in AGENTS.md
- Keep changes modular and scoped

## Requirements
1. [Requirement]
2. [Requirement]
3. [Requirement]

## Constraints
- Do not modify unrelated files
- Reuse current repo patterns
- Keep auth checks strict
- Validate inputs with Zod
- Keep database access server-side
- Enforce plan limits server-side where relevant

## Acceptance criteria
- [Behavior that must work]
- [Behavior that must work]
- [States that must be handled: loading, empty, error]

## Deliverables
1. Implement the task
2. Keep the diff focused
3. Provide:
   - summary of changes
   - files changed
   - env or migration changes
   - follow-up improvements
   - risks or tradeoffs
