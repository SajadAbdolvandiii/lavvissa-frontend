import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Custom React hook for making API calls with state management
 * 
 * @param {string} endpoint - API endpoint to call
 * @param {object} options - Request options
 * @param {boolean} fetchOnMount - Whether to fetch data when component mounts
 * @returns {object} - { data, loading, error, fetchData, updateData }
 */
export const useApi = (endpoint, options = {}, fetchOnMount = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    // Store the options in a ref to avoid triggering effect on options change
    const optionsRef = useRef(options);

    // Keep endpoint in a ref for the callbacks below
    const endpointRef = useRef(endpoint);

    // Update refs when props change
    useEffect(() => {
        endpointRef.current = endpoint;
        optionsRef.current = options;
    }, [endpoint, options]);

    // Function to fetch data from API
    const fetchData = useCallback(async(overrideOptions = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Combine default options with overrideOptions
            const requestOptions = {...optionsRef.current, ...overrideOptions };

            // Make the API request
            const response = await api.request(endpointRef.current, requestOptions);

            // Only update state if component is still mounted
            if (isMounted.current) {
                setData(response);
                setLoading(false);
            }

            return response;
        } catch (err) {
            // Only update state if component is still mounted
            if (isMounted.current) {
                setError(err);
                setLoading(false);
            }

            throw err;
        }
    }, []);

    // Function to update data without making API call
    const updateData = useCallback((newData) => {
        setData(prevData => {
            if (typeof newData === 'function') {
                return newData(prevData);
            }
            return newData;
        });
    }, []);

    // Fetch data on mount if enabled
    useEffect(() => {
        if (fetchOnMount) {
            fetchData();
        }

        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted.current = false;
        };
    }, [fetchData, fetchOnMount]);

    return { data, loading, error, fetchData, updateData };
};

/**
 * Hook for making POST requests
 */
export const usePost = (endpoint, options = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const isMounted = useRef(true);

    // Store options in a ref
    const optionsRef = useRef(options);

    // Update options ref when it changes
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    // Post function
    const postData = useCallback(async(body, overrideOptions = {}) => {
        setLoading(true);
        setError(null);

        try {
            const requestOptions = {...optionsRef.current, ...overrideOptions };
            const response = await api.post(endpoint, body, requestOptions);

            if (isMounted.current) {
                setData(response);
                setLoading(false);
            }

            return response;
        } catch (err) {
            if (isMounted.current) {
                setError(err);
                setLoading(false);
            }

            throw err;
        }
    }, [endpoint]);

    // Reset function
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return { postData, data, loading, error, reset };
};

/**
 * Hook for making multi-part form uploads
 */
export const useFileUpload = (endpoint, options = {}) => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const abortController = useRef(new AbortController());

    // Upload function
    const uploadFile = useCallback(async(file, additionalData = {}) => {
        // Reset state
        setLoading(true);
        setError(null);
        setProgress(0);

        // Create a new abort controller for this upload
        abortController.current = new AbortController();

        try {
            // Create a new abort controller for this upload
            abortController.current = new AbortController();

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // Add any additional fields
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Custom fetch with progress monitoring
            const xhr = new XMLHttpRequest();

            // Create a promise to handle the XHR
            const uploadPromise = new Promise((resolve, reject) => {
                // Set up progress handler
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progressPercent = Math.round((event.loaded / event.total) * 100);
                        setProgress(progressPercent);
                    }
                });

                // Set up load handler
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            setData(response);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('Invalid response format'));
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                // Set up error handler
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                // Set up abort handler
                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload aborted'));
                });

                // Open and send the request
                xhr.open('POST', endpoint);

                // Add headers from options
                if (options.headers) {
                    Object.entries(options.headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                // Add authorization header if available
                const token = sessionStorage.getItem('authToken');
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }

                xhr.send(formData);
            });

            // Handle abort controller
            abortController.current.signal.addEventListener('abort', () => {
                xhr.abort();
            });

            // Wait for upload to complete
            const response = await uploadPromise;
            setLoading(false);
            return response;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    }, [endpoint, options]);

    // Cancel upload function
    const cancelUpload = useCallback(() => {
        abortController.current.abort();
        setLoading(false);
    }, []);

    return { uploadFile, cancelUpload, progress, loading, error, data };
};

export default useApi;