import { action, makeObservable, observable } from "mobx";
import ScoreModel from "../models/Score";
import { Messages } from "../helpers/messages";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import { createScore } from "../services/firebase";

class ScoreViewModel {
  score: ScoreModel = new ScoreModel();
  currentPar: Array<number> = [];
  constructor() {
    makeObservable(this, {
      score: observable,
      setPlayer: action,
      setHoleScore: action,
      updateTotal: action,
      updateIn: action,
      updateOut: action,
      setDifferenceHandicap: action,
    });
    this.score.scoreHoles = Array.from({ length: 18 }, () => 0);
  }

  setHoleScore(hole: number, score: number) {
    this.score.scoreHoles[hole] = score;
    //score === 1 = Hole in one === 10 points
    const isHoleHP =
      this.score.scoreHolesHP[hole] && this.score.scoreHoles[hole];
    const strokesVsPar = isHoleHP
      ? score - 1 - this.currentPar[hole]
      : score - this.currentPar[hole];
    let points = 0;
    if (strokesVsPar === -4) {
      points = 6;
    }
    if (strokesVsPar === -3) {
      points = 5;
    }
    if (strokesVsPar === -2) {
      points = 4;
    }
    if (strokesVsPar === -1) {
      points = 3;
    }
    if (strokesVsPar === 0) {
      points = 2;
    }
    if (strokesVsPar === 1) {
      points = 1;
    }
    if (strokesVsPar >= 2) {
      points = 0;
    }
    if (score === 1) {
      points = 10;
    }

    this.score.teamPoints[hole] = points;

    this.score.teamPoints[hole] = points;
    this.updateIn();
    this.updateOut();
    this.updateTotal();
    this.updateTotalNet();
  }
  updateTotal() {
    this.score.totalGross = this.score.scoreHoles
      ? this.score.scoreHoles.reduce((a, b) => a + b, 0)
      : 0;
  }

  updateTotalNet() {
    this.score.totalNet = this.score.totalGross - this.score.handicap;
  }
  updateIn() {
    this.score.in = this.score.scoreHoles
      ? this.score.scoreHoles.slice(9, 18).reduce((a, b) => a + b, 0)
      : 0;
  }
  updateOut() {
    this.score.out = this.score.scoreHoles
      ? this.score.scoreHoles.slice(0, 9).reduce((a, b) => a + b, 0)
      : 0;
  }

  setPlayer(player: string, playerId: string, handicap: number) {
    this.score.player = player;
    this.score.idPlayer = playerId;
    this.score.handicap = handicap;
  }

  setDifferenceHandicap = (
    difference: number,
    hcp: Array<number>,
    par: Array<number>
  ) => {
    const outHcp = Math.floor(difference / 2) + (difference % 2);
    const inHcp = Math.ceil(difference / 2) - (difference % 2);
    this.currentPar = par;
    const pars = {
      OUT: hcp.slice(0, 9),
      IN: hcp.slice(9, 18),
    };

    const outHcpArray = this.getArrayPosition(pars.OUT, outHcp);
    const inHcpArray = this.getArrayPosition(pars.IN, inHcp);

    const inPars = Array(9).fill(false);
    const outPars = Array(9).fill(false);

    outHcpArray.forEach((hole) => {
      outPars[hole] = true;
    });

    inHcpArray.forEach((hole) => {
      inPars[hole] = true;
    });

    this.score.scoreHolesHP = [...outPars, ...inPars];
  };

  getArrayPosition = (array: number[], values: number) => {
    const hashPositions = array.reduce((acc, value, index) => {
      acc[value] = index;
      return acc;
    }, {} as { [key: number]: number });

    const orderedValues = array.slice().sort((a, b) => a - b);
    const arrayPositions = orderedValues
      .slice(0, values)
      .map((value) => hashPositions[value]);

    return arrayPositions;
  };

  async createScore(): Promise<string> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      const scoreId = await createScore({
        ...this.score,
      });
      const displayMessage = getMessages(Messages.SCORE_CREATED);
      toast.update(cuToast, {
        render: displayMessage,
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 800,
      });
      return scoreId || "";
    } catch (error) {
      const codeError = (error as FirebaseError).code;
      const displayError = getMessages(codeError);
      toast.update(cuToast, {
        render: displayError,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 800,
      });
      return "";
    }
  }
}
export default ScoreViewModel;
