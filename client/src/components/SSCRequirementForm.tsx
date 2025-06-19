import { apiRoutes } from "@/constants/apiRoutes";
import { renderDoubleSelectFields, renderDoubleSelectFieldsForUpdate, renderFields } from "@/helpers/renderFields";
import { useGetList } from "@/hooks/useGet";
import { SSCSubject } from "@/types/ssc_subject";
import { Grade, SSCSubjectMinimumGradeCreationDto, UpdateSSCSubjectMinimumGrade } from "@/types/ssc_subject_minimum_grade";
import { isUpdateSSCSubjectMinimumGrade } from "@/utils/typeGuards";

interface SscQualificationFormProps {
  sscQualificationData: SSCSubjectMinimumGradeCreationDto[] | UpdateSSCSubjectMinimumGrade[] ;
  isEdit: boolean;
  programIndex: number;
  handleChangeSscQualification:
    | ((e: React.ChangeEvent<HTMLSelectElement>, programIndex: number, sscIndex: number) => void)
    | ((e: React.ChangeEvent<HTMLSelectElement>, index: number) => void);
  addSscQualification: () => void;
  removeSscQualification: (index: number) => void;
}


const SscQualificationForm:React.FC<SscQualificationFormProps> = ({
    sscQualificationData,
    isEdit,
    programIndex,
    handleChangeSscQualification,
    addSscQualification,
    removeSscQualification,
  
}) => {

const {data:subjects}= useGetList<SSCSubject>(apiRoutes.subjects.getall)
const {data:grades}= useGetList<Grade>(apiRoutes.grades.getall)



  return (
    <form>
 {isEdit && Array.isArray(sscQualificationData) && isUpdateSSCSubjectMinimumGrade(sscQualificationData) ? (
  <section className="mb-4 p-3 border rounded">
    {renderDoubleSelectFieldsForUpdate<SSCSubject, Grade, UpdateSSCSubjectMinimumGrade>({
      valueData: sscQualificationData,
      firstSelectionData: subjects || [],
      secondSelectionData: grades || [],
      onChange: handleChangeSscQualification as (
        e: React.ChangeEvent<HTMLSelectElement>,
        index: number
      ) => void,
      index: programIndex,
      firstSelectionKey: "name",
      secondSelectionKey: "grade",
      firstSelectionLabel: "Subject",
      secondSelectionLabel: "Grade",
      firstNestedKey: "subject",
      secondNestedKey: "Grade",
    })}
  </section>
) : (
  sscQualificationData.map((sscQualification, index) => (
    <section key={index} className="mb-4 p-3 border rounded">
      {renderDoubleSelectFields<SSCSubject, Grade>({
        onChange: handleChangeSscQualification as (
          e: React.ChangeEvent<HTMLSelectElement>,
          parentIndex: number,
          childIndex: number
        ) => void,
        firstSelectionData: subjects || [],
        secondSelectionData: grades || [],
        parentIndex: programIndex,
        childIndex: index,
        firstSelectionKey: "name",
        secondSelectionKey: "grade",
        firstSelectionLabel: "Subject",
        secondSelectionLabel: "Grade",
      })}
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={addSscQualification} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Qualification
        </button>
        <button type="button" onClick={() => removeSscQualification(index)} className="bg-red-600 text-white px-4 py-2 rounded">
          Remove Qualification
        </button>
      </div>
    </section>
  ))
)}

    </form>
  )
}
export default SscQualificationForm
