import React from 'react'
import { useApplicationRequirments } from '@/hooks/useApplicationRequirements'
import { DepartmentAttributes, DepartmentCreationDto } from '@/types/department'
import { DynamicFormTextFields } from '@/helpers/formFields' // default export assumed

interface DepartmentFormProps {
  departmentData: DepartmentCreationDto[] | DepartmentAttributes
  isEdit: boolean
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ departmentData, isEdit }) => {
  const { handleChangeDepartment, addDepartment } = useApplicationRequirments()

  return (
    <form>
      {isEdit ? (
        <section className="mb-4 p-3 border rounded">
          <DynamicFormTextFields<DepartmentAttributes>
            data={departmentData as DepartmentAttributes}
            onChange={handleChangeDepartment}
          />
        </section>
      ) : (
        (departmentData as DepartmentCreationDto[]).map((dept, index) => (
          <section key={index} className="mb-4 p-3 border rounded">
            <DynamicFormTextFields<DepartmentCreationDto>
              data={dept}
              onChange={handleChangeDepartment}
              index={index}
            />
            <button
              type="button"
              onClick={addDepartment}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Add Department
            </button>
          </section>
        ))
      )}
    </form>
  )
}

export default DepartmentForm
