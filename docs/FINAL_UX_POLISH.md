# Final UX Polish

## 1. Order CTA status logic
Root cause: the order detail page hard-coded a "Continue application" button
regardless of status. Now `resolveApplicationCta(order)`
(`src/features/itin/application-cta.ts`) drives it from order + application status:

- NEEDS_CHANGES (application) or MORE_INFO_REQUIRED (order) → **Update Application**
  → `/application/[id]` (editable).
- SUBMITTED/ACCEPTED (application) or SUBMITTED/UNDER_REVIEW/PROCESSING/COMPLETED
  (order) → **Go Home** → `/` (locked, no editing).
- Otherwise (NOT_STARTED/DRAFT, PAID/APPLICATION_IN_PROGRESS) → **Continue
  Application** → `/application/[id]`.

`applicationStatusMessage(order)` updates the copy: completed → "your ITIN
service is complete"; submitted → "submitted… our team will review"; needs
changes → "we need a few updates". No "continue" language for submitted/completed.

## 2. Password UX changes
- **Show/Hide toggle** via a new reusable `PasswordField` (`src/components/ui/
  PasswordField.tsx`) — a real `<button type="button">` with `aria-label`
  ("Show password"/"Hide password") and `aria-pressed`, rendered inside the field
  through a new `FormField` `endAdornment` slot (so labels/aria stay consistent).
  Used on login (current password), signup (password + confirm password).
- **Live requirements checklist + strength meter** via `PasswordRequirements`
  (`src/components/ui/PasswordRequirements.tsx`): each rule shows pending vs met,
  updates as the user types, plus Weak/Good/Strong strength. Confirm-password
  mismatch updates live.

## 3. Shared password policy (client === server)
`src/lib/password.ts` is the single source of truth: **≥10 chars, one uppercase,
one lowercase, one number, not only spaces, must not contain the user's name or
email**, and confirm must match. Consumed by the client checklist, the client
submit guard (`isPasswordValid`), and the Zod `signupSchema` server validation
(`firstPasswordError`) — so the UI never accepts what the server rejects. Login
still only requires a non-empty password (no complexity re-check on existing
accounts). Symbols are encouraged for strength but not required (rules were
strengthened, never weakened).

## 4. Form UX changes
- Signup keeps entered values on validation failure (controlled inputs), focuses
  the first invalid field, shows a top error alert (`role="alert"`), inline field
  errors, `noValidate` to use our friendly messages, submit `disabled` while
  submitting (no double submit).
- Visible labels everywhere (FormField), required markers, correct input types
  (`email`, `tel`, `password`) and `inputMode`, autocomplete
  (`name`/`email`/`tel`/`country-name`/`current-password`/`new-password`),
  WhatsApp help text, clearer terms wording. No fields removed.

## 5. Accessibility improvements
`aria-invalid` + `aria-describedby` on invalid fields (FormField), password
toggle has an accessible label and is keyboard-focusable with a visible ring,
requirements list is `aria-live="polite"`, and CTAs are real anchors/buttons
(the order detail `<Link><Button>` nesting was replaced with styled `Link`s).

## 6. Tests added
`application-cta.test.ts` (status → label/href), `password.test.ts` (rules +
client/server consistency + strength), and source guards in
`password-ux.test.ts` (toggles, checklist wiring, kept values).
