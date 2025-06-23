import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Department, DepartmentCreationDto } from '@/types/department'


interface DepartmentFormProps {
  departmentData: DepartmentCreationDto[] | Department
  isEdit: boolean
  handleChangeUpdate:(e:any)=>void
  handleSave:(e:any)=> void
}



const DepartmentForm: React.FC<DepartmentFormProps> = ({ isEdit = false, departmentToEdit, handleChangeUpdate, handleSave }) => {
  const {
    departmentData,
    handleSubmitDepartment
    handleChange,
    addFaculty,
    removeFaculty
  } = useApplicationRequirements()

  const data = isEdit && departmentToEdit ? departmentToEdit : departmentData
  const onChangeFn = isEdit ? handleChangeUpdate : handleChange
  const onSaveFn = isEdit ? handleSave : handleSubmitDepartment

  const fieldsConfig = {
    name: { type: 'text', label: 'Faculty Name' },
    description: { type: 'textarea', label: 'Faculty Description' }
  }

  const handlers = {
    name: handleChangeFaculty,
    description: handleChangeFaculty
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && departmentToEdit) {
      // update logic here
      console.log('Updating faculty:', departmentToEdit)
    } else {
      addFaculty()
    }
  }

  return (
    <CustomForm
      isEdit={isEdit??false}
      data={data}
      fieldsConfig={fieldsConfig}
      handlers={handlers}
      onSubmit={handleSubmit}
      cancelLabel="Cancel"
      onCancel={onCancel}
    />
  )
}

export default DepartmentForm
