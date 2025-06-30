import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { useGetList } from '@/hooks/useGet'
import { FieldsConfig, FieldType } from '@/types/fields_config'
import { ProgramSSCRequirement, ProgramSSCRequirementCreationDto } from '@/types/program_ssc_requirement'
import { CustomArrayForm, CustomForm } from './CustomForm'
import { ChangeEvent } from 'react'

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
  const fieldsConfig:FieldsConfig<ProgramSSCRequirementCreationDto> = {
    maximumNumberOfSittings: { type: 'number' as FieldType, onChangeHandler:(e:ChangeEvent<HTMLInputElement>,index?:number)=>{ console.log(e,index)} },


  }

  const program = { ...sscRequirementsData, sscqualifications }

  if (requirementToEdit)
    return <CustomForm data={requirementToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={''} onCancel={function (): void {
      throw new Error('Function not implemented.')
    } } submiting={false} error={''} />
  return (
    <CustomArrayForm
      arrayData={sscRequirementsData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'ProgramSSCRequirement'} apiError={''} submiting={false} addFn={function (): void {
        throw new Error('Function not implemented.')
      } } removeFn={function (index: number): void {
        throw new Error('Function not implemented.')
      } }    />
  )
}
export default ProgramSSCRequirementForm
