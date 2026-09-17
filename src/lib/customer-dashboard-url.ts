/**
 * Links to the ITINFiling customer dashboard. The dashboard is now part of this
 * app (same origin) at /dashboard, so these return relative local paths.
 */
export function customerDashboardUrl(path = "/dashboard"): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/** Prefer the public order reference in customer dashboard order-detail URLs. */
export function customerOrderDetailUrl(order: {
  reference?: string | null;
  id?: string | null;
}): string {
  const identifier = order.reference?.trim() || order.id?.trim();
  if (!identifier) return customerDashboardUrl("/dashboard/orders");
  return customerDashboardUrl(`/dashboard/orders/${encodeURIComponent(identifier)}`);
}
