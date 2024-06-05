export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  activeTournaments: string[];
  password?: string;
  ghinNumber?: string;
  handicap?: number;
  lastCourses?: string[];
}

export default class UserModel implements IUser {
  id = "";
  name = "";
  lastName = "";
  email = "";
  password? = "";
  ghinNumber? = "";
  handicap? = 0;
  activeTournaments = [] as string[];
  lastCourses = [] as string[];

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}
