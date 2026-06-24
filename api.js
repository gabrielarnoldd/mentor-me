import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_PORT = 4000;

function resolveBaseUrl() {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:${API_PORT}`;
    }
    return `http://localhost:${API_PORT}`;
  }

  // Em dispositivo/emulador usamos o mesmo host onde o Metro esta rodando
  // (ex.: "192.168.0.10:8081"), trocando a porta pela do backend.
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost || '';
  const host = hostUri.split(':')[0];
  if (host) {
    return `http://${host}:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();

async function fetchJson(path, options = {}) {
  const { headers, ...fetchOptions } = options;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
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

export async function uploadProfilePhoto(id, asset) {
  const formData = new FormData();
  const fileName = asset.fileName || asset.uri?.split('/').pop() || `profile-${Date.now()}.jpg`;
  const type = asset.mimeType || 'image/jpeg';

  if (asset.file) {
    formData.append('profilePhoto', asset.file, fileName);
  } else {
    formData.append('profilePhoto', {
      uri: asset.uri,
      name: fileName,
      type,
    });
  }

  return fetchJson(`/users/${id}/profile-photo`, {
    method: 'POST',
    body: formData,
  });
}

export async function requestPasswordReset(email) {
  return fetchJson('/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ email, code, password }) {
  return fetchJson('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, password }),
  });
}

export async function getUser(id) {
  return fetchJson(`/users/${id}`);
}

export async function getVideos() {
  return fetchJson('/videos');
}

export async function getVideoProgress(userId) {
  return fetchJson(`/videos/users/${userId}/progress`);
}

export async function startVideo(userId, videoId) {
  return fetchJson(`/videos/users/${userId}/${videoId}/start`, {
    method: 'POST',
  });
}

export async function finishVideo(userId, videoId) {
  return fetchJson(`/videos/users/${userId}/${videoId}/finish`, {
    method: 'POST',
  });
}

export async function getQuizQuestions(videoId) {
  return fetchJson(`/quizzes/${videoId}/questions`);
}

export async function getQuizResults(userId) {
  return fetchJson(`/quizzes/users/${userId}/results`);
}

export async function saveQuizResult(userId, videoId, { score, total }) {
  return fetchJson(`/quizzes/users/${userId}/${videoId}/results`, {
    method: 'POST',
    body: JSON.stringify({ score, total }),
  });
}
