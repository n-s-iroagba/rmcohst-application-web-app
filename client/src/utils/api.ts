import { Dispatch, SetStateAction } from 'react';

export const handleError = (
  error: unknown,
  setError: Dispatch<SetStateAction<string>>
) => {
  console.error('Failed to perform requested operation', error);
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('An error occurred while creating the resource.');
  }
};
