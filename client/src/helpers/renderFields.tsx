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



type RenderDoubleSelectFieldsProps<T, U> = {
  firstSelectionData: T[];  // E.g., SSCSubject[]
  secondSelectionData: U[]; // E.g., Grade[]
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    parentIndex: number,
    childIndex: number
  ) => void;
  parentIndex: number;
  childIndex: number;
  firstSelectionKey: keyof T;
  secondSelectionKey: keyof U;
  firstSelectionLabel: string;
  secondSelectionLabel: string;
};





export function renderDoubleSelectFields<T extends { id: string | number }, U extends { id: string | number }>({
  firstSelectionData,
  secondSelectionData,
  onChange,
  parentIndex,
  childIndex,
  firstSelectionKey,
  secondSelectionKey,
  firstSelectionLabel,
  secondSelectionLabel,
}: RenderDoubleSelectFieldsProps<T, U>) {
  return (
    <div className="flex space-x-4 items-center">
      <select
        onChange={(e) => onChange(e, parentIndex, childIndex)}
        className="border p-2 rounded"
        name={String(firstSelectionKey)}
      >
        <option value="">{firstSelectionLabel}</option>
        {firstSelectionData.map((item) => (
          <option key={item.id} value={item.id}>
            {String(item[firstSelectionKey])}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onChange(e, parentIndex, childIndex)}
        className="border p-2 rounded"
        name={String(secondSelectionKey)}
      >
        <option value="">{secondSelectionLabel}</option>
        {secondSelectionData.map((item) => (
          <option key={item.id} value={item.id}>
            {String(item[secondSelectionKey])}
          </option>
        ))}
      </select>
    </div>
  );
}

type RenderDoubleSelectFieldsForUpdateProps<
  T extends { id: string | number },
  U extends { id: string | number },
  W extends Record<any, any>
> = {
  valueData: W[];
 
  firstSelectionData: T[];
  secondSelectionData: U[];
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  index: number;
  firstSelectionKey: keyof T;
  secondSelectionKey: keyof U;
  firstSelectionLabel: string;
  secondSelectionLabel: string;
  firstNestedKey: keyof W;
  secondNestedKey: keyof W;
};
export function renderDoubleSelectFieldsForUpdate<
  T extends { id: string | number },
  U extends { id: string | number },
  W extends Record<string, any>
>({
  valueData,
  firstSelectionData,
  secondSelectionData,
  onChange,

  index,

  firstSelectionLabel,
  secondSelectionLabel,
  firstNestedKey,
  secondNestedKey,
}: RenderDoubleSelectFieldsForUpdateProps<T, U, W>) {


  return (
    <div className="flex space-x-4 items-center">
      <div className="flex flex-col">
        <label className="mb-1">{firstSelectionLabel}</label>
         {valueData.map((item,index) => (

        <select
          name={String(firstNestedKey)}
          value={String (valueData[index][firstNestedKey])}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
        >
          <option value="">{item[firstNestedKey]}</option>
          
         {firstSelectionData.map(()=>(
            <option key={item.id} value={item.id}>
              {String(item[firstNestedKey])}
            </option>
          ))}
        </select>
  ))}
      </div>

        <label className="mb-1">{secondSelectionLabel}</label>
         {valueData.map((item,index) => (

        <select
          name={String(secondNestedKey)}
          value={String (valueData[index][secondNestedKey])}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
        >
          <option value="">{item[secondNestedKey]}</option>
          
         {secondSelectionData.map(()=>(
            <option key={item.id} value={item.id}>
              {String(item[secondNestedKey])}
            </option>
          ))}
        </select>
  ))}
    </div>
  );
}

