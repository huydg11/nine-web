export const API_BASE = 'https://localhost:7295/api';

const token = localStorage.getItem('authToken');

export async function deleteWithStringBody(path, stringPayload) {
  const token = localStorage.getItem('authToken');

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stringPayload), // Send as JSON string
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status} for ${path}: ${errorText}`);
  }

  return res.text(); 
}



export async function getJSON(path) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);


  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


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

  return null;
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
