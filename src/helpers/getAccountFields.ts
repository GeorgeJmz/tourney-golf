const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePassword = (password: string): boolean => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return re.test(password);
};

const validateString = (str: string): boolean => {
  return str.trim().length > 3;
};

export const accountFields = [
  {
    name: "name",
    type: "string",
    placeholder: "Name",
    input: "text",
    rule: validateString,
  },
  {
    name: "lastName",
    type: "string",
    placeholder: "Last Name",
    input: "text",
    rule: validateString,
  },
  {
    name: "email",
    type: "string",
    placeholder: "Email",
    input: "email",
    rule: validateEmail,
  },
  {
    name: "password",
    type: "string",
    placeholder: "Password",
    input: "password",
    rule: validatePassword,
  },
];

export const loginFields = [
  {
    name: "email",
    type: "string",
    placeholder: "Email",
    input: "email",
    rule: validateEmail,
  },
  {
    name: "password",
    type: "string",
    placeholder: "Password",
    input: "password",
    rule: validatePassword,
  },
];
