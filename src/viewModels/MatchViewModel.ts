import { action, makeObservable, observable } from "mobx";
import { Messages } from "../helpers/messages";
import MatchModel from "../models/Match";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import { createMatch } from "../services/firebase";
import ScoreViewModel from "./ScoreViewModel";
import UserViewModel from "./UserViewModel";
import moment from "moment-timezone";

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
      setHoleScores: action,
      setMatch: action,
    });
  }

  setMatch(match: MatchModel): void {
    this.match.author = match.author;
    this.match.course = match.course;
    this.match.courseDisplayName = match.courseDisplayName;
    this.match.teeBox = match.teeBox;
    this.match.teeBoxDisplayName = match.teeBoxDisplayName;
  }

  setHoleScores(scores: Array<number>, hole: number): void {
    this.players.forEach((player, key) => {
      player.setHoleScore(hole, scores[key]);
    });
  }

  calculateWinners(): void {
    const winners: Array<string> = [];
    let winner = "";
    let currentMatchResult = 0;
    let winnerStrokePlay = "";
    for (let index = 0; index < 18; index++) {
      const playersA = this.players[0];
      const playersB = this.players[1];

      winnerStrokePlay =
        playersA.score.totalNet < playersB.score.totalNet
          ? playersA.score.player + " wins stoke play "
          : playersB.score.player + " wins stoke play  ";
      winnerStrokePlay =
        playersA.score.totalNet === playersB.score.totalNet
          ? "Stroke Play Draw"
          : winnerStrokePlay;

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
        winner = "Match All Square";
      } else {
        const strokeUp = Math.abs(currentMatchResult);
        const diff = 18 - strokeUp;
        winner =
          currentMatchResult > 0
            ? playersA.score.player + " wins match "
            : // (18 - diff - 1)
              playersB.score.player + " wins match ";
        // Math.abs(currentMatchResult) +
        // " & " +
        // (18 - diff - 1);
        if (diff >= index) {
          winners.push(String(currentMatchResult));
        }
      }
      winner = winner != "" ? winner + " / " + winnerStrokePlay : "";
    }
    this.winByHole = winners;
    this.match.winner = winner;
  }

  setPlayers(players: Array<ScoreViewModel>): void {
    this.players = players.map((p) => {
      const player = new ScoreViewModel();
      player.setPlayer(p.score.player, p.score.idPlayer, p.score.handicap);
      return player;
    });
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
    const playersHandicap = this.players.map((p) => p.score.handicap);
    const minHcp = Math.min(...playersHandicap);
    this.differenceHP = playersHandicap.map((p) => p - minHcp);
    this.players.forEach((p, i) => {
      p.setDifferenceHandicap(
        this.differenceHP[i],
        this.currentHcp,
        this.currentPar
      );
    });
  }

  async createMatch(): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);

    try {
      const scoresIds = this.players.map(async (p) => await p.createScore());
      this.match.scoresId = await Promise.all(scoresIds);
      const getCurrentMoment = () => {
        const currentMoment = moment();
        return {
          eventDate: currentMoment.valueOf(),
          eventTimezone: moment.tz.guess(),
        };
      };
      const { eventDate, eventTimezone } = getCurrentMoment();
      const saveDate = [String(eventDate), eventTimezone];
      await createMatch({
        ...this.match,
        author: this.author.getUserId(),
        date: saveDate,
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
