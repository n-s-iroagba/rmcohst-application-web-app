import { useApplicationRequirments } from "@/hooks/useApplicationRequirements";
import DepartmentForm from "./DepartmentForm";

const FacultyForm = () => {
  const { facultyData, handleChangeFaculty, addFaculty,removeFaculty } =
    useApplicationRequirments();

  return (
    <form>
      {facultyData.map((faculty, index) => (
        <section key={index} className="mb-4 p-3 border rounded">
          {Object.keys(faculty).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={faculty[key as keyof typeof faculty] ?? ""}
              onChange={(e) => handleChangeFaculty(e, index)}
              placeholder={key}
              className="block mb-2 p-2 border rounded w-full"
            />
          ))}
          <DepartmentForm/>
          <button
            type="button"
            onClick={addFaculty}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Faculty
          </button>
             <button
            type="button"
            onClick={()=>removeFaculty(index)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Remove Faculty
          </button>
        </section>
      ))}
    </form>
  );
};

export default FacultyForm;