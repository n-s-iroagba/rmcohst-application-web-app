import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Faculty } from '@/types/faculty'
import { FieldType } from '@/types/fields_config'
import { CustomForm, CustomArrayForm } from './CustomForm'
import { useGetList } from '@/hooks/useGet'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'

interface FacultyFormProps {
  programToEdit?: Faculty
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const FacultyForm: React.FC<FacultyFormProps> = ({
  programToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { programData, handleSubmitProgram, handleChangeProgramData } = useApplicationRequirements()
  const { data: sscqualifications } = useGetList<ProgramSSCRequirement>('')

  const data = programToEdit ? programToEdit : programData
  const onChangeFn = programToEdit ? handleChangeUpdate : handleChangeProgramData
  const onSaveFn = programToEdit ? handleSave : handleSubmitProgram

  const fieldsConfig = {
    id: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    departmentId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    awardType: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    durationType: { type: 'select' as FieldType, onChangeHandler: onChangeFn },
    duration: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    applicationFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    acceptanceFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    description: { type: 'textarea' as FieldType, onChangeHandler: onChangeFn },
    isActive: { type: 'checkbox' as FieldType, onChangeHandler: onChangeFn },
    createdAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
    updatedAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn }
  }

  const program = { ...programData, sscqualifications }

  if (programToEdit)
    return <CustomForm data={programToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
  return (
    <CustomArrayForm
      arrayData={programData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'Faculty'}
    />
  )
}
export default FacultyForm
