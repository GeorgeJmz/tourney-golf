export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  ghinNumber?: string;
  handicap?: number;
}

export default class UserModel implements IUser {
  id = "";
  name = "";
  lastName = "";
  email = "";
  password? = "";
  ghinNumber? = "";
  handicap? = 0;

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}
