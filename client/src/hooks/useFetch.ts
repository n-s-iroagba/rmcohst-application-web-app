import { axiosRequest } from "@/utils/Api.utils";
import { useState, useEffect } from "react";


type Status = 'idle' | 'loading' | 'success' | 'error';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  status: Status;
}

/**
 * Generic hook for fetching a list of items.
 * @param getUrl - A function returning the URL string.
 */
export function useFetchList<T>(getUrl: () => string): FetchState<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<unknown|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const url = getUrl();
        const response = await axiosRequest<undefined, T[]>('GET', url);
        setData(response);
        setStatus('success');
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    };

    fetchData();
  }, [getUrl]);

  return { data, loading: status === 'loading', error, status };
}

/**
 * Generic hook for fetching a single item.
 * @param getUrl - A function returning the URL string.
 */
export function useFetchItem<T>(getUrl: () => string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<unknown|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const url = getUrl();
        const response = await axiosRequest<undefined, T>('GET', url);
        setData(response);
        setStatus('success');
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    };

    fetchData();
  }, [getUrl]);

  return { data, loading: status === 'loading', error, status };
}
