import { action, makeObservable, observable, toJS } from "mobx";
import { Messages } from "../helpers/messages";
import MatchModel, { IMatchResults } from "../models/Match";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import {
  createMatch,
  sendCustomEmail,
  updatePlayer,
} from "../services/firebase";
import ScoreViewModel from "./ScoreViewModel";
import UserViewModel from "./UserViewModel";
import moment from "moment-timezone";
import TournamentModel from "../models/Tournament";
import { getBodyMail } from "../helpers/getMatchMail";

class MatchViewModel {
  match: MatchModel = new MatchModel();
  author: UserViewModel = new UserViewModel();
  currentTournament: TournamentModel = new TournamentModel();
  idMatch = "";
  tournamentId = "";
  currentDistance: Array<number> = [];
  currentHcp: Array<number> = [];
  currentPar: Array<number> = [];
  currentStep = 0;
  players: Array<ScoreViewModel> = [];
  differenceHP: Array<number> = [];
  winByHole: Array<string> = [];
  winnerMatch: Array<string> = [];
  winnerMedalPlay: Array<string> = [];
  matchResults: Array<IMatchResults> = [];

  constructor() {
    makeObservable(this, {
      match: observable,
      author: observable,
      idMatch: observable,
      tournamentId: observable,
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
    this.match.scoresId = match.scoresId;
    this.match.matchResults = match.matchResults;
  }

  setHoleScores(scores: Array<number>, hole: number): void {
    this.players.forEach((player, key) => {
      player.setHoleScore(hole, scores[key]);
    });
  }

  calculateWinners(): void {
    const tournamentType = this.currentTournament.tournamentType;
    const playType = this.currentTournament.playType;

    const isLTMATCH =
      tournamentType === "leagueteamplay" && playType === "matchPlay";
    const isLTMEDAL =
      tournamentType === "leagueteamplay" && playType === "strokePlay";
    const isLMATCH = tournamentType === "league" && playType === "matchPlay";
    const isLMEDAL = tournamentType === "league" && playType === "strokePlay";

    const winners: Array<string> = [];
    let winner = "";
    let currentMatchResult = 0;
    let winnerStrokePlay = "";
    for (let index = 0; index < 18; index++) {
      const playersA = this.players[0];
      const playersB = this.players[1];

      if (playersA.score.totalNet === playersB.score.totalNet) {
        this.winnerMedalPlay = [
          playersA.score.idPlayer,
          playersB.score.idPlayer,
        ];
        winnerStrokePlay = "Medal Play Draw";
      } else {
        this.winnerMedalPlay =
          playersA.score.totalNet < playersB.score.totalNet
            ? [playersA.score.idPlayer]
            : [playersB.score.idPlayer];
        winnerStrokePlay =
          (playersA.score.totalNet < playersB.score.totalNet
            ? playersA.score.player
            : playersB.score.player) + " wins Medal Play ";
      }
      // winnerStrokePlay =
      //   playersA.score.totalNet < playersB.score.totalNet
      //     ? playersA.score.player + " wins Medal Play "
      //     : playersB.score.player + " wins Medal Play  ";
      // winnerStrokePlay =
      //   playersA.score.totalNet === playersB.score.totalNet
      //     ? "Medal Play Draw"
      //     : winnerStrokePlay;

      const scoreA =
        playersA.score.scoreHolesHP[index] && playersA.score.scoreHoles[index]
          ? playersA.score.scoreHoles[index] -
            playersA.score.scoreHolesHP[index]
          : playersA.score.scoreHoles[index];
      const scoreB =
        playersB.score.scoreHolesHP[index] && playersB.score.scoreHoles[index]
          ? playersB.score.scoreHoles[index] -
            playersB.score.scoreHolesHP[index]
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
        this.winnerMatch = [""];
      } else if (currentMatchResult === 0) {
        winners.push("AS");
        winner = "Match All Square";
        this.winnerMatch = [playersA.score.idPlayer, playersB.score.idPlayer];
      } else {
        const strokeUp = Math.abs(currentMatchResult);
        const diff = 18 - strokeUp;
        const tempWinner =
          currentMatchResult > 0 ? playersA.score : playersB.score;
        winner = tempWinner.player + " wins Match Play";
        this.winnerMatch = [tempWinner.idPlayer];
        // Math.abs(currentMatchResult) +
        // " & " +
        // (18 - diff - 1);
        if (diff >= index) {
          winners.push(String(currentMatchResult));
        }
      }
      winner =
        winner != ""
          ? !isLTMATCH && !isLMATCH
            ? winner + " / " + winnerStrokePlay
            : winner
          : "";
      if (isLTMEDAL || isLMEDAL) {
        winner = winner != "" ? winnerStrokePlay : "";
      }
      if (isLTMATCH || isLTMATCH) {
        winner = winner != "" ? winner : "";
      }
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
    const tournamentType = this.currentTournament.tournamentType;
    const playType = this.currentTournament.playType;

    const isLMATCHMEDAL =
      tournamentType === "league" && playType === "matchstrokePlay";
    const isLMATCH = tournamentType === "league" && playType === "matchPlay";
    const isLMEDAL = tournamentType === "league" && playType === "strokePlay";
    try {
      const pointsPerWin = this.currentTournament.pointsPerWin;
      const pointsPerTie = this.currentTournament.pointsPerTie;

      const scoresIds = this.players.map(async (p) => await p.createScore());
      this.match.scoresId = await Promise.all(scoresIds);
      const matchResults = this.players.map((p) => ({
        idPlayer: p.score.idPlayer,
        playerName: p.score.player,
        score: p.score.totalNet,
        gross: p.score.totalGross,
        hcp: `${p.score.handicap}`,
        teamPoints: p.score.teamPoints.reduce((a, b) => a + b, 0),
        isWinnerMatch: this.winnerMatch.includes(p.score.idPlayer),
        isWinnerMedalPlay: this.winnerMedalPlay.includes(p.score.idPlayer),
      }));
      const playersMail = [
        this.players[0].score.idPlayer,
        this.players[1].score.idPlayer,
      ];
      const winnerMatch = this.winnerMatch;
      const strokePlayPoints =
        this.players[0].score.totalNet === this.players[1].score.totalNet
          ? [pointsPerTie, pointsPerTie]
          : this.players[0].score.totalNet < this.players[1].score.totalNet
          ? [pointsPerWin, 0]
          : [0, pointsPerWin];
      const teamPoints = [
        this.players[0].score.teamPoints.reduce((a, b) => a + b, 0),
        this.players[1].score.teamPoints.reduce((a, b) => a + b, 0),
      ] as Array<number>;
      const matchsPoints =
        winnerMatch.length > 1
          ? [pointsPerTie, pointsPerTie]
          : this.winnerMatch.includes(playersMail[0])
          ? [pointsPerWin, 0]
          : [0, pointsPerWin];

      for (const playerMail of playersMail) {
        const index = playersMail.indexOf(playerMail); // Get the index of the current playerMail
        const playerUpdated = {
          email: playerMail,
          opponent: playersMail[index === 0 ? 1 : 0],
          pointsMatch: matchsPoints[index],
          pointsStroke: strokePlayPoints[index],
          pointsTeam: teamPoints[index],
          tournamentId: this.tournamentId,
          scoreId: this.match.scoresId[index],
          gross: this.players[index].score.totalGross,
          net: this.players[index].score.totalNet,
          handicap: this.players[index].score.handicap,
          // wins: winnerMatch.includes(playerMail) ? [winnerStrokePlay] : [],
          // losses: winnerMatch.includes(playerMail) ? [] : [winnerStrokePlay],
          // ties: winnerMatch.includes(playerMail) ? [] : [],
        };
        await updatePlayer({ ...playerUpdated });
      }

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
        tournamentId: this.tournamentId,
        matchResults,
      });
      const result = getBodyMail(
        this.players,
        this.winByHole,
        isLMATCH || isLMEDAL || isLMATCHMEDAL,
        this.match.winner
      );
      const bodyMail = `<p>We just posted this result:</p> <p style="margin:0;">${this.currentTournament.name}</p><p style="margin:0;">${this.match.courseDisplayName}</p>${result}`;
      this.currentTournament.playersList.forEach(async (mail) => {
        if (mail.email) {
          await sendCustomEmail(mail.email, this.match.winner, bodyMail);
        }
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
