
import type { EditBiodataAttributes } from '@/types/biodata';
import { uploadFilePatch, axiosRequest } from '@/utils/Api.utils';

/**
 * Updates biodata record by ID.
 * 
 * @param id - The biodata record ID
 * @param data - Partial biodata fields or FormData when uploading file
 * @param isMultipart - Whether to use multipart/form-data
 * @returns Updated EditBiodataAttributes
 */
export async function updateBiodata(
  id: number,
  data: Partial<EditBiodataAttributes> | FormData,
  isMultipart = false
): Promise<EditBiodataAttributes> {
  const url = `/biodata/${id}`;
  if (isMultipart && data instanceof FormData) {
    return await uploadFilePatch<EditBiodataAttributes>(url, data);
  }

  return await axiosRequest<Partial<EditBiodataAttributes>, EditBiodataAttributes>(
    'PATCH',
    url,
    data as Partial<EditBiodataAttributes>
  );
}
