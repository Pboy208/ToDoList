import { useCallback, useState } from "react";
import { getInputCondition } from "../utils/FormValidity";

const stringValidate = (input, conditions) => {
  if (input.length > conditions.maxLength || input.length < conditions.minLength) return false;
  return true;
};

const emailValidate = (input, conditions) => {
  if (!input.match(conditions.format)) return false;
  return true;
};

const enumValidate = (input, conditions) => {
  const index = conditions.validValues.findIndex((value) => input === value);
  if (index === -1) return false;
  return true;
};

const isInputValid = (field, input, condition) => {
  switch (field) {
    case "name":
    case "fullname":
    case "address":
    case "username":
    case "password":
      return stringValidate(input, condition);
    case "email":
      return emailValidate(input, condition);
    case "status":
    case "priority":
      return enumValidate(input, condition);
    case "id":
    case "passwordConfirm":
      return true;
    default:
      return false;
  }
};

const clearValue = (object) => {
  const newObj = { ...object };
  for (const field in newObj) {
    newObj[field] = "";
  }
  return newObj;
};

export const useForm = (initialState) => {
  const [formInputs, setFormInputs] = useState(initialState);
  const [error, setError] = useState(clearValue(initialState));

  const onChangeHandler = useCallback((event) => {
    const value = event.target.value;
    setError((prev) => ({
      ...prev,
      [event.target.id]: "",
    }));
    setFormInputs((prev) => ({
      ...prev,
      [event.target.id]: value,
    }));
  }, []);

  const cancelForm = useCallback(
    (avoidance) => {
      setError((prev) => {
        const newError = { ...prev };
        return clearValue(newError);
      });
      setFormInputs((prev) => {
        const newFormInput = { ...prev };
        for (const field in formInputs) {
          if (field !== avoidance) newFormInput[field] = "";
        }
        return newFormInput;
      });
    },
    [formInputs]
  );

  const validateInputs = useCallback(() => {
    let isValid = true;
    if (formInputs.passwordConfirm) {
      if (formInputs.passwordConfirm !== formInputs.password) {
        const errorMessage = getInputCondition("passwordConfirm").error;
        setError((prev) => ({
          ...prev,
          passwordConfirm: errorMessage,
        }));
        isValid = false;
      }
    }
    for (const field in formInputs) {
      const condition = getInputCondition(field);
      if (!isInputValid(field, formInputs[field], condition)) {
        console.log("field wrong", field);
        setError((prev) => ({
          ...prev,
          [field]: condition.error,
        }));
        isValid = false;
      }
    }
    return isValid;
  }, [formInputs]);

  return { formInputs, error, cancelForm, onChangeHandler, validateInputs };
};
