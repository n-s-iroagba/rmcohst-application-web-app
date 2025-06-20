import React from 'react'
import { useApplicationRequirments } from '@/hooks/useApplicationRequirements'
import { FacultyCreationDto } from '@/types/faculty'
import { DynamicFormTextFields } from '@/helpers/formFields'

interface FacultyFormProps {
  isEdit: boolean
}

const FacultyForm: React.FC<FacultyFormProps> = ({ isEdit }) => {
  const { facultyData, handleChangeFaculty, addFaculty, removeFaculty } =
    useApplicationRequirments()

  return (
    <form>
      {isEdit ? (
        <section className="mb-4 p-3 border rounded">
          <DynamicFormTextFields<FacultyCreationDto[]>
            data={facultyData}
            onChange={handleChangeFaculty}
          />
        </section>
      ) : (
        facultyData.map((faculty: FacultyCreationDto, index) => (
          <section key={index} className="mb-4 p-3 border rounded">
            <DynamicFormTextFields<FacultyCreationDto>
              data={faculty}
              onChange={handleChangeFaculty}
              index={index}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={addFaculty}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Faculty
              </button>
              <button
                type="button"
                onClick={() => removeFaculty(index)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Remove Faculty
              </button>
            </div>
          </section>
        ))
      )}
    </form>
  )
}

export default FacultyForm
