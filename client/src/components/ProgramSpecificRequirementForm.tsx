import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { FieldType } from '@/types/fields_config'
import { CustomArrayForm, CustomForm } from './CustomForm'
import { ProgramSpecificRequirement } from '@/types/program_specific_requirement'

interface ProgramSpecificRequirementFormProps {
  requirementToEdit?: ProgramSpecificRequirement
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const ProgramSpecificRequirementForm: React.FC<ProgramSpecificRequirementFormProps> = ({
  requirementToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const {
    programSpecificRequirementsData,
    handleChangeProgramSpecificRequirementsData,
    handleSubmitProgramSpecificRequirements
  } = useApplicationRequirements()

  const onChangeFn = requirementToEdit
    ? handleChangeUpdate
    : handleChangeProgramSpecificRequirementsData
  const onSaveFn = requirementToEdit ? handleSave : handleSubmitProgramSpecificRequirements

  const fieldsConfig = {
    id: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    programId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    qualificationType: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    minimumGrade: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    createdAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
    updatedAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn }
  }

  if (requirementToEdit)
    return <CustomForm data={requirementToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={''} onCancel={function (): void {
      throw new Error('Function not implemented.')
    } } submiting={false} error={''} />
  return (
    <CustomArrayForm
      arrayData={programSpecificRequirementsData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'ProgramSpecificRequirement'} apiError={''} submiting={false} addFn={function (): void {
        throw new Error('Function not implemented.')
      } } removeFn={function (index: number): void {
        throw new Error('Function not implemented.')
      } }    />
  )
}
export default ProgramSpecificRequirementForm
