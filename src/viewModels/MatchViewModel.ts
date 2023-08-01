import { action, makeObservable, observable } from "mobx";
import { Messages } from "../helpers/messages";
import MatchModel from "../models/Match";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import { createMatch } from "../services/firebase";
import ScoreViewModel from "./ScoreViewModel";
import UserViewModel from "./UserViewModel";

class MatchViewModel {
  match: MatchModel = new MatchModel();
  author: UserViewModel = new UserViewModel();
  idMatch = "";
  currentDistance: Array<number> = [];
  currentHcp: Array<number> = [];
  currentPar: Array<number> = [];
  currentStep = 0;
  players: Array<ScoreViewModel> = [];
  differenceHP: Array<number> = [];
  winByHole: Array<string> = [];

  constructor() {
    makeObservable(this, {
      match: observable,
      author: observable,
      idMatch: observable,
      currentDistance: observable,
      currentHcp: observable,
      currentPar: observable,
      currentStep: observable,
      players: observable,
      differenceHP: observable,
      winByHole: observable,
      getAuthor: action,
      setAuthor: action,
      setPlayers: action,
    });
  }

  calculateWinners(): void {
    const winners: Array<string> = [];
    let winner = "";
    let currentMatchResult = 0;
    for (let index = 0; index < 18; index++) {
      const playersA = this.players[0];
      const playersB = this.players[1];

      const scoreA =
        playersA.score.scoreHolesHP[index] && playersA.score.scoreHoles[index]
          ? playersA.score.scoreHoles[index] - 1
          : playersA.score.scoreHoles[index];
      const scoreB =
        playersB.score.scoreHolesHP[index] && playersB.score.scoreHoles[index]
          ? playersB.score.scoreHoles[index] - 1
          : playersB.score.scoreHoles[index];

      if (scoreA === scoreB) {
        currentMatchResult += 0;
      } else if (scoreA > scoreB) {
        currentMatchResult -= 1;
      } else {
        currentMatchResult += 1;
      }

      if (scoreA === 0 && scoreB === 0) {
        winners.push("");
        winner = "";
      } else if (currentMatchResult === 0) {
        winners.push("AS");
        winner = "All Square";
      } else {
        winner =
          currentMatchResult > 0
            ? playersA.score.player
            : playersB.score.player;
        winners.push(String(currentMatchResult));
      }
    }
    this.winByHole = winners;
    this.match.winner = winner;
  }

  setPlayers(players: Array<ScoreViewModel>): void {
    this.players = players;
  }
  setCurrentStep(step: number): void {
    this.currentStep = step;
  }

  getAuthor(): string {
    return this.author.getUserId();
  }

  setAuthor(author: UserViewModel): void {
    this.author = author;
  }

  setDifferenceHP(): void {
    const playersStrokes = this.players.map((p) => p.score.strokes);
    const minHcp = Math.min(...playersStrokes);
    this.differenceHP = playersStrokes.map((p) => p - minHcp);
    this.players.forEach((p, i) => {
      p.setDifferenceHandicap(this.differenceHP[i], this.currentHcp);
    });
  }

  async createMatch(): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);

    try {
      const scoresIds = this.players.map(async (p) => await p.createScore());
      this.match.scoresId = await Promise.all(scoresIds);
      await createMatch({
        ...this.match,
        author: this.author.getUserId(),
      });
      const displayMessage = getMessages(Messages.MATCH_CREATED);
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

export default MatchViewModel;
