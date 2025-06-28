// // app/(dashboard)/departments/page.tsx
// 'use client'

// import { CrudPageWrapper } from '@/components/CrudPageWrapper'
// import { DepartmentCard } from '@/components/DepartmentCard'
// import DepartmentForm from '@/components/DepartmentForm' // Assume you have this
// import { useGetList } from '@/hooks/useGet'
// import { Department } from '@/types/department'

// export default function DepartmentCrudPage() {
//   const { data: departments, loading, error } = useGetList<Department>('departments')


//   return (
//     <CrudPageWrapper
//       title="Departments"
//       entityKey="department"
//       data={departments || []}
//       loading={loading}
//       error={error || 'An error occurred fetching departments'}
//       FormComponent={DepartmentForm}
//       CardComponent={DepartmentCard}
//     />
//   )
const page = ()=>{
  return <div>hi</div>
}
export default page