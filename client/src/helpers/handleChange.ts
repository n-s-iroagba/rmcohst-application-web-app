  export const handleChange = <T extends Record<string, any>>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

 