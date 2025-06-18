import { useApplicationRequirments } from "@/hooks/useApplicationRequirements";

const DepartmentForm = () => {
  const { departmentData, handleChangeDepartment, addDepartment } =
    useApplicationRequirments();

  return (
    <form>
      {departmentData.map((dept, index) => (
        <section key={index} className="mb-4 p-3 border rounded">
          {Object.keys(dept).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={dept[key as keyof typeof dept] ?? ""}
              onChange={(e) => handleChangeDepartment(e, index)}
              placeholder={key}
              className="block mb-2 p-2 border rounded w-full"
            />
          ))}
          <button
            type="button"
            onClick={addDepartment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Department
          </button>
        </section>
      ))}
    </form>
  );
};

export default DepartmentForm;
