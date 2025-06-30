import { apiRoutes } from "@/constants/apiRoutes"
import { useGetSingle } from "./useGet"
import { Application } from "@/types/application"


const useReviewApplication = (id:string)=>{
    const {data:application, loading, error} = useGetSingle<Application>(apiRoutes.application.review(id))
  

 
    
    return{application,loading, error}
}

export default useReviewApplication