import { action, makeObservable, observable } from "mobx";
import ScoreModel from "../models/Score";

class ScoreViewModel {
  score: ScoreModel = new ScoreModel();
  constructor() {
    makeObservable(this, {
      score: observable,
      setPlayer: action,
      setHoleScore: action,
      updateTotal: action,
      updateIn: action,
      updateOut: action,
    });
    this.score.scoreHoles = Array.from({ length: 18 }, () => 0);
  }
  setHoleScore(hole: number, score: number) {
    this.score.scoreHoles[hole] = score;
    this.updateIn();
    this.updateOut();
    this.updateTotal();
  }
  updateTotal() {
    this.score.total = this.score.scoreHoles
      ? this.score.scoreHoles.reduce((a, b) => a + b, 0)
      : 0;
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

  setPlayer(player: string, playerId: string, strokes: number) {
    this.score.player = player;
    this.score.idPlayer = playerId;
    this.score.strokes = strokes;
  }
}
export default ScoreViewModel;
