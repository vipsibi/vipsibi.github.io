import { mockRequest } from './mockApi';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(method, url, body, config = {}) {
    if (USE_MOCK) return mockRequest(method, url, body, config);

    const query = new URLSearchParams(config.params || {}).toString();
    const response = await fetch(`${API_URL}${url}${query ? `?${query}` : ''}`, {
        method,
        headers: body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
        body: body == null ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.response = { data };
        throw error;
    }
    return { data };
}

const api = {
    get: (url, config) => request('GET', url, null, config),
    post: (url, data, config) => request('POST', url, data, config),
    put: (url, data, config) => request('PUT', url, data, config),
    delete: (url, config) => request('DELETE', url, null, config),
};

export default api;