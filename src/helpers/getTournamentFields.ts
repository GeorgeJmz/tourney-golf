import * as yup from "yup";

export interface ITournamentElement {
  name: string;
  placeholder: string;
  input:
    | "text"
    | "select"
    | "number"
    | "date"
    | "multipleDates"
    | "switch"
    | "multiple"
    | "password";
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
    placeholder: "League Name",
    input: "text",
    size: {
      xs: 12,
      md: 12,
      lg: 6,
    },
  },
  {
    name: "type",
    placeholder: "Type of League",
    input: "select",
    size: {
      xs: 12,
      md: 6,
      lg: 6,
    },
    options: [
      // { displayName: "Tourney", value: "tourney" },
      { displayName: "League", value: "league" },
      { displayName: "League + Team Play", value: "leagueteamplay" },
      { displayName: "Team Play", value: "teamplay" },
      // { displayName: "Team 3 Stage", value: "3stage" },
      { displayName: "Dogfight", value: "dogfight" },
    ],
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
      { displayName: "Medal Play", value: "strokePlay" },
      { displayName: "Match + Medal Play", value: "matchstrokePlay" },
    ],
  },
];

export const getStep1 = (type: string) => {
  if (type === "3stage" || type === "teamplay") {
    return [
      step1[0],
      step1[1],
      {
        name: "playType",
        placeholder: "Type of Play",
        input: "select",
        size: {
          xs: 12,
          md: 6,
          lg: 6,
        },
        options: [{ displayName: "Stableford", value: "stableford" }],
      },
    ] as ITournamentElement[];
  }
  if (type === "dogfight") {
    return [
      step1[0],
      step1[1],
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
          { displayName: "Medal Play", value: "strokePlay" },
          { displayName: "Stableford", value: "stableford" },
        ],
      },
    ] as ITournamentElement[];
  }
  return step1 as ITournamentElement[];
};

export interface IStep1InputElement {
  name: string;
  type: string | "";
  //players: number | "";
  //groups: number | "";
  playType: string | "";
  [key: string]: string | number | "";
}

export const step1Fields: IStep1InputElement = {
  name: "",
  type: "",
  //players: 20,
  //groups: "",
  playType: "",
};

export const step1FieldsValidations: yup.ObjectSchema<IStep1InputElement> = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("League Name is required")
      .min(4, "League Name should be of minimum 4 characters length"),
    type: yup.string().required("League type is required"),
    // players: yup
    //   .number()
    //   .min(2, "Min")
    //   .max(100, "Max")
    //   .required("Number of Players is required"),
    // groups: yup
    //   .number()
    //   .required("Number of Groups is required")
    //   .min(1, "Minimum of 1 group is required"),
    // .when("players", (players, schema) => {
    //   return schema.max(
    //     players as unknown as number,
    //     "Number of groups cannot exceed the number of players"
    //   );
    // }),
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
    name: "handicap",
    placeholder: "Handicap",
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
  handicap: number | "";
  [key: string]: string | number | "";
}

export const invitationsFields: IInvitationsInputElement = {
  email: "",
  name: "",
  handicap: "",
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
      .required("Player Name is required")
      .min(4, "Player Name should be of minimum 4 characters length"),
    handicap: yup.number().required("Handicap are required"),
  });

export const rules: Array<ITournamentElement> = [
  {
    name: "startDate",
    placeholder: "League Start Date",
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
      md: 3,
      lg: 3,
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
];

export const getRules = (type: string, tournamentType: string) => {
  const matchPoints = [
    {
      name: "pointsPerWin",
      placeholder: "Points Per Win Match",
      input: "number",
      size: {
        xs: 12,
        md: 3,
        lg: 3,
      },
    },
    {
      name: "pointsPerTie",
      placeholder: "Points Per Tie Match",
      input: "number",
      size: {
        xs: 12,
        md: 3,
        lg: 3,
      },
    },
  ];
  const medalPoints = [
    {
      name: "pointsPerWinMedal",
      placeholder: "Points Per Win Medal",
      input: "number",
      size: {
        xs: 12,
        md: 3,
        lg: 3,
      },
    },
    {
      name: "pointsPerTieMedal",
      placeholder: "Points Per Tie Medal",
      input: "number",
      size: {
        xs: 12,
        md: 3,
        lg: 3,
      },
    },
  ];
  if (tournamentType === "dogfight") {
    return [
      {
        name: "numberOfRounds",
        placeholder: "Number of Rounds",
        input: "number",
        size: {
          xs: 12,
          md: 12,
          lg: 12,
        },
      },
      {
        name: "roundDates",
        placeholder: "Round Dates",
        input: "multipleDates",
        size: {
          xs: 12,
          md: 12,
          lg: 12,
        },
      },
      {
        name: "championshipRound",
        placeholder: "Championship Round",
        input: "switch",
        size: {
          xs: 12,
          md: 6,
          lg: 6,
        },
      },
      {
        name: "championshipDate",
        placeholder: "Championship Date",
        input: "date",
        size: {
          xs: 12,
          md: 6,
          lg: 6,
        },
      },
      {
        name: "minRounds",
        placeholder: "Minimum Rounds to Qualify for Final",
        input: "number",
        size: {
          xs: 12,
          md: 12,
          lg: 12,
        },
      },
    ] as ITournamentElement[];
  }
  if (type === "matchPlay") {
    return [
      rules[0],
      rules[1],
      rules[2],
      ...matchPoints,
      rules[3],
    ] as ITournamentElement[];
  }
  if (type === "strokePlay" || type === "stableford") {
    return [
      rules[0],
      rules[1],
      rules[2],
      ...medalPoints,
      rules[3],
    ] as ITournamentElement[];
  }
  if (type === "matchstrokePlay") {
    return [
      rules[0],
      rules[1],
      rules[2],
      ...matchPoints,
      ...medalPoints,
      rules[3],
    ] as ITournamentElement[];
  }
  return rules as ITournamentElement[];
};

export interface IRulesInputElement {
  startDate: string | null;
  cutOffDate: string | null;
  pointsPerTie: number | "";
  pointsPerWin: number | "";
  pointsPerTieMedal: number | "";
  pointsPerWinMedal: number | "";
  matchesPerRound: Array<string>;
  playoffs: boolean;
  [key: string]: boolean | string | number | null | Array<string>;
}

export const rulesFields: IRulesInputElement = {
  startDate: null,
  cutOffDate: null,
  pointsPerTie: 1,
  pointsPerWin: 3,
  pointsPerTieMedal: 1,
  pointsPerWinMedal: 3,
  matchesPerRound: [],
  playoffs: false,
};

export const rulesFieldsValidations: yup.ObjectSchema<IRulesInputElement> = yup
  .object()
  .shape({
    startDate: yup.string().required("Start Date is required"),
    cutOffDate: yup.string().required("CutOff Date is required"),
    pointsPerWin: yup
      .number()
      .min(1, "Min")
      .max(100, "Max")
      .required("Points Per Win is required"),
    pointsPerTie: yup
      .number()
      .min(0, "Min")
      .max(100, "Max")
      .required("Points Per Tie is required"),
    pointsPerWinMedal: yup
      .number()
      .min(1, "Min")
      .max(100, "Max")
      .required("Points Per Win is required"),
    pointsPerTieMedal: yup
      .number()
      .min(0, "Min")
      .max(100, "Max")
      .required("Points Per Tie is required"),
    playoffs: yup.boolean().required("Playoffs"),
    matchesPerRound: yup.array().required("Matches Required"),
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
      .required("Player Name is required")
      .min(4, "Player Name should be of minimum 4 characters length"),
  });
