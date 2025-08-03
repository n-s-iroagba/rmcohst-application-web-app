import { ApplicantSSCQualification, Application, Biodata, Role, User } from "../models"
import ApplicationService from "../services/ApplicationService";
import { NotFoundError } from "../utils/errors"

const destroyStuff =async ()=>{
    try{
    //   const a =     await new ApplicationService().createInitialApplication({
    //     applicantUserId: 1,
    //     sessionId: 2,
    //     programId: 1,
        
    //   });
          const a =     await new ApplicationService().getApplicationDetailsById('3');
    
      console.log(a)
  
    // await User.sync({force:true})
    //   await Role.sync({force:true})
    // const a =await Application.findOne({where:{applicantUserId:1}})
    // console.log(a)
    // if(!a) throw new NotFoundError('application not found')
    // console.log(a)
    // await a.destroy()
    // //   await Application.sync({force:true})
    // // await Biodata.sync({force:true})
    // // await ApplicantSSCQualification.sync({force:true})
  
    }catch(error){
        console.error(error)
    }
}
destroyStuff()