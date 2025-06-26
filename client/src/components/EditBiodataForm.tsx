'use client'

import React from 'react'
import { Biodata } from '@/types/biodata'
import { useApplication } from '@/hooks/useApplication'
import { DynamicFormTextFields } from '@/helpers/formFields'
import { FieldType } from '@/types/fields_config'

const excludeKeys: (keyof Biodata)[] = ['id', 'applicationId', 'passportPhotograph']

// These fields will use <textarea>
const textareaKeys: (keyof Biodata)[] = ['homeAddress', 'nextOfKinAddress']

const EditBiodataForm = () => {
  const { biodata, biodataErrors, handleChangeBiodata, handleSubmitBiodata } = useApplication()

  if (!biodata) return null
  const biodataFieldsConfig = {
    id: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    applicationId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    lastName: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    middleName: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    surname: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    gender: { type: 'select' as FieldType, onChangeHandler: onChangeFn },
    dateOfBirth: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
    maritalStatus: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    homeAddress: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    nationality: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    stateOfOrigin: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    lga: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    homeTown: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    phoneNumber: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    emailAddress: { type: 'email' as FieldType, onChangeHandler: onChangeFn },
    passportPhotograph: { type: 'file' as FieldType, onChangeHandler: onChangeFn },
    nextOfKinFullName: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    nextOfKinPhoneNumber: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    nextOfKinAddress: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    relationshipWithNextOfKin: { type: 'text' as FieldType, onChangeHandler: onChangeFn }
  }

  return (
    <form onSubmit={handleSubmitBiodata} className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-slate-800">Edit Biodata</h2>

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
        className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition"
      >
        Save Biodata
      </button>
    </form>
  )
}

export default EditBiodataForm
