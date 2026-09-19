const TONES: Record<string, string> = {
  green: "bg-[#e8f5ee] text-[#1b7a45] border-[#bfe6cf]",
  blue: "bg-[#e7f0fa] text-[#205493] border-[#c3dcf3]",
  amber: "bg-[#fbeccb] text-[#8a5a00] border-[#f0d79a]",
  gray: "bg-[#eef1f4] text-[#5A6B7B] border-[#dbe2e8]",
  red: "bg-[#fdf4f3] text-[#c0392b] border-[#f1d7d3]",
};

const STATUS_TONE: Record<string, keyof typeof TONES> = {
  PAID: "blue",
  PENDING_PAYMENT: "amber",
  APPLICATION_IN_PROGRESS: "amber",
  SUBMITTED: "blue",
  UNDER_REVIEW: "blue",
  MORE_INFO_REQUIRED: "amber",
  PROCESSING: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
  NOT_STARTED: "gray",
  DRAFT: "amber",
  NEEDS_CHANGES: "amber",
  ACCEPTED: "green",
};

export function humanizeStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[STATUS_TONE[status] ?? "gray"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${tone}`}>
      {humanizeStatus(status)}
    </span>
  );
}
