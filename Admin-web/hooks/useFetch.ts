'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

const useFetch = <T,>(
  apiCall: (params?: any) => Promise<{ data: T }>,
  options: UseFetchOptions = {}
) => {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(params);
      
      // Direct data access (no success property)
      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      console.error('API Error:', err);
      
      let errorMessage = 'An error occurred';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout';
      } else if (err.response) {
        errorMessage = err.response.data?.message || `Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = err.message || 'Unexpected error';
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};

export default useFetch;