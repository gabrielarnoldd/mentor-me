const API_BASE_URL = 'http://localhost:4000';

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error || 'Erro de comunicação com o servidor');
  }

  return body;
}

export async function login({ email, password }) {
  return fetchJson('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ name, email, password }) {
  return fetchJson('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function updateUser(id, payload) {
  return fetchJson(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getUser(id) {
  return fetchJson(`/users/${id}`);
}
