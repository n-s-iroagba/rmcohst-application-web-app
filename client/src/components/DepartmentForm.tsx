import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Department, DepartmentCreationDto } from '@/types/department'
import { CustomArrayForm, CustomForm } from './CustomForm'
import { FieldType } from '@/types/fields_config'

interface DepartmentFormProps {
  departmentToEdit?: Department
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  departmentToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { departmentData, handleSubmitDepartment, handleChangeDepartment } =
    useApplicationRequirements()

  const data = departmentToEdit ? departmentToEdit : departmentData
  const onChangeFn = departmentToEdit ? handleChangeUpdate : handleChangeDepartment
  const onSaveFn = departmentToEdit ? handleSave : handleSubmitDepartment

  const fieldsConfig = {
    name: {
      type: 'text' as FieldType,
      onChangeHandler: onChangeFn
    }
  }

  if (departmentToEdit)
    return <CustomForm data={departmentToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
  return (
    <CustomArrayForm
      arrayData={departmentData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'departments'}
    />
  )
}
export default DepartmentForm
