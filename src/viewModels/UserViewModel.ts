import { action, makeObservable, observable } from "mobx";
import { createUser, login, getTournamentsByID } from "../services/firebase";
import type { IUser } from "../models/User";
import { Messages } from "../helpers/messages";
import UserModel from "../models/User";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import { ITournament } from "../models/Tournament";

class UserViewModel {
  user: UserModel = new UserModel();
  tournaments: Array<ITournament> = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      tournaments: observable,
      setUser: action,
      createUser: action,
      getUserId: action,
    });
  }

  setUser(user: IUser): void {
    this.user = user;
  }

  getUserId(): string {
    return this.user.id;
  }
  getUserName(): string {
    return this.user.name;
  }
  async createUser(user: IUser): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      const createdUser = await createUser(user);
      this.setUser(createdUser);
      const displayMessage = getMessages(Messages.USER_CREATED);
      toast.update(cuToast, {
        render: displayMessage,
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 800,
      });
    } catch (error) {
      const codeError = (error as FirebaseError).code;
      const displayError = getMessages(codeError);
      toast.update(cuToast, {
        render: displayError,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 800,
      });
    }
  }

  async loginUser(email: string, password: string): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      await login(email, password);
      const displayMessage = getMessages(Messages.USER_LOGGED);
      toast.update(cuToast, {
        render: displayMessage,
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 800,
      });
    } catch (error) {
      const codeError = (error as FirebaseError).code;
      const displayError = getMessages(codeError);
      toast.update(cuToast, {
        render: displayError,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 800,
      });
    }
  }

  async getTournaments(): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      this.tournaments = (await getTournamentsByID(this.user.id)) || [];
      const displayMessage = getMessages(Messages.USER_LOGGED);
      toast.update(cuToast, {
        render: displayMessage,
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 800,
      });
    } catch (error) {
      const codeError = (error as FirebaseError).code;
      const displayError = getMessages(codeError);
      toast.update(cuToast, {
        render: displayError,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 800,
      });
    }
  }
}

export default UserViewModel;
