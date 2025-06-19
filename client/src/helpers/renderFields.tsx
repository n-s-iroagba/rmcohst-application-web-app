 import { formatCamelCase } from "@/utils/formatCamelCase";
 
 export const renderFields = (
    data: Record<string, any>,
     handleChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void,
    index?: number,
   
  ) => (
    <>
      {Object.keys(data).map((key) => (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {formatCamelCase(key)}
          </label>
        <input
          key={key}
          type="text"
          name={key}
          value={data[key] ?? ""}
          onChange={(e) => handleChange(e, index)}
          placeholder={key}
          className="block mb-2 p-2 border rounded w-full"
        />
        </>
      ))}
    </>
  );