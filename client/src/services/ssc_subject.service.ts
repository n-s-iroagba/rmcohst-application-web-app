import { SSCSubjectAttributes, SSCSubjectCreationAttributes } from "@/types/ssc_subject";
import { axiosRequest } from "@/utils/Api.utils";


// Build endpoint with ID
const subjectByIdEndpoint = (id: number) => `/ssc-subjects/${id}`;

/**
 * Create a new SSC subject.
 */
export async function createSSCSubject(
  payload: SSCSubjectCreationAttributes
): Promise<SSCSubjectAttributes> {
  return axiosRequest<SSCSubjectCreationAttributes, SSCSubjectAttributes>(
    'POST',
    '/ssc-subjects',
    payload
  );
}

/**
 * Update an existing SSC subject by ID.
 */
export async function updateSSCSubject(
  id: number,
  payload: SSCSubjectCreationAttributes
): Promise<SSCSubjectAttributes> {
  return axiosRequest<SSCSubjectCreationAttributes, SSCSubjectAttributes>(
    'PATCH',
    subjectByIdEndpoint(id),
    payload
  );
}

/**
 * Delete an SSC subject by ID.
 */
export async function deleteSSCSubject(id: number): Promise<{ message: string }> {
  return axiosRequest<undefined, { message: string }>('DELETE', subjectByIdEndpoint(id));
}
