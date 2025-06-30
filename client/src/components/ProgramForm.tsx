import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'

import { FieldsConfig, FieldType } from '@/types/fields_config'
import { CustomForm, CustomArrayForm } from './CustomForm'
import { useGetList } from '@/hooks/useGet'

import { Program, ProgramCreationDto } from '@/types/program'

interface ProgramFormProps {
  programToEdit?: Program
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const ProgramForm: React.FC<ProgramFormProps> = ({
  programToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { programData, handleSubmitProgram, handleChangeProgramData } = useApplicationRequirements()
  const { data: sscqualifications } = useGetList<Program>('')

  const data = programToEdit ? programToEdit : programData
  const onChangeFn = programToEdit ? handleChangeUpdate : handleChangeProgramData
  const onSaveFn = programToEdit ? handleSave : handleSubmitProgram

const fieldsConfig:FieldsConfig <Program> = {
  departmentId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },

  durationType: { type: 'select' as FieldType, onChangeHandler: onChangeFn },
  duration: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  applicationFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  acceptanceFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  description: { type: 'textarea' as FieldType, onChangeHandler: onChangeFn },
  isActive: { type: 'checkbox' as FieldType, onChangeHandler: onChangeFn },
  createdAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
  updatedAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
  level: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  sscRequirement: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  programSpecificRequirements: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  sscRequirementId: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  programSpecificRequirementsId: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  id: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  }
}

const programCreationFieldsConfig:FieldsConfig <ProgramCreationDto> = {
  name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },

  durationType: { type: 'select' as FieldType, onChangeHandler: onChangeFn },
  duration: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  applicationFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  acceptanceFeeInNaira: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  description: { type: 'textarea' as FieldType, onChangeHandler: onChangeFn },
  awardType: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  isUsingPreexistingSSCRequirements: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  isUsingPreexistingProgramSpecificRequirements: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  sscRequirementId: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  },
  programSpecificRequirementsId: {
    onChangeHandler: undefined,
    type: 'text',
    options: undefined,
    fieldGroup: undefined
  }
}

  const program = { ...programData, sscqualifications }

  if (programToEdit)
    return <CustomForm data={programToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={''} onCancel={function (): void {
        throw new Error('Function not implemented.')
    } } submiting={false} error={''} />
  return (
    <CustomArrayForm
          arrayData={programData}
          fieldsConfig={programCreationFieldsConfig}
          onSubmit={onSaveFn}
          addOrRemovelabel={'Program'} apiError={''} submiting={false} addFn={function (): void {
              throw new Error('Function not implemented.')
          } } removeFn={function (index: number): void {
              throw new Error('Function not implemented.')
          } }    />
  )
}
export default ProgramForm
  