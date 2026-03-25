# Database Schema Notes

## Main entities

### User
Represents authenticated product user.

### Application
Main record for job tracking.
Each application belongs to one user.

Fields:
- company
- role
- location
- source
- status
- salaryMin
- salaryMax
- currency
- jobUrl
- notes
- appliedDate
- lastActivityAt

### Interview
Represents interview stages tied to an application.

### Resume
Represents uploaded resume versions.

### ApplicationAttachment
Allows attaching resumes or other files to applications.

### Reminder
Represents follow-up reminders for a user, optionally tied to an application.

## Status lifecycle
- WISHLIST
- APPLIED
- INTERVIEW
- OFFER
- REJECTED

## Source values
- LINKEDIN
- COMPANY_SITE
- REFERRAL
- INDEED
- WELLFOUND
- OTHER

## Important rules
- every row must be scoped to authenticated user
- all queries must filter by user ownership
- free plan limits must be enforced server-side

## Billing notes

- store normalized app plan state such as `FREE` and `PRO`
- store provider-specific identifiers separately from app-level
  entitlements
- webhook-driven synchronization should update internal billing state
  before access changes in the app
- billing provider code should stay swappable behind the billing module
