import * as yup from "yup";
import { ITournamentElement } from "./getTournamentFields";

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}$/;
  return re.test(password);
};

export const validateString = (str: string): boolean => {
  return str.trim().length >= 3;
};

export const validateNumbers = (): boolean => {
  return true;
};

export const Empty = [
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

export const profileElementsSettings: Array<ITournamentElement> = [
  {
    name: "email",
    placeholder: "Email",
    input: "text",
    size: {
      xs: 12,
      md: 12,
      lg: 6,
    },
  },
  {
    name: "name",
    placeholder: "Name",
    input: "text",
    size: {
      xs: 12,
      md: 12,
      lg: 6,
    },
  },
  {
    name: "lastName",
    placeholder: "Last Name",
    input: "text",
    size: {
      xs: 12,
      md: 12,
      lg: 6,
    },
  },
  {
    name: "ghinNumber",
    placeholder: "GHIN Number",
    input: "text",
    size: {
      xs: 12,
      md: 12,
      lg: 6,
    },
  },
];

export interface IProfileElement {
  name: string;
  lastName: string;
  email: string;
  ghinNumber: string;
  [key: string]: string;
}

export const profileFields: IProfileElement = {
  name: "",
  lastName: "",
  email: "",
  ghinNumber: "",
};

export const profileFieldsValidation: yup.ObjectSchema<IProfileElement> = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Name is required")
      .min(4, "Name should be of minimum 4 characters length"),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(4, "Last Name should be of minimum 4 characters length"),
    ghinNumber: yup.string().required("GHIN Number is required"),
    email: yup.string().required("League type is required"),
  });

export const createAccountElements: Array<ITournamentElement> = [
  {
    name: "name",
    placeholder: "Name",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "lastName",
    placeholder: "Last Name",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "email",
    placeholder: "Email",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "password",
    placeholder: "Password",
    input: "password",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
];

export interface IAccountElement {
  name: string;
  lastName: string;
  email: string;
  password: string;
  [key: string]: string;
}

export const accountFieldsEmpty: IAccountElement = {
  name: "",
  lastName: "",
  email: "",
  password: "",
};

export const accountFieldsValidation: yup.ObjectSchema<IAccountElement> = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Name is required")
      .min(4, "Name should be of minimum 4 characters length"),
    lastName: yup
      .string()
      .required("Last Name is required")
      .min(4, "Last Name should be of minimum 4 characters length"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("No password provided.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  });
