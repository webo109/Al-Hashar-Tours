// Demo persistence: requests live in the visitor's browser only.

export type StoredRequest = {
  reference: string;
  slug: string;
  name: string;
  locale: string;
  date: string;
  endDate: string | null;
  adults: number;
  children: number;
  tier: string | null;
  pickup: string;
  contact: { name: string; phone: string; email: string };
  notes: string;
  estimate: number | null;
  message: string;
  createdAt: string;
};

const KEY = "al-hashar:requests";

export function loadRequests(): StoredRequest[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredRequest[]) : [];
  } catch {
    return [];
  }
}

export function saveRequest(request: StoredRequest) {
  try {
    const list = loadRequests().filter((r) => r.reference !== request.reference);
    list.unshift(request);
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // Storage can be unavailable in private windows; the request still works.
  }
}

export function findRequest(reference: string): StoredRequest | null {
  const needle = reference.trim().toUpperCase();
  if (!needle) return null;
  return loadRequests().find((r) => r.reference.toUpperCase() === needle) ?? null;
}
