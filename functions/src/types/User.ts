export type UserType = {
  lastCourses: string[];
  name: string;
  lastName: string;
  email: string;
  password?: string;
  id: string;
  ghinNumber: string;
  uuid?: string;
  activeTournaments: { tournamentId: string; tournamentName: string }[];
  historyTournaments: {
    tournamentId: string;
    tournamentName: string;
    result: string;
  }[];
  sequentialUserId?: number;
  disabled?: boolean;
};

export type RequestAddUser = {
  body: UserType;
  params: { entryId: string };
};

export type RequestGetUsers = {
  query: { email: string };
};
