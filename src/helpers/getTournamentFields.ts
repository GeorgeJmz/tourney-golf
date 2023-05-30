import * as yup from "yup";

export interface ITournamentElement {
  name: string;
  placeholder: string;
  input: "text" | "select" | "number";
  size: {
    xs: number;
    md: number;
  };
  options?: {
    displayName: string;
    value: string;
  }[];
}

export const step1: Array<ITournamentElement> = [
  {
    name: "name",
    placeholder: "Tournament Name",
    input: "text",
    size: {
      xs: 12,
      md: 12,
    },
  },
  {
    name: "type",
    placeholder: "Type of Tournament",
    input: "select",
    size: {
      xs: 12,
      md: 6,
    },
    options: [
      { displayName: "Tourney", value: "tourney" },
      { displayName: "Tourney + Team Play", value: "teamplay" },
    ],
  },
  {
    name: "players",
    placeholder: "Number of Players",
    input: "number",
    size: {
      xs: 12,
      md: 6,
    },
  },
  {
    name: "groups",
    placeholder: "Number of Groups",
    input: "number",
    size: {
      xs: 12,
      md: 6,
    },
  },
  {
    name: "playType",
    placeholder: "Type of Play",
    input: "select",
    size: {
      xs: 12,
      md: 6,
    },
    options: [
      { displayName: "Match Play", value: "matchPlay" },
      { displayName: "Stroke Play", value: "strokePlay" },
      { displayName: "Match + Stroke Play", value: "matchstrokePlay" },
    ],
  },
];

export interface IStep1InputElement {
  name: string;
  type: string | "";
  players: number | "";
  groups: number | "";
  playType: string | "";
  [key: string]: string | number | "";
}

export const step1Fields: IStep1InputElement = {
  name: "",
  type: "",
  players: "",
  groups: "",
  playType: "",
};

export const step1FieldsValidations: yup.ObjectSchema<IStep1InputElement> = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Tournament Name is required")
      .min(4, "Tournament Name should be of minimum 4 characters length"),
    type: yup.string().required("Tournament type is required"),
    players: yup
      .number()
      .min(2, "Min")
      .max(100, "Max")
      .required("Number of Players is required"),
    groups: yup
      .number()
      .required("Number of Groups is required")
      .min(1, "Minimum of 1 group is required")
      .when("players", (players, schema) => {
        return schema.max(
          players as unknown as number,
          "Number of groups cannot exceed the number of players"
        );
      }),
    playType: yup.string().required("Play type is required"),
  });

export const step2: Array<ITournamentElement> = [
  {
    name: "name",
    placeholder: "Participant Name",
    input: "text",
    size: {
      xs: 12,
      md: 4,
    },
  },
  {
    name: "email",
    placeholder: "Participant Email",
    input: "text",
    size: {
      xs: 12,
      md: 4,
    },
  },
];
export interface IStep2InputElement {
  email: string;
  name: string;
  [key: string]: string | number | "";
}

export const step2Fields: IStep2InputElement = {
  email: "",
  name: "",
};

export const step2FieldsValidations: yup.ObjectSchema<IStep2InputElement> = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("Please fill a valid email")
      .required("Email is required")
      .min(4, "Email should be of minimum 4 characters length"),
    name: yup
      .string()
      .required("PLayer Name is required")
      .min(4, "PLayer Name should be of minimum 4 characters length"),
  });
