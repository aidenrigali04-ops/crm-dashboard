export const STATUS_LABELS: Record<string, string> = {
  pending_profile: "Pending profile",
  profiled:        "Profiled",
  outreach_ready:  "Outreach ready",
  in_sequence:     "In sequence",
  replied:         "Replied",
  demo_booked:     "Demo booked",
  closed_won:      "Closed won",
  closed_lost:     "Closed lost",
  unsubscribed:    "Unsubscribed",
  bounced:         "Bounced",
};

export const STATUS_COLORS: Record<string, string> = {
  pending_profile: "bg-zinc-700 text-zinc-300",
  profiled:        "bg-blue-900/40 text-blue-400",
  outreach_ready:  "bg-purple-900/40 text-purple-400",
  in_sequence:     "bg-amber-900/40 text-amber-400",
  replied:         "bg-teal-900/40 text-teal-400",
  demo_booked:     "bg-green-900/40 text-green-400",
  closed_won:      "bg-green-900/60 text-green-300",
  closed_lost:     "bg-red-900/40 text-red-400",
  unsubscribed:    "bg-zinc-800 text-zinc-500",
  bounced:         "bg-zinc-800 text-zinc-500",
};

export const DISC_COLORS: Record<string, string> = {
  D: "text-red-400 bg-red-900/30",
  I: "text-amber-400 bg-amber-900/30",
  S: "text-green-400 bg-green-900/30",
  C: "text-blue-400 bg-blue-900/30",
};

export const DISC_LABELS: Record<string, string> = {
  D: "Dominant",
  I: "Influential",
  S: "Steady",
  C: "Conscientious",
};

export const INDUSTRY_LABELS: Record<string, string> = {
  hvac:          "HVAC",
  landscaping:   "Landscaping",
  construction:  "Construction",
  property_mgmt: "Property mgmt",
  plumbing:      "Plumbing",
  real_estate:   "Real estate",
  agency:        "Agency",
};
