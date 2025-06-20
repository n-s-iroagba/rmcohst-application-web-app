'use client'

import React from 'react'
import { Biodata } from '@/types/biodata'
import { useApplication } from '@/hooks/useApplication'
import { DynamicFormTextFields } from '@/helpers/formFields'

const excludeKeys: (keyof Biodata)[] = ['id', 'applicationId', 'passportPhotograph']

// These fields will use <textarea>
const textareaKeys: (keyof Biodata)[] = ['homeAddress', 'nextOfKinAddress']

const EditBiodataForm = () => {
  const { biodata, biodataErrors, handleChangeBiodata, handleSubmitBiodata } = useApplication()

  if (!biodata) return null

  return (
    <form onSubmit={handleSubmitBiodata} className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-800">Edit Biodata</h2>

      <DynamicFormTextFields
        data={biodata}
        errors={biodataErrors}
        onChange={handleChangeBiodata}
        excludeKeys={excludeKeys}
        textareaKeys={textareaKeys}
      />

      {/* File input for passportPhotograph */}
      <div>
        <label htmlFor="passportPhotograph" className="block font-medium text-gray-700 mb-1">
          Passport Photograph
        </label>
        <input
          type="file"
          id="passportPhotograph"
          name="passportPhotograph"
          accept="image/*"
          onChange={handleChangeBiodata}
          className={`w-full border rounded px-3 py-2 ${
            biodataErrors.passportPhotograph ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {biodataErrors.passportPhotograph && (
          <p className="text-red-600 text-sm mt-1">{biodataErrors.passportPhotograph}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Save Biodata
      </button>
    </form>
  )
}

export default EditBiodataForm
