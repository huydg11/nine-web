export const API_BASE = 'https://localhost:7295/api';

const token = localStorage.getItem('authToken');


// Generic GET request returning JSON
export async function getJSON(path) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
// Generic POST request sending and receiving JSON
export async function postJSON(path, data, isFormData = false) {
  const token = localStorage.getItem('authToken');

  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status} for ${path}: ${errorText}`);
  }

  const contentType = res.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }

  return null; // Or return res.text() if you want text instead
}


export async function getText(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.text();
}
