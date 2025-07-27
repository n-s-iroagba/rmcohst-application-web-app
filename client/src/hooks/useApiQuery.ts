import { useState, useEffect } from 'react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { handleError } from '@/utils/api';
import api from '@/lib/apiUtils';
import { ChangeHandler } from '@/types/fields_config';

type TransformFn = (name: string, value: string) => any;

export function usePostBulk<T, U>(
  postResourceUrl: string,
  tempItem: T,
  onCreateFn: () => void,
  transformField?: (name: string, value: any) => any
) {
  const [postResources, setPostResources] = useState<T[]>([tempItem]);
  const [postResponse, setPostResponse] = useState<U | null>(null);
  const [apiError, setApiError] = useState<string>('');

  const mutation: UseMutationResult<U, unknown, T[]> = useMutation<
    U,
    unknown,
    T[]
  >({
    mutationFn: async (payload: T[]) => {
      try {
        const response = await api.post(postResourceUrl, payload);
        return response.data as U;
      } catch (error) {
        handleError(error, setApiError);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setPostResponse(data);
      setApiError('');
    },
    onError: (err: unknown) => {
      handleError(err, setApiError);
    },
  });

  const addItem = () => {
    setPostResources((prev) => [...prev, tempItem]);
  };

  const removeItem = (index: number) => {
    setPostResources((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const handleChangeItems = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const transformedValue = transformField
      ? transformField(name, value)
      : value;

    setPostResources((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [name]: transformedValue,
      },
      ...prev.slice(index + 1),
    ]);
  };

  const handleSubmitItems = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(postResources);
      onCreateFn();
    } catch (err) {
      // Error is already handled in onError callback
      console.error('Submit failed:', err);
    }
  };

  return {
    items: postResources,
    postResponse,
    loading: mutation.isPending,
    error: apiError,
    addItem,
    removeItem,
    handleChangeItems,
    handleSubmitItems,
  };
}

// Alternative approach with separate, type-safe handlers

export const usePost = <T, U>(
  postResourceUrl: string,
  initialData: T,
  transformField?: TransformFn
) => {
  const [postResource, setPostResource] = useState<T>(initialData);
  const [postResponse, setPostResponse] = useState<U | null>(null);
  const [apiError, setApiError] = useState<string>('');

  const mutation = useMutation<U, unknown, T>({
    mutationFn: async (payload: T) => {
      try {
        const response = await api.post(postResourceUrl, payload);
   
        return response.data as U;
      } catch (error) {
        handleError(error, setApiError);
        throw error;
      }
    },
    onSuccess: (data: U) => {
      setPostResponse(data);
      setApiError('');
    },
    onError: (err: unknown) => {
      handleError(err, setApiError);
    },
  });

  // Handler for text inputs, textareas, selects, etc.
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const transformedValue = transformField ? transformField(name, value) : value;

    setPostResource((prev) => ({
      ...prev,
      [name]: transformedValue,
    }));
  };

  // Handler specifically for checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setPostResource((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handler for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;

    setPostResource((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Generic handler that routes to appropriate specific handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { type } = e.target;
    
    switch (type) {
      case 'checkbox':
        handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>);
        break;
      case 'file':
        handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
        break;
      default:
        handleTextChange(e);
        break;
    }
  };

  const handlePost = async (e: React.FormEvent<HTMLFormElement>|React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(postResource);
    } catch (error) {
      console.error('Post failed:', error);
    }
  };

  // Create comprehensive change handlers for different field types
  const changeHandlers: ChangeHandler = {
    text: handleTextChange,
    password: handleTextChange,
    email: handleTextChange,
    textarea: handleTextChange,
    select: handleTextChange,
    checkbox: handleCheckboxChange,
    radio: handleTextChange,
    date: handleTextChange,
    file: handleFileChange,
  };

  return {
    postResource,
    postResponse,
    posting: mutation.isPending,
    apiError,
    changeHandlers,
    handlePost,
    handleChange,
    handleTextChange,
    handleCheckboxChange,
    handleFileChange,
  };
};

export const useGet = <T>(resourceUrl: string | null) => {
  const [apiError, setApiError] = useState('');

  if (!resourceUrl) {
    return {
      resourceData: undefined,
      loading: false,
      error: '',
      refetch: async () => ({ data: undefined } as any), // noop
    };
  }

  const {
    data: resourceData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<T, unknown>({
    queryKey: [resourceUrl],
    queryFn: async () => {
      try {
        const response = await api.get(resourceUrl);
        return response.data;
      } catch (error) {
        handleError(error, setApiError);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        if (
          axiosError.code === 'ERR_NETWORK' ||
          (axiosError.response &&
            axiosError.response.status >= 400 &&
            axiosError.response.status < 500)
        ) {
          return false;
        }
      }
      return failureCount < 3;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (isError && error) {
      handleError(error, setApiError);
    }
  }, [isError, error]);

  return {
    resourceData,
    loading: isLoading,
    error: apiError || (isError ? 'An error occurred while fetching data' : ''),
    refetch,
  };
};


export const usePut = <T, U>(
  putUrl: string,
  initialData: T,
  transformField?: (name: string, value: string) => any
) => {
  const [putResource, setPutResource] = useState<T>(initialData);
  const [putResponse, setPutResponse] = useState<U | null>(null);
  const [apiError, setApiError] = useState('');

  const mutation = useMutation<U, unknown, T>({
    mutationFn: async (payload: T) => {
      try {
        const response = await api.put(putUrl, payload);
        return response.data;
      } catch (error) {
        handleError(error, setApiError);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setPutResponse(data);
      setApiError('');
    },
    onError: (err: unknown) => {
      handleError(err, setApiError);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const transformedValue = transformField
      ? transformField(name, value)
      : value;

    setPutResource((prev) => ({
      ...prev,
      [name]: transformedValue,
    }));
  };

  const handlePut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(putResource);
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Put failed:', error);
    }
  };

  return {
    putResource,
    putResponse,
    updating: mutation.isPending,
    apiError,
    handleChange,
    handlePut,
  };
};

export const useDelete = <U>(resourceUrl: string) => {
  const [deleteResponse, setDeleteResponse] = useState<U | null>(null);
  const [apiError, setApiError] = useState('');

  const mutation = useMutation<U, unknown, void>({
    mutationFn: async () => {
      try {
        const response = await api.delete(resourceUrl);
        return response.data;
      } catch (error) {
        handleError(error, setApiError);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setDeleteResponse(data);
      setApiError('');
    },
    onError: (err: unknown) => {
      handleError(err, setApiError);
    },
  });

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync();
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Delete failed:', error);
    }
  };

  return {
    deleteResponse,
    deleting: mutation.isPending,
    apiError,
    handleDelete,
  };
};