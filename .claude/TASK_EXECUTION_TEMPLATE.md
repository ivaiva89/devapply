# TASK_EXECUTION_TEMPLATE.md

## Task

\[Describe the feature, bug, or refactor clearly\]

## Product context

- Product: Developer Job Application Tracker
- Stage: MVP
- User: developer managing 20--200 job applications
- Goal: production-quality implementation without overengineering

## Technical context

- Stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Prisma,
  PostgreSQL
- Follow repository guidance in AGENTS.md
- Keep changes modular and scoped

## Objective

\[State the intended user-facing outcome\]

## Requirements

1.  \[Requirement\]
2.  \[Requirement\]
3.  \[Requirement\]

## Non-goals

- Do not modify unrelated flows
- Do not redesign unrelated UI
- Do not introduce unnecessary abstractions
- Do not add dependencies unless required

## Constraints

- Do not modify unrelated files
- Reuse current repo patterns
- Keep auth checks strict
- Validate inputs with Zod
- Keep database access server-side
- Enforce plan limits server-side

## Implementation Notes

- Identify affected feature modules
- Follow existing repository patterns
- Keep business logic server-side
- UI components focus on rendering and interaction
- If billing changes are involved, also update pricing, webhook, env,
  and entitlement docs in the same task

## Data Model Impact

- Schema changes required: \[yes/no\]
- Migration required: \[yes/no\]
- Seed updates required: \[yes/no\]
- Env changes required: \[yes/no\]

## Billing Impact

- Billing provider touched: \[none/Polar/other\]
- Hosted checkout flow changed: \[yes/no\]
- Webhook sync changed: \[yes/no\]
- Entitlement logic changed: \[yes/no\]

## Analytics Impact

- Track new events: \[yes/no\]
- Events to add/update: \[list\]

## Acceptance Criteria

- \[Behavior that must work\]
- \[Behavior that must work\]
- Loading state handled
- Empty state handled
- Error state handled
- Unauthorized access handled

## Verification

- [ ] Happy path verified
- [ ] Invalid input path verified
- [ ] Unauthorized path verified
- [ ] Empty state verified
- [ ] Loading state verified
- [ ] Error state verified

## Deliverables

1.  Implement the task
2.  Keep the diff focused
3.  Provide:
    - summary of changes
    - files changed
    - env or migration changes
    - analytics changes
    - follow-up improvements
    - risks or tradeoffs

## Definition of Done

- Feature works end-to-end
- Implementation follows repo conventions
- Security checks preserved
- Server-side validation enforced
