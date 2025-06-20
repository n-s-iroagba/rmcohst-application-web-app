export const handleChange = <T extends Record<string, string | number>>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target
  setState((prev) => ({
    ...prev,
    [name]: value
  }))
}

export const handleArrayOfObjectsChangee = <T extends Record<string, string | number>>(
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  index: number
) => {
  const { name, value } = e.target

  setState((prevState) =>
    prevState.map((item, i) => (i === index ? { ...item, [name]: value } : item))
  )
}
export const handleArrayChange = (
  setState: React.Dispatch<React.SetStateAction<string[]>>,
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  index: number
) => {
  const { value } = e.target

  setState((prevState) => prevState.map((item, i) => (i === index ? value : item)))
}

export const handleChangeArrayInArray = <T extends Record<string, string | number>>(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  parentIndex: number,
  childIndex: number
) => {
  const { name, value } = e.target

  setState((prevState) =>
    prevState.map((program, pIndex) => {
      if (pIndex !== parentIndex) return program

      // If sscRequirements is not an array, don't update
      if (!Array.isArray(program.sscRequirements)) return program

      const updatedSSCRequirements = program.sscRequirements.map((req, index) => {
        if (index !== childIndex) return req
        return { ...req, [name]: value }
      })

      return {
        ...program,
        sscRequirements: updatedSSCRequirements
      }
    })
  )
}

export const handleAddToArrayOfArrays = <
  T extends Record<string, string | number>,
  K extends keyof T
>(
  parentIndex: number,
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  key: K,
  template: T[K] extends Array<infer U> ? U : unknown
) => {
  setState((prev) =>
    prev.map((item, index) => {
      if (index !== parentIndex) return item

      const currentArray = item[key]

      if (!Array.isArray(currentArray)) {
        console.warn(`Cannot push to non-array key "${String(key)}"`)
        return item
      }

      return {
        ...item,
        [key]: [...currentArray, template]
      }
    })
  )
}

export const handleRemoveFromArrayOfArrays = <
  T extends Record<string, string | number>,
  K extends keyof T
>(
  parentIndex: number,
  childIndex: number,
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  key: K
) => {
  setState((prev) =>
    prev.map((item, index) => {
      if (index !== parentIndex) return item

      const currentArray = item[key]

      if (!Array.isArray(currentArray)) {
        console.warn(`Cannot remove from non-array key "${String(key)}"`)
        return item
      }

      return {
        ...item,
        [key]: currentArray.filter((_: unknown, i: number) => i !== childIndex)
      }
    })
  )
}
