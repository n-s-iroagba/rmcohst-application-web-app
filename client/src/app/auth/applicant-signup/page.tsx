import SignupForm from "@/components/SignupForm"
import { useAuth } from "@/hooks/useAuth"


const ApplicantSignupPage  = ()=>{
    return (
        <SignupForm role={'APPLICANT'} formLabel="Create An Account to Apply"/>
    )
}
export default ApplicantSignupPage