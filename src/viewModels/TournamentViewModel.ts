import { action, makeObservable, observable, toJS } from "mobx";
import { createTournament, updateTournament } from "../services/firebase";
import { Messages } from "../helpers/messages";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import TournamentModel from "../models/Tournament";
import type { IStep1InputElement } from "../helpers/getTournamentFields";
import type { ITournament, IGroup, IPlayer } from "../models/Tournament";
import { faker } from "@faker-js/faker";

class TournamentViewModel {
  tournament: TournamentModel = new TournamentModel();
  author = "";
  idTournament = "";
  emailList: Array<Partial<IPlayer>> = [];

  constructor() {
    makeObservable(this, {
      tournament: observable,
      author: observable,
      idTournament: observable,
      emailList: observable,
      setTournament: action,
      createTournament: action,
      updateTournament: action,
      getTournamentValues: action,
      getAuthor: action,
      getTournamentName: action,
      getEmailList: action,
      getPlayers: action,
      getGroups: action,
      getPlayersPerGroup: action,
      setupGroups: action,
      movePlayer: action,
    });
  }

  setTournament(tournament: ITournament): void {
    this.tournament = tournament;
  }

  setAuthor(id: string): void {
    this.author = id;
  }

  getAuthor(): string {
    return this.author;
  }

  setTournamentId(id: string): void {
    this.idTournament = id;
  }

  getTournamentValues(): IStep1InputElement {
    return {
      name: this.tournament.name,
      type: this.tournament.tournamentType,
      players: this.tournament.players,
      groups: this.tournament.groups,
      playType: this.tournament.playType,
    };
  }

  getTournamentName(): string {
    return this.tournament.name;
  }

  addEmailToList(email: string, name: string): void {
    this.emailList.push({ name, email });
  }

  getEmailList(): Array<Partial<IPlayer>> {
    return this.emailList;
  }

  getPlayers(): number {
    return this.tournament.players;
  }
  getGroups(): number {
    return this.tournament.groups;
  }

  setupGroups(): void {
    const players = this.emailList.map(({ email, name }, key) => ({
      id: `${email}-${key}`,
      email: email,
      name: name,
      handicap: faker.number.int(20),
    })) as Array<IPlayer>;

    this.tournament.playersPerGroup = Array.from(
      Array(this.tournament.groups).keys()
    ).map((i) => ({
      id: `group${i}`,
      name: `Group ${i + 1}`,
      isEditing: false,
      players: [],
    }));

    this.tournament.playersPerGroup[0].players = players;
    this.updateTournament(this.tournament);
  }

  getPlayersPerGroup(): Array<IGroup> {
    return this.tournament.playersPerGroup;
  }

  movePlayer(
    indexGroup: number,
    indexPlayer: number,
    destinationGroup: number
  ) {
    this.tournament.playersPerGroup[destinationGroup].players.push(
      this.tournament.playersPerGroup[indexGroup].players[indexPlayer]
    );
    delete this.tournament.playersPerGroup[indexGroup].players[indexPlayer];
    this.tournament.playersPerGroup[destinationGroup].players =
      this.tournament.playersPerGroup[destinationGroup].players.filter(
        (a) => a
      );
    this.tournament.playersPerGroup[indexGroup].players =
      this.tournament.playersPerGroup[indexGroup].players.filter((a) => a);
  }

  updatePlayersPerGroup(): void {
    this.updateTournament(toJS(this.tournament));
  }

  async createTournament(tournament: ITournament): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      const tournamentId = await createTournament({
        ...tournament,
        author: this.author,
      });

      this.setTournamentId(tournamentId);
      this.setTournament(tournament);
      const displayMessage = getMessages(Messages.TOURNAMENT_CREATED);
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

  async updateTournament(tournament: ITournament): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      await updateTournament(this.idTournament, {
        ...tournament,
        author: this.author,
      });

      this.setTournament(tournament);
      const displayMessage = getMessages(Messages.TOURNAMENT_UPDATED);
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

export default TournamentViewModel;
