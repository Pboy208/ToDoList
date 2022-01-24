const inputName = [
  "name",
  "fullname",
  "address",
  "username",
  "password",
  "passwordConfirm",
  "email",
  "status",
  "priority",
];

const inputProperty = [
  {
    minLength: 1,
    maxLength: 255,
    error: "Name should have length in the range of 1 to 255 characters",
  },
  {
    minLength: 3,
    maxLength: 255,
    error: "Full name should have length in the range of 3 to 255 characters",
  },
  {
    minLength: 4,
    maxLength: 255,
    error: "Address should have length in the range of 3 to 255 characters",
  },
  {
    minLength: 5,
    maxLength: 25,
    error: "Username should have length in the range of 5 to 25 characters",
  },
  {
    minLength: 8,
    maxLength: 10,
    error: "Password should have length in the range of 8 to 10 characters",
  },
  {
    minLength: 8,
    maxLength: 10,
    error:
      "Password Confirmation should have length in the range of 8 to 10 characters and match password ",
  },
  {
    format: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    error: "Email is not in valid form",
  },
  {
    validValues: ["OPEN", "IN PROGRESS", "DONE"],
    error: "Status value should only be OPEN,IN PROGRESS or DONE",
  },
  {
    validValues: ["LOW", "MEDIUM", "HIGH"],
    error: "Priority value should only be LOW,MEDIUM or HIGH",
  },
];

export const getInputCondition = (input) => {
  const index = inputName.findIndex((name) => input === name);
  return inputProperty[index];
};
