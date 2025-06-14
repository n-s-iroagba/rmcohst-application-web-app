"use client"

import { useState, type ChangeEvent, type FormEvent, useEffect } from "react"
import { getBiodataByApplicationId, updateBiodataByApplicationId } from "@/services/biodata.service"
import type { EditBiodataAttributes } from "@/types/biodata"
import type { BiodataAttributes } from "@/types/biodata" // Ensure BiodataAttributes is imported if not already

interface EditBiodataFormProps {
  applicationId: number
  onSuccess?: (updated: EditBiodataAttributes) => void
}

const EditBiodataForm = ({ applicationId, onSuccess }: EditBiodataFormProps) => {
  const [initialData, setInitialData] = useState<BiodataAttributes | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [formData, setFormData] = useState<EditBiodataAttributes>({
    id: 0, // Initialize with a sensible default, will be updated from fetched data
    applicationId,
    firstName: "",
    middleName: null,
    surname: "",
    gender: "",
    dateOfBirth: undefined,
    maritalStatus: "",
    homeAddress: "",
    nationality: "",
    stateOfOrigin: "",
    lga: "",
    homeTown: "",
    phoneNumber: "",
    emailAddress: "",
    passportPhotograph: undefined,
    nextOfKinFullName: "",
    nextOfKinPhoneNumber: "",
    nextOfKinAddress: "",
    relationshipWithNextOfKin: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (applicationId) {
      setFetchLoading(true)
      getBiodataByApplicationId(applicationId)
        .then((response) => {
          if (response.data && Object.keys(response.data).length > 0) {
            setInitialData(response.data)
            setFormData({
              ...response.data,
              applicationId, // ensure applicationId is part of formData if needed by backend
              id: response.data.id, // ensure id (biodata.id) is part of formData
              dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth) : undefined,
              passportPhotograph: undefined, // File input handled separately
            })
          } else if (response.error) {
            setFetchError(response.error)
            // If biodata doesn't exist, initialize form with defaults or empty values
            // This assumes an empty biodata record is NOT automatically created with application.
            // If it is, a 404 here is a genuine error.
            setFormData((prev) => ({
              ...prev,
              applicationId,
              id: 0, // Or handle appropriately if ID is crucial before creation
            }))
          }
        })
        .catch((err) => {
          console.error("Error in getBiodataByApplicationId:", err)
          setFetchError("An unexpected error occurred while fetching biodata.")
        })
        .finally(() => {
          setFetchLoading(false)
        })
    } else {
      setFetchLoading(false)
      // setFetchError("Application ID is missing."); // Or handle as appropriate
    }
  }, [applicationId])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let updated: BiodataAttributes
      if (file) {
        const fd = new FormData()
        // Append all form data fields. Ensure keys match backend expectations.
        Object.entries(formData).forEach(([key, val]) => {
          if (key === "dateOfBirth" && val instanceof Date) {
            fd.append(key, val.toISOString().split("T")[0]) // Format date as YYYY-MM-DD
          } else if (val !== undefined && val !== null && key !== "passportPhotograph" && key !== "id") {
            // Exclude 'id' if your backend uses applicationId as the primary key for update
            fd.append(key, String(val))
          }
        })
        fd.append("passportPhotograph", file)
        // fd.append('applicationId', String(applicationId)); // Ensure backend knows which application

        const response = await updateBiodataByApplicationId(applicationId, fd, true)
        if (response.data && !response.error) {
          updated = response.data
        } else {
          throw new Error(response.error || "Failed to update biodata with passport.")
        }
      } else {
        const partial = { ...formData } as Partial<EditBiodataAttributes>
        delete partial.passportPhotograph // Don't send undefined file
        // delete partial.id; // Exclude 'id' if your backend uses applicationId as the primary key for update

        if (partial.dateOfBirth instanceof Date) {
          partial.dateOfBirth = partial.dateOfBirth.toISOString().split("T")[0] as any // Format date
        }

        const response = await updateBiodataByApplicationId(applicationId, partial)
        if (response.data && !response.error) {
          updated = response.data
        } else {
          throw new Error(response.error || "Failed to update biodata.")
        }
      }
      onSuccess?.(updated as EditBiodataAttributes) // Cast if onSuccess expects EditBiodataAttributes
    } catch (err) {
      console.error(err)
      setError("Failed to update biodata.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <p className="p-4">Loading biodata...</p>
  if (fetchError) return <p className="p-4 text-red-500">Error loading biodata.</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Middle Name</label>
        <input
          name="middleName"
          value={formData.middleName || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Surname</label>
        <input
          name="surname"
          value={formData.surname || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Gender</label>
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().substr(0, 10) : ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Marital Status</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        >
          <option value="">Select Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Home Address</label>
        <textarea
          name="homeAddress"
          value={formData.homeAddress || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Nationality</label>
        <input
          name="nationality"
          value={formData.nationality || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">State of Origin</label>
        <input
          name="stateOfOrigin"
          value={formData.stateOfOrigin || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">LGA</label>
        <input
          name="lga"
          value={formData.lga || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Home Town</label>
        <input
          name="homeTown"
          value={formData.homeTown || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Phone Number</label>
        <input
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Email Address</label>
        <input
          name="emailAddress"
          type="email"
          value={formData.emailAddress || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Passport Photograph</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Full Name</label>
        <input
          name="nextOfKinFullName"
          value={formData.nextOfKinFullName || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Phone Number</label>
        <input
          name="nextOfKinPhoneNumber"
          value={formData.nextOfKinPhoneNumber || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Address</label>
        <textarea
          name="nextOfKinAddress"
          value={formData.nextOfKinAddress || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Relationship with Next of Kin</label>
        <input
          name="relationshipWithNextOfKin"
          value={formData.relationshipWithNextOfKin || ""}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  )
}
export default EditBiodataForm
