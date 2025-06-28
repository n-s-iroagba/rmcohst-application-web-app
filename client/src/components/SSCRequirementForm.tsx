// import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
// import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
// import { FieldsConfig, FieldType } from '@/types/fields_config'
// import { CustomArrayForm, CustomForm } from './CustomForm'

// interface SSCRequrremenntFormProps {
//   sscRequirementToEdit?: ProgramSSCRequirement
//   handleChangeUpdate?: (e: any) => void
//   handleSave?: () => void
//   onCancelUpdate?:()=>void
// }

// const SSCRequrremenntForm: React.FC<SSCRequrremenntFormProps> = ({
//   sscRequirementToEdit,
//   handleChangeUpdate,
//   handleSave,
//   onCancelUpdate
// }) => {
//   const { sscRequirementsData, handleSubmitSSCRequirement, handleChangeSSCRequirement } =
//     useApplicationRequirements()

//   const data = sscRequirementToEdit ? sscRequirementToEdit : sscRequirementsData
//   const onChangeFn = sscRequirementToEdit ? handleChangeUpdate : handleChangeSSCRequirement
//   const onSaveFn = sscRequirementToEdit && handleSave ? handleSave : handleSubmitSSCRequirement
//   const onCancel = sscRequirementToEdit && onCancelUpdate ? onCancelUpdate : () =>{}

//   const fieldsConfig:FieldsConfig <ProgramSSCRequirement> = {
//     maximumNumberOfSittings: {
//       type: 'text' as FieldType,
//       onChangeHandler: onChangeFn
//     }
//   }


//   if (sscRequirementToEdit)
//     return (
//       <CustomForm data={sscRequirementToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={'Edit SSC Requirement'} onCancel={} submiting={false} />
//     )
//   return (
//     <CustomArrayForm
//       arrayData={sscRequirementsData}
//       fieldsConfig={fieldsConfig}
//       onSubmit={onSaveFn}
//       addOrRemovelabel={'SSC Requirement'}
//     />
//   )
// }

// export default SSCRequrremenntForm
