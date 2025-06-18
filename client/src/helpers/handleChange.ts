export const handleChange = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  setState(prev => ({
    ...prev,
    [name]: value,
  }));
};

export const handleArrayChange = <T extends Record<string, any>>(
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const { name, value } = e.target;
  setState(prev =>
    prev.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    )
  );
};
