# AI_WORKFLOW.md

This document defines the **AI-driven development workflow** used in
this repository.

The repository is structured so that AI coding agents (Codex CLI,
Copilot, Cursor, etc.) can reliably implement features while maintaining
project structure and documentation integrity.

------------------------------------------------------------------------

# Core Principle

The repository operates with **task-driven development**.

Agents must not implement arbitrary changes.

All work must originate from:

NEXT_TASK.md

------------------------------------------------------------------------

# Workflow Overview

Step 1 --- Read project context

Agent reads:

AGENTS.md\
ARCHITECTURE.md\
PRODUCT.md (if needed)

Purpose:

Understand system architecture and constraints.

------------------------------------------------------------------------

Step 2 --- Read the active task

Agent reads:

NEXT_TASK.md

This file contains:

-   exact task
-   requirements
-   definition of done
-   files expected to change

Agent must **only implement this task**.

------------------------------------------------------------------------

Step 3 --- Implement the task

Agent writes code following rules in:

AGENTS.md

Guidelines:

-   minimal scope changes
-   follow modular monolith architecture
-   maintain user ownership rules
-   maintain type safety

------------------------------------------------------------------------

Step 4 --- Validate implementation

Agent verifies:

• code compiles\
• Prisma schema valid (if changed)\
• lint passes\
• TypeScript types pass\
• Storybook runs for UI-only work\
• affected docs still match the codebase

------------------------------------------------------------------------

Step 5 --- Update TASKS.md

After completing the task:

1.  Mark the task as completed:

\[x\] Task name

2.  If implementation reveals additional work, create tasks in:

TASKS.md → Follow-up tasks\
or\
TASKS_AUDIT_FOLLOWUPS.md for audit-specific findings

Examples:

-   missing index
-   missing validation
-   UI state improvements

------------------------------------------------------------------------

Step 6 --- Advance workflow

Agent must update:

NEXT_TASK.md

with the **next task from TASKS.md**.

The repository must always contain:

exactly one active task.

------------------------------------------------------------------------

# Safety Rules

Agents must not:

• expand scope silently\
• refactor unrelated modules\
• introduce new dependencies without justification\
• bypass authentication ownership checks

If improvements are discovered:

Add them to:

TASKS.md → Technical debt

------------------------------------------------------------------------

# Repository AI Control Files

The repository uses the following files to guide AI development:

AGENTS.md --- implementation rules\
TASKS.md --- implementation backlog\
NEXT_TASK.md --- active task pointer\
AI_WORKFLOW.md --- AI workflow definition

------------------------------------------------------------------------

# Benefits of this workflow

This structure enables:

• predictable AI implementations\
• minimal scope drift\
• automatic backlog maintenance\
• easier collaboration between humans and AI agents

------------------------------------------------------------------------

# Human Developer Responsibilities

Humans should:

• review AI pull requests\
• maintain TASKS.md milestones\
• update architecture docs when necessary

AI agents should handle:

• task implementation\
• code scaffolding\
• documentation updates related to tasks\
• Storybook and UI workflow doc maintenance when tooling changes

------------------------------------------------------------------------

# Long-term scaling

As the project grows, the same workflow can scale to:

• multiple feature modules\
• automated task execution\
• CI-triggered AI implementations

The same structure remains stable even as the codebase grows.
