import * as yup from "yup";

export interface ITournamentElement {
  name: string;
  placeholder: string;
  input: "text" | "select" | "number" | "date" | "switch" | "multiple";
  size: {
    xs: number;
    md: number;
    lg: number;
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
      lg: 6,
    },
  },
  {
    name: "type",
    placeholder: "Type of Tournament",
    input: "select",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
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
      lg: 6,
    },
  },
  {
    name: "groups",
    placeholder: "Number of Groups",
    input: "number",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: "playType",
    placeholder: "Type of Play",
    input: "select",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
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

export const invitationsMatch: Array<ITournamentElement> = [
  {
    name: "name",
    placeholder: "Participant Name",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "email",
    placeholder: "Participant Email",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "strokes",
    placeholder: "Strokes",
    input: "text",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
];
export interface IInvitationsInputElement {
  email: string;
  name: string;
  strokes: number | "";
  [key: string]: string | number | "";
}

export const invitationsFields: IInvitationsInputElement = {
  email: "",
  name: "",
  strokes: "",
};

export const invitationsFieldsValidations: yup.ObjectSchema<IInvitationsInputElement> =
  yup.object().shape({
    email: yup
      .string()
      .email("Please fill a valid email")
      .required("Email is required")
      .min(4, "Email should be of minimum 4 characters length"),
    name: yup
      .string()
      .required("PLayer Name is required")
      .min(4, "PLayer Name should be of minimum 4 characters length"),
    strokes: yup.number().required("Strokes are required"),
  });

export const rules: Array<ITournamentElement> = [
  {
    name: "startDate",
    placeholder: "Tourney Start Date",
    input: "date",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: "cutOffDate",
    placeholder: "Regular Season Cutoff",
    input: "date",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
    },
  },
  {
    name: "matchesPerRound",
    placeholder: "Max matches per round",
    input: "multiple",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
    },
    options: [
      { displayName: "Double", value: "double" },
      { displayName: "Triple", value: "triple" },
      { displayName: "Quadruple", value: "cuadruple" },
    ],
  },
  {
    name: "playoffs",
    placeholder: "Playoffs",
    input: "switch",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
  {
    name: "calcuta",
    placeholder: "Calcuta",
    input: "switch",
    size: {
      xs: 12,
      md: 3,
      lg: 3,
    },
  },
];

export interface IRulesInputElement {
  startDate: string | null;
  cutOffDate: string | null;
  matchesPerRound: Array<string>;
  playoffs: boolean;
  calcuta: boolean;
  [key: string]: boolean | string | null | Array<string>;
}

export const rulesFields: IRulesInputElement = {
  startDate: null,
  cutOffDate: null,
  matchesPerRound: [],
  playoffs: false,
  calcuta: false,
};

export const rulesFieldsValidations: yup.ObjectSchema<IRulesInputElement> = yup
  .object()
  .shape({
    startDate: yup.string().required("Start Date is required"),
    cutOffDate: yup.string().required("CutOff Date is required"),
    playoffs: yup.boolean().required("Playoffs"),
    matchesPerRound: yup.array().required("Matches Required"),
    calcuta: yup.boolean().required("Calcuta"),
  });

export const step2: Array<ITournamentElement> = [
  {
    name: "name",
    placeholder: "Participant Name",
    input: "text",
    size: {
      xs: 12,
      md: 4,
      lg: 4,
    },
  },
  {
    name: "email",
    placeholder: "Participant Email",
    input: "text",
    size: {
      xs: 12,
      md: 4,
      lg: 4,
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
