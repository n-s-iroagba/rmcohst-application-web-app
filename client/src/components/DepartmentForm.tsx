import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Department } from '@/types/department'
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
    id: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    code: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    description: { type: 'textarea' as FieldType, onChangeHandler: onChangeFn },
    isActive: { type: 'checkbox' as FieldType, onChangeHandler: onChangeFn },
    facultyId: { type: 'number' as FieldType, onChangeHandler: onChangeFn }
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
