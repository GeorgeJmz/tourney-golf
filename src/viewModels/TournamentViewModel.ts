import { action, makeObservable, observable, toJS } from "mobx";
import { createTournament, updateTournament } from "../services/firebase";
import { Messages } from "../helpers/messages";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import TournamentModel from "../models/Tournament";
import type {
  IStep1InputElement,
  IRulesInputElement,
} from "../helpers/getTournamentFields";
import type { ITournament, IGroup, IPlayer } from "../models/Tournament";

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
      addEmailToList: action,
      editEmailList: action,
      removeEmailFromList: action,
      getPlayers: action,
      getGroups: action,
      getPlayersPerGroup: action,
      movePlayer: action,
    });
  }

  setTournament(tournament: Partial<ITournament>): void {
    // console.log(JSON.stringify({...tournament}, null, 2));
    // console.log(JSON.stringify({...this.tournament}, null, 2));
    // console.log(JSON.stringify({...this.tournament, ...tournament}, null, 2));
    this.tournament = { ...this.tournament, ...tournament };
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
      playType: this.tournament.playType,
    };
  }

  getRulesValues(): IRulesInputElement {
    return {
      calcuta: this.tournament.calcuta,
      playoffs: this.tournament.playOffs,
      startDate: this.tournament.startDate,
      cutOffDate: this.tournament.cutOffDate,
      matchesPerRound: this.tournament.matchesPerRound,
    };
  }

  getTournamentName(): string {
    return this.tournament.name;
  }

  addEmailToList(email: string, name: string): void {
    this.emailList.push({ name, email });
  }

  editEmailList(email: string, name: string, index: number): void {
    this.emailList[index] = { name, email };
  }

  removeEmailFromList(key: number): void {
    const newEmailList = [...this.emailList];
    newEmailList.splice(key, 1);
    this.emailList = newEmailList;
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

  updatePlayersPerGroup(groups: IGroup[]): void {
    this.tournament.playersPerGroup = groups;
    this.tournament.groups = groups.length - 1;
    this.updateTournament(toJS(this.tournament));
  }

  updateTeams(teams: IGroup[]): void {
    this.tournament.teams = teams;
    this.updateTournament(toJS(this.tournament));
  }

  updateConference(conference: IGroup[]): void {
    this.tournament.conference = conference;
    this.updateTournament(toJS(this.tournament));
  }

  async createTournament(tournament: Partial<ITournament>): Promise<void> {
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

  async updateTournament(tournament: Partial<ITournament>): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      const thisTournament = toJS(this.tournament);
      await updateTournament(this.idTournament, {
        ...thisTournament,
        ...tournament,
        author: this.author,
      });

      this.setTournament({
        ...thisTournament,
        ...tournament,
        author: this.author,
      });
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
