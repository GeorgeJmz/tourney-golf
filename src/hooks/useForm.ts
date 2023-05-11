import { useCallback, useEffect, useMemo, useState } from "react";

export interface FormInputs {
  name: string;
  type: string;
  placeholder: string;
  input: string;
  rule: (value: string) => boolean;
}

type FormValues<T> = {
  [K in keyof T]: string;
};

type Validation<T> = {
  [K in keyof T]?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useForm = <T extends Record<string, unknown>>(
  inputs: FormInputs[]
) => {
  const [values, setValues] = useState<FormValues<T>>(
    Object.fromEntries(
      inputs.map(({ name, type }) => [name, type === "string" ? "" : 0])
    ) as FormValues<T>
  );
  const [validations, setValidations] = useState<Validation<T>>({});

  useEffect(() => {
    const errorNames = Object.keys(values);
    errorNames.map((name) => {
      validateField(name);
      return "";
    });
  }, []);

  const validateField = useCallback(
    (field: string) => {
      const inputElement = getInput(field);
      const isValid = inputElement?.rule(values[field]) ?? false;
      setValidations((prevValidations) => ({
        ...prevValidations,
        [field]: isValid ? undefined : `${field} is not valid`,
      }));
    },
    [values]
  );

  const getInput = useMemo(
    () => (inputName: string) =>
      inputs.find((input) => input.name === inputName),
    [inputs]
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    validateField(name);
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isValid = (): boolean => {
    const errorValues = Object.values(validations);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return errorValues.every((v) => !v);
  };

  return { values, handleInputChange, validations, isValid };
};
