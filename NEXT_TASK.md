This file defines the **single active implementation task** for the
repository.

All coding agents (Codex CLI, Copilot, Cursor, etc.) must:

1.  Read this file before starting implementation.
2.  Follow rules defined in `AGENTS.md`.
3.  Implement exactly the task described below.
4.  After completing the task:
    - Update `TASKS.md`
    - Replace this file with the next task.

`NEXT_TASK.md` must always contain **exactly one active task**.

---

# Task

Verify the **Polar checkout, webhook sync, and cancel/downgrade flow**
in a real sandbox environment and document the results.

---

# Context

Relevant documentation:

docs/polar-sandbox-setup.md\
docs/launch-checklist.md\
TASKS_AUDIT_FOLLOWUPS.md

Likely files:

docs/polar-sandbox-setup.md\
docs/launch-checklist.md\
TASKS.md\
TASKS_AUDIT_FOLLOWUPS.md

---

# Requirements

The repository now has hosted checkout, webhook sync, customer portal,
and a backfill path, but the remaining billing gap is operational
verification in a real Polar sandbox environment.

Requirements:

- validate checkout initiation against a working Polar sandbox setup
- validate webhook-driven entitlement changes from `FREE` to `PRO`
- validate cancel or downgrade behavior as far as the current Polar
  setup supports it
- document what was verified, what remains environment-dependent, and
  any observed edge cases
- update launch and follow-up docs to reflect the real verification
  state

---

# Security Rules

Do not mark billing verification complete unless a real sandbox flow was
actually exercised.

---

# Migration

No database migration is expected.

---

# Definition of Done

Task is complete when:

- the real Polar sandbox flow has been exercised and documented
- launch and follow-up docs match the verified state
- `TASKS.md` is updated
- `NEXT_TASK.md` is replaced with the next active task

---

# Files likely to change

docs/polar-sandbox-setup.md\
docs/launch-checklist.md\
TASKS.md\
TASKS_AUDIT_FOLLOWUPS.md

---

# After completion

1.  Update `TASKS.md`

2.  If additional work is discovered, add tasks under:

`TASKS_AUDIT_FOLLOWUPS.md`

3.  Replace this file with the next task.
