"use client"

import React, { useEffect } from "react"
import { Biodata } from "@/types/biodata"
import { useApplication } from "@/hooks/useApplication"
import { formatCamelCase } from "@/utils/formatCamelCase"



const EditBiodataForm = () => {
  const {
    biodata,
    biodataErrors,
    setInitialBiodata,
    handleChangeBiodata,
    handleSubmitBiodata,
  } = useApplication()

  useEffect(() => {
    setInitialBiodata(biodata)
  }, [biodata])

  if (!biodata) return null

  return (
    <form onSubmit={handleSubmitBiodata} className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-800">Edit Biodata</h2>

      {Object.entries(biodata).map(([key, value]) => {
        if (["id", "applicationId", "passportPhotograph"].includes(key)) return null

        const typedKey = key as keyof Biodata
        const isTextArea = key.toLowerCase().includes("address")

        return (
          <div key={key}>
            <label htmlFor={key} className="block font-medium text-gray-700 mb-1">
              {formatCamelCase(key)}
            </label>
            {isTextArea ? (
              <textarea
                id={key}
                name={key}
                className={`w-full border rounded px-3 py-2 ${
                  biodataErrors[typedKey] ? "border-red-500" : "border-gray-300"
                }`}
                value={value as string}
                onChange={handleChangeBiodata}
              />
            ) : (
              <input
                id={key}
                name={key}
                type={key === "dateOfBirth" ? "date" : "text"}
                className={`w-full border rounded px-3 py-2 ${
                  biodataErrors[typedKey] ? "border-red-500" : "border-gray-300"
                }`}
                value={
                  key === "dateOfBirth"
                    ? new Date(value as Date).toISOString().substring(0, 10)
                    : String(value)
                }
                onChange={handleChangeBiodata}
              />
            )}
            {biodataErrors[typedKey] && (
              <p className="text-red-600 text-sm mt-1">{biodataErrors[typedKey]}</p>
            )}
          </div>
        )
      })}

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
            biodataErrors.passportPhotograph ? "border-red-500" : "border-gray-300"
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
