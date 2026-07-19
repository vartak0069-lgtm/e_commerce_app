// Central API client - handles auth headers, base URL, and error parsing.
const API_BASE = '/api';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

async function apiRequest(endpoint, { method = 'GET', body, auth = true, isRetry = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh access token once if expired
  if (res.status === 401 && auth && !isRetry && getRefreshToken()) {
    const refreshed = await tryRefreshToken();
    if (refreshed) return apiRequest(endpoint, { method, body, auth, isRetry: true });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

async function tryRefreshToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    });
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    setTokens({ accessToken: data.data.accessToken });
    return true;
  } catch (err) {
    clearTokens();
    return false;
  }
}

const api = {
  get: (endpoint, opts) => apiRequest(endpoint, { ...opts, method: 'GET' }),
  post: (endpoint, body, opts) => apiRequest(endpoint, { ...opts, method: 'POST', body }),
  put: (endpoint, body, opts) => apiRequest(endpoint, { ...opts, method: 'PUT', body }),
  patch: (endpoint, body, opts) => apiRequest(endpoint, { ...opts, method: 'PATCH', body }),
  delete: (endpoint, opts) => apiRequest(endpoint, { ...opts, method: 'DELETE' }),
};
