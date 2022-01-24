import { act, renderHook } from "@testing-library/react-hooks";
import { useForm } from "../../../hooks/form-hook";

const initiateState = {
  name: "testingStr",
  fullname: "testingStr",
  address: "testingStr",
  username: "testingStr",
  password: "testingPW",
  passwordConfirm: "testingPW",
  email: "testingStr@gmail.com",
  status: "DONE",
  priority: "HIGH",
  id: "ABC",
};

const initiateError = {
  name: "",
  fullname: "",
  address: "",
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  status: "",
  priority: "",
  id: "",
};
const mockSetState = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: (abc) => [abc, mockSetState],
}));

const clearValue = (object) => {
  const newObj = { ...object };
  for (const field in newObj) {
    newObj[field] = "";
  }
  return newObj;
};

describe("Form custom hook Testing", () => {
  test("successfully done", async () => {
    const { result } = renderHook(() => useForm(initiateState));
    const { formInputs, error, validateInputs } = result.current;

    const isValidInputs = validateInputs();
    expect(isValidInputs).toEqual(true);
    expect(formInputs).toEqual(initiateState);
    expect(error).toEqual(initiateError);
  });

  test("email is invalid", async () => {
    const newIninitiateState = { ...initiateState, email: "notEmail" };
    const { result } = renderHook(() => useForm(newIninitiateState));
    const { validateInputs } = result.current;

    const isValidInputs = validateInputs();
    expect(isValidInputs).toEqual(false);
  });

  test("password confirm is not match", async () => {
    const newIninitiateState = { ...initiateState, passwordConfirm: "notMatch" };
    const { result } = renderHook(() => useForm(newIninitiateState));
    const { validateInputs } = result.current;

    const isValidInputs = validateInputs();
    expect(isValidInputs).toEqual(false);
  });

  test("not valid state name", async () => {
    const newIninitiateState = { notValidStateName: "not valid" };
    const { result } = renderHook(() => useForm(newIninitiateState));
    const { validateInputs } = result.current;

    const isValidInputs = validateInputs();
    expect(isValidInputs).toEqual(false);
  });

//   test("cancel form testing", async () => {
//     jest.useFakeTimers();
//     const { result } = renderHook(() => useForm(initiateState));
//     const { cancelForm } = result.current;

//     await act(async () => {
//       cancelForm();
//     });

//     expect(mockSetState).toHaveBeenCalledTimes(2);
//     expect(mockSetState).toBeCalledWith((prev) => {
//       const newError = { ...prev };
//       return clearValue(newError);
//     });
//   });
});
