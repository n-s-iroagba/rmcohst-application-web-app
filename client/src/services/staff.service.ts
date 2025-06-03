
import type { StaffAttributes, StaffCreationAttributes } from '@/types/staff';
import { axiosRequest } from '@/utils/Api.utils';

/**
 * Get the endpoint for a single staff by ID.
 */
const staffByIdEndpoint = (id: number) => `/staff/${id}`;

/**
 * Create a new staff entry.
 */
export async function createStaff(
  payload: StaffCreationAttributes
): Promise<StaffAttributes> {
  return axiosRequest<StaffCreationAttributes, StaffAttributes>('POST', '/staff', payload);
}

/**
 * Update an existing staff entry by ID.
 */
export async function updateStaff(
  id: number,
  payload: StaffCreationAttributes
): Promise<StaffAttributes> {
  return axiosRequest<StaffCreationAttributes, StaffAttributes>('PATCH', staffByIdEndpoint(id), payload);
}

/**
 * Delete a staff entry by ID.
 */
export async function deleteStaff(id: number): Promise<{ message: string }> {
  return axiosRequest<undefined, { message: string }>('DELETE', staffByIdEndpoint(id));
}
