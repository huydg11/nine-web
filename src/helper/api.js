export const API_BASE = 'https://localhost:7295/api';

export async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}