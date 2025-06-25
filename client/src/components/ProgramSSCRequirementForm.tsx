import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { useGetList } from '@/hooks/useGet'
import { FieldType } from '@/types/fields_config'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
import { CustomArrayForm, CustomForm } from './CustomForm'

interface ProgramSSCRequirementFormProps {
  requirementToEdit?: ProgramSSCRequirement
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const ProgramSSCRequirementForm: React.FC<ProgramSSCRequirementFormProps> = ({
  requirementToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { sscRequirementsData, handleChangeSSCRequirement, handleSubmitSSCRequirement } =
    useApplicationRequirements()
  const { data: sscqualifications } = useGetList<ProgramSSCRequirement>('')
  const onChangeFn = requirementToEdit ? handleChangeUpdate : handleChangeSSCRequirement
  const onSaveFn = requirementToEdit ? handleSave : handleSubmitSSCRequirement
  const fieldsConfig = {
    maximumNumberOfSittings: { type: 'number' as FieldType, onChangeHandler: onChangeFn },

    // For arrays of complex objects, you might handle this with nested forms or selects,
    // so you can just treat them as 'array' or 'custom' type and handle accordingly
    programs: { type: 'custom' as FieldType, onChangeHandler: onChangeFn },

    subjectAndGrades: { type: 'custom' as FieldType, onChangeHandler: onChangeFn },

    createdAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },

    updatedAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn }
  }

  const program = { ...sscRequirementsData, sscqualifications }

  if (requirementToEdit)
    return <CustomForm data={requirementToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
  return (
    <CustomArrayForm
      arrayData={sscRequirementsData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'ProgramSSCRequirement'}
    />
  )
}
export default ProgramSSCRequirementForm
