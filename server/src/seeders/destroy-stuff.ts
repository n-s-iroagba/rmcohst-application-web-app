import { ApplicantSSCQualification, Application, Biodata } from "../models"
import { NotFoundError } from "../utils/errors"

const destroyStuff =async ()=>{
    try{
    
    const a =await Application.findOne({where:{applicantUserId:1}})
    if(!a) throw new NotFoundError('application not found')
    console.log(a)
    await a.destroy()
    await Biodata.sync({force:true})
    await ApplicantSSCQualification.sync({force:true})
    }catch(error){
        console.error(error)
    }
}
destroyStuff()