// // app/(dashboard)/program-ssc-requirements/page.tsx
// 'use client'

// import { CrudPageWrapper } from '@/components/CrudPageWrapper'
// import { ProgramSSCRequirementCard } from '@/components/ProgramSSCRequirementCard'
// import ProgramSSCRequirementForm from '@/components/ProgramSSCRequirementForm'

// import { useGetList } from '@/hooks/useGet'
// import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'

// export default function ProgramSSCRequirementCrudPage() {
//   const {
//     data: requirements,
//     loading,
//     error
//   } = useGetList<ProgramSSCRequirement>('program-ssc-requirements')

//   return (
//     <CrudPageWrapper
//       title="Program SSC Requirements"
//       entityKey="programSSCRequirement"
//       data={requirements || []}
//       loading={loading}
//       error={error || 'An error occurred fetching SSC requirements'}
//       FormComponent={ProgramSSCRequirementForm}
//       CardComponent={ProgramSSCRequirementCard}
//     />
//   )
// }
const page = () => {
  return <div>hi</div>
}
export default page
