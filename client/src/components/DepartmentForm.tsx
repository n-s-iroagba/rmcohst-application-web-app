import { useApplicationRequirments } from "@/hooks/useApplicationRequirements"


const DepartmentForm = ()=>{
    const {departmentData} = useApplicationRequirments()

    return(
        <form>
            {departmentData.map((dept)=>(
                Object.keys(dept).map((key)=>(
                <input
                key={key}
                type="text"
                name={key}
            
            />))))
}
            
        </form>
    )
}