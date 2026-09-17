// Deprecated on purpose. Checkout selection state now comes exclusively from the
// URL (`/checkout?package=<slug>`). This module used to persist the selected
// package slug in localStorage, which risked reusing stale selection state
// across flows, so it no longer touches browser storage. Kept as an empty module
// only because the file is tracked; safe to delete once no tooling references it.
export {};
