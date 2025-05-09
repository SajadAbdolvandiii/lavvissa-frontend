/**
 * Advanced API Service with authorization, caching and retry mechanisms
 */

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// In-memory cache
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the auth token from sessionStorage
 */
const getAuthToken = () => {
    return sessionStorage.getItem('authToken');
};

/**
 * Clear API cache for a specific key or all
 * @param {string} key - The specific cache key to clear (optional)
 */
export const clearApiCache = (key = null) => {
    if (key) {
        apiCache.delete(key);
    } else {
        apiCache.clear();
    }
};

/**
 * Generate a cache key from request params
 */
const generateCacheKey = (endpoint, options) => {
    const { method = 'GET', body } = options;
    const bodyString = body ? JSON.stringify(body) : '';
    return `${method}:${endpoint}:${bodyString}`;
};

/**
 * Check if a response should be cached
 */
const isCacheable = (method, headers) => {
    return method === 'GET' && (!headers || !headers['Cache-Control'] || !headers['Cache-Control'].includes('no-cache'));
};

/**
 * Delay execution for a specified time
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make API request with retries, caching and authorization
 * 
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options
 * @param {boolean} useCache - Whether to use cache (default: true for GET)
 * @param {boolean} useAuth - Whether to use authentication token
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async(
    endpoint,
    options = {},
    useCache = options.method === undefined || options.method === 'GET',
    useAuth = true
) => {
    const {
        method = 'GET',
            body,
            headers = {},
            timeout = DEFAULT_TIMEOUT,
            retries = MAX_RETRIES,
            retryDelay = RETRY_DELAY,
            ...restOptions
    } = options;

    // Create request URL
    const url = endpoint.startsWith('http') ?
        endpoint :
        `${API_BASE_URL}${endpoint}`;

    // Generate cache key if caching is enabled
    const cacheKey = useCache ? generateCacheKey(endpoint, options) : null;

    // Check cache
    if (useCache && cacheKey && apiCache.has(cacheKey)) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData.expiry > Date.now()) {
            return cachedData.data;
        } else {
            // Clear expired cache
            apiCache.delete(cacheKey);
        }
    }

    // Set up headers
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    // Add authentication token if needed
    if (useAuth) {
        const token = getAuthToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // Set up request options
    const requestOptions = {
        method,
        headers: requestHeaders,
        ...restOptions
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Set up timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    requestOptions.signal = controller.signal;

    // Implement retry logic
    let lastError = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            // Add retry header for logging/debugging
            if (attempt > 0) {
                requestOptions.headers['X-Retry-Attempt'] = attempt.toString();
            }

            // Make the request
            const response = await fetch(url, requestOptions);

            // Clear timeout
            clearTimeout(timeoutId);

            // Check response status
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const error = new Error(
                    errorData ? .message || `API Error: ${response.status}`
                );
                error.status = response.status;
                error.data = errorData;

                // Handle different error statuses
                if (response.status === 401) {
                    // Handle authentication error (redirect to login, etc.)
                    window.dispatchEvent(new CustomEvent('authRequired'));
                    throw error;
                } else if (response.status === 403) {
                    // Handle authorization error
                    window.dispatchEvent(new CustomEvent('authForbidden'));
                    throw error;
                } else if (response.status >= 500) {
                    // Server errors can be retried
                    lastError = error;
                    if (attempt < retries) {
                        await delay(retryDelay * (attempt + 1)); // Exponential backoff
                        continue;
                    }
                    throw error;
                } else {
                    // Client errors should not be retried
                    throw error;
                }
            }

            // Process and cache successful response
            let data;
            const contentType = response.headers.get('Content-Type') || '';

            if (contentType.includes('application/json')) {
                data = await response.json();
            } else if (contentType.includes('text/')) {
                data = await response.text();
            } else {
                // Handle binary responses or other types as needed
                data = await response.blob();
            }

            // Cache the response if cacheable
            if (useCache && cacheKey && isCacheable(method, headers)) {
                apiCache.set(cacheKey, {
                    data,
                    expiry: Date.now() + CACHE_DURATION
                });
            }

            return data;
        } catch (error) {
            lastError = error;

            // Don't retry on abort or certain errors
            if (
                error.name === 'AbortError' ||
                (error.status && error.status < 500) ||
                attempt >= retries
            ) {
                throw error;
            }

            // Wait before retrying
            await delay(retryDelay * (attempt + 1));
        }
    }

    throw lastError;
};

/**
 * Convenience methods for common HTTP verbs
 */
export const apiGet = (endpoint, options = {}, useCache = true, useAuth = true) =>
    apiRequest(endpoint, {...options, method: 'GET' }, useCache, useAuth);

export const apiPost = (endpoint, data, options = {}, useAuth = true) =>
    apiRequest(endpoint, {...options, method: 'POST', body: data }, false, useAuth);

export const apiPut = (endpoint, data, options = {}, useAuth = true) =>
    apiRequest(endpoint, {...options, method: 'PUT', body: data }, false, useAuth);

export const apiPatch = (endpoint, data, options = {}, useAuth = true) =>
    apiRequest(endpoint, {...options, method: 'PATCH', body: data }, false, useAuth);

export const apiDelete = (endpoint, options = {}, useAuth = true) =>
    apiRequest(endpoint, {...options, method: 'DELETE' }, false, useAuth);

export default {
    request: apiRequest,
    get: apiGet,
    post: apiPost,
    put: apiPut,
    patch: apiPatch,
    delete: apiDelete,
    clearCache: clearApiCache
};