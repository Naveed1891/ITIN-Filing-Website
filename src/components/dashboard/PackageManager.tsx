"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Pencil, Plus, Trash2, X, Check, Package } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

interface PackageData {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  features: string[];
  isActive: boolean;
  orderCount: number;
  updatedAt: string;
}

type EditMode = { type: "edit"; pkg: PackageData } | { type: "create" } | null;

export function PackageManager({
  initialPackages,
  isSuperAdmin,
}: {
  initialPackages: PackageData[];
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(pkg: PackageData) {
    if (pkg.orderCount > 0) {
      setError(`Cannot delete "${pkg.name}" because it has ${pkg.orderCount} order(s). Deactivate it instead.`);
      return;
    }
    if (!confirm(`Delete "${pkg.name}"? This cannot be undone.`)) return;
    setDeleting(pkg.id);
    setError("");
    try {
      await apiFetch(`/api/admin/packages/${pkg.id}`, { method: "DELETE" });
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete package.");
    } finally {
      setDeleting(null);
    }
  }

  async function toggleActive(pkg: PackageData) {
    try {
      await apiFetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      setPackages((prev) => prev.map((p) => p.id === pkg.id ? { ...p, isActive: !p.isActive } : p));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update package.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && <div className="dash-error">{error}<button type="button" onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={14} /></button></div>}

      {editMode ? (
        <PackageForm
          mode={editMode}
          onDone={(updated) => {
            if (editMode.type === "create" && updated) {
              setPackages((prev) => [...prev, updated]);
            } else if (editMode.type === "edit" && updated) {
              setPackages((prev) => prev.map((p) => p.id === updated.id ? updated : p));
            }
            setEditMode(null);
            router.refresh();
          }}
          onCancel={() => setEditMode(null)}
        />
      ) : (
        <>
          {isSuperAdmin && (
            <div className="dash-actions">
              <button type="button" className="dash-btn dash-btn--primary" onClick={() => setEditMode({ type: "create" })}>
                <Plus size={15} /> Add package
              </button>
            </div>
          )}

          {packages.length === 0 ? (
            <div className="dash-panel">
              <div className="dash-empty">
                <p className="dash-empty__title">No packages</p>
                <p className="dash-empty__desc">Create your first package to get started.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="dash-panel" style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1B2B3A" }}>{pkg.name}</h3>
                        <span className={`dash-badge dash-badge--${pkg.isActive ? "ok" : "muted"}`}>
                          {pkg.isActive ? "active" : "inactive"}
                        </span>
                      </div>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "12px", color: "#9AA7B4" }}>{pkg.slug}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#205493", whiteSpace: "nowrap" }}>
                      ${(pkg.priceCents / 100).toFixed(2)}
                    </p>
                  </div>

                  <p style={{ margin: "0.75rem 0", fontSize: "13px", color: "#5A6B7B", lineHeight: 1.6 }}>
                    {pkg.description}
                  </p>

                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {pkg.features.map((f, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "13px", color: "#1B2B3A" }}>
                        <Check size={13} style={{ marginTop: "2px", flexShrink: 0, color: "#1f9d55" }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #E3E8EE", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#9AA7B4" }}>
                      {pkg.orderCount} order{pkg.orderCount !== 1 ? "s" : ""}
                    </span>
                    {isSuperAdmin && (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button type="button" className="dash-btn" onClick={() => toggleActive(pkg)} style={{ fontSize: "12px", padding: "0.35rem 0.65rem" }}>
                          {pkg.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button type="button" className="dash-btn" onClick={() => setEditMode({ type: "edit", pkg })} style={{ fontSize: "12px", padding: "0.35rem 0.65rem" }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <button type="button" className="dash-btn dash-btn--danger" onClick={() => handleDelete(pkg)} disabled={deleting === pkg.id} style={{ fontSize: "12px", padding: "0.35rem 0.65rem" }}>
                          {deleting === pkg.id ? <LoaderCircle size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PackageForm({
  mode,
  onDone,
  onCancel,
}: {
  mode: NonNullable<EditMode>;
  onDone: (pkg: PackageData | null) => void;
  onCancel: () => void;
}) {
  const isEdit = mode.type === "edit";
  const initial = isEdit ? mode.pkg : null;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceDollars, setPriceDollars] = useState(initial ? (initial.priceCents / 100).toString() : "");
  const [features, setFeatures] = useState(initial?.features.join("\n") ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const featureList = features.split("\n").map((f) => f.trim()).filter(Boolean);
    if (featureList.length === 0) {
      setError("Add at least one feature.");
      setSubmitting(false);
      return;
    }

    const priceCents = Math.round(parseFloat(priceDollars) * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError("Enter a valid price.");
      setSubmitting(false);
      return;
    }

    try {
      if (isEdit) {
        const result = await apiFetch<{ package: any }>(`/api/admin/packages/${initial!.id}`, {
          method: "PATCH",
          body: JSON.stringify({ name, description, priceCents, features: featureList, isActive }),
        });
        onDone({
          ...initial!,
          name,
          description,
          priceCents,
          features: featureList,
          isActive,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const result = await apiFetch<{ package: any }>("/api/admin/packages", {
          method: "POST",
          body: JSON.stringify({ slug, name, description, priceCents, currency: "USD", features: featureList, isActive }),
        });
        onDone({
          id: result.package.id,
          slug,
          name,
          description,
          priceCents,
          currency: "USD",
          features: featureList,
          isActive,
          orderCount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save package.");
      setSubmitting(false);
    }
  }

  return (
    <div className="dash-panel">
      <h2 className="dash-panel__title">{isEdit ? "Edit package" : "Create package"}</h2>
      <form className="dash-form" onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <label className="dash-label">
            Slug {isEdit && <span style={{ fontWeight: 400, color: "#9AA7B4" }}>(read-only)</span>}
            <input
              className="dash-input"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              required
              readOnly={isEdit}
              placeholder="new-itin-application"
              style={isEdit ? { opacity: 0.6 } : undefined}
            />
          </label>
          <label className="dash-label">
            Name
            <input className="dash-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} placeholder="New ITIN Application" />
          </label>
          <label className="dash-label">
            Price (USD)
            <input className="dash-input" type="number" value={priceDollars} onChange={(e) => setPriceDollars(e.target.value)} required min="0" step="0.01" placeholder="225.00" />
          </label>
        </div>

        <label className="dash-label">
          Description
          <textarea className="dash-input" value={description} onChange={(e) => setDescription(e.target.value)} required rows={2} maxLength={2000} placeholder="Brief description of this package" style={{ resize: "vertical" }} />
        </label>

        <label className="dash-label">
          Features <span style={{ fontWeight: 400, color: "#9AA7B4" }}>(one per line)</span>
          <textarea className="dash-input" value={features} onChange={(e) => setFeatures(e.target.value)} required rows={5} placeholder={"Form W-7 preparation guidance\nDocument requirements checklist\nGeneral email support"} style={{ resize: "vertical" }} />
        </label>

        <label className="dash-label" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ accentColor: "#205493" }} />
          Active (visible on website)
        </label>

        {error && <div className="dash-error">{error}</div>}

        <div className="dash-actions">
          <button type="submit" className="dash-btn dash-btn--primary" disabled={submitting}>
            {submitting ? <LoaderCircle size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Package size={15} />}
            {submitting ? " Saving…" : isEdit ? " Save changes" : " Create package"}
          </button>
          <button type="button" className="dash-btn" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
