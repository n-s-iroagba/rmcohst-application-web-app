import { renderFields } from "@/helpers/renderFields";
import { useApplicationRequirments } from "@/hooks/useApplicationRequirements";
import { ProgramSSCRequirementCreationDto } from "@/types/program_ssc_requirement";
interface SscQualificationFormProps {
    sscQualificationData: ProgramSSCRequirementCreationDto[];
    isEdit: boolean;
    handleChangeSscQualification: (e: React.ChangeEvent<HTMLInputElement>,index?:number) => void;
    addSscQualification: () => void;
    removeSscQualification: (index: number) => void;
   
  
  };

const SscQualificationForm:React.FC<SscQualificationFormProps> = ({
    sscQualificationData,
    isEdit,
    handleChangeSscQualification,
    addSscQualification,
    removeSscQualification,
  
}) => {




  return (
    <form>
           {isEdit ? (
              <section className="mb-4 p-3 border rounded">
                {renderFields(sscQualificationData,handleChangeSscQualification)}
              </section>
            ) : (sscQualificationData.map((sscQualification: ProgramSSCRequirementCreationDto, index) => (
        <section key={index} className="mb-4 p-3 border rounded">
          {renderFields(sscQualification,handleChangeSscQualification, index,)}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={addSscQualification}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add sscQualificationData
            </button>
            <button
              type="button"
              onClick={() => removeSscQualification(index)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove sscQualificationData
            </button>
          </div>
        </section>
            )
      ))}
    </form>
  );
}
export default SscQualificationForm
