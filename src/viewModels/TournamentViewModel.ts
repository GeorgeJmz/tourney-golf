import { action, makeObservable, observable, toJS } from "mobx";
import {
  createTournament,
  updateTournament,
  assignActiveTourneyByEmail,
} from "../services/firebase";
import { Messages } from "../helpers/messages";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import TournamentModel, { TournamentStatus } from "../models/Tournament";
import type {
  IStep1InputElement,
  IRulesInputElement,
} from "../helpers/getTournamentFields";
import type {
  ITournament,
  IGroup,
  IPlayer,
  ITournamentGroup,
} from "../models/Tournament";
import PlayerModel from "../models/Player";
import { pl } from "@faker-js/faker";

class TournamentViewModel {
  tournament: TournamentModel = new TournamentModel();
  author = "";
  idTournament = "";

  constructor() {
    makeObservable(this, {
      tournament: observable,
      author: observable,
      idTournament: observable,
      setTournament: action,
      createTournament: action,
      updateTournament: action,
      saveEmailList: action,
      getTournamentValues: action,
      getAuthor: action,
      getTournamentName: action,
      getEmailList: action,
      addEmailToList: action,
      editEmailList: action,
      removeEmailFromList: action,
      getPlayers: action,
      updateGroupList: action,
      updateConferencesList: action,
      updateTeamList: action,
      updateGroupPlayers: action,
      updateConferenceGroup: action,
      updateTeamPlayers: action,
      getGroups: action,
      getPlayersPerGroup: action,
      startTournament: action,
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
    this.tournament.id = id;
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

  saveEmailList(): void {
    this.updateTournament(toJS(this.tournament));
  }
  addEmailToList(email: string, name: string): void {
    this.tournament.playersList.push({ name, email, id: email });
    if (this.tournament.playersPerGroup.length > 0) {
      const id = `${email}-${this.tournament.playersList.length - 1}`;
      this.tournament.playersPerGroup[0].players.push({ name, email, id });
      this.tournament.teams[0].players.push({ name, email, id });
    }
  }

  editEmailList(email: string, name: string, index: number): void {
    this.tournament.playersList[index] = {
      ...this.tournament.playersList[index],
      name,
      email,
    };
  }

  removeEmailFromList(key: number): void {
    const newEmailList = [...this.tournament.playersList];
    newEmailList.splice(key, 1);
    this.tournament.playersList = newEmailList;
  }

  getEmailList(): Array<Partial<IPlayer>> {
    return this.tournament.playersList;
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

  updatePlayersPerGroup(groups: IGroup[]): void {
    this.tournament.playersPerGroup = groups;
    this.tournament.groups = groups.length - 1;
    this.updateTournament(toJS(this.tournament));
  }

  updateGroupList(newGroups: Array<ITournamentGroup>): void {
    this.tournament.groupsList = newGroups;
  }
  updateConferencesList(newConferences: Array<ITournamentGroup>): void {
    this.tournament.conferencesList = newConferences;
  }
  updateTeamList(newTeams: Array<ITournamentGroup>): void {
    this.tournament.teamsList = newTeams;
  }
  updateGroupPlayers(group: string, playerId: string) {
    this.tournament.playersList = this.tournament.playersList.map((player) => {
      if (player.id === playerId) {
        player.group = group;
      }
      return player;
    });
  }

  updateConferenceGroup(conference: string, groupId: string) {
    this.tournament.groupsList = this.tournament.groupsList.map((group) => {
      if (group.id === groupId) {
        group.conference = conference;
      }
      return group;
    });
    this.tournament.playersList = this.tournament.playersList.map((player) => {
      if (player.group === groupId) {
        player.conference = conference;
      }
      return player;
    });
  }

  updateTeamPlayers(team: string, playerId: string) {
    this.tournament.playersList = this.tournament.playersList.map((player) => {
      if (player.id === playerId) {
        player.team = team;
      }
      return player;
    });
  }

  updateTeams(teams: IGroup[]): void {
    this.tournament.teams = teams;
    this.updateTournament(toJS(this.tournament));
  }

  updateConference(conference: IGroup[]): void {
    this.tournament.conference = conference;
    this.updateTournament(toJS(this.tournament));
  }

  startTournament(): void {
    this.tournament.status = TournamentStatus.PUBLISHED;
    // Send email to all players
    // Add tourney to user's list
    this.tournament.playersList.forEach((player) => {
      const nPlayer = new PlayerModel({
        name: player.name || "",
        email: player.email || "",
        group: player.group || "",
        team: player.team || "",
        conference: player.conference || "",
        tournamentId: this.idTournament || "",
      });
      console.log(toJS(nPlayer));
      assignActiveTourneyByEmail(
        player.email || "",
        this.idTournament,
        toJS(nPlayer)
      );
    });
    //this.updateTournament(toJS(this.tournament));
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
