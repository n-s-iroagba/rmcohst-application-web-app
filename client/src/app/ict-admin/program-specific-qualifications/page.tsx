// // app/(dashboard)/program-specific-requirements/page.tsx
// 'use client'

// import { CrudPageWrapper } from '@/components/CrudPageWrapper'
// import { ProgramSpecificRequirementCard } from '@/components/ProgramSpecificRequirementCard'
// import ProgramSpecificRequirementForm from '@/components/ProgramSpecificRequirementForm'
// import { useGetList } from '@/hooks/useGet'
// import { ProgramSpecificRequirement } from '@/types/program_specific_requirement'

// export default function ProgramSpecificRequirementCrudPage() {
//   const {
//     data: requirements,
//     loading,
//     error
//   } = useGetList<ProgramSpecificRequirement>('program-specific-requirements')

//   return (
//     <CrudPageWrapper
//       title="Program Specific Requirements"
//       entityKey="programSpecificRequirement"
//       data={requirements || []}
//       loading={loading}
//       error={error || 'An error occurred fetching program requirements'}
//       FormComponent={ProgramSpecificRequirementForm}
//       CardComponent={ProgramSpecificRequirementCard}
//     />
//   )
// }
const page = () => {
  return <div>hi</div>
}
export default page
