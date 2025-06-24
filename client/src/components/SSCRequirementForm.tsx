import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
import { FieldType } from '@/types/fields_config'
import { CustomArrayForm, CustomForm } from './CustomForm'

interface SSCRequrremenntFormProps {
  sscRequirementToEdit?: ProgramSSCRequirement
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const SSCRequrremenntForm: React.FC<SSCRequrremenntFormProps> = ({
  sscRequirementToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { sscRequirementsData, handleSubmitSSCRequirement, handleChangeSSCRequirement } =
    useApplicationRequirements()

  const data = sscRequirementToEdit ? sscRequirementToEdit : sscRequirementsData
  const onChangeFn = sscRequirementToEdit ? handleChangeUpdate : handleChangeSSCRequirement
  const onSaveFn = sscRequirementToEdit ? handleSave : handleSubmitSSCRequirement

  const fieldsConfig = {
    maximumNumberOfSittings: {
      type: 'text' as FieldType,
      onChangeHandler: onChangeFn
    }
  }

  if (sscRequirementToEdit)
    return (
      <CustomForm data={sscRequirementToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
    )
  return (
    <CustomArrayForm
      arrayData={sscRequirementsData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'SSC Requirement'}
    />
  )
}

export default SSCRequrremenntForm
