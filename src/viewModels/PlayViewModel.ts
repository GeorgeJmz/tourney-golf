import { action, makeObservable, observable, toJS } from "mobx";
import { Messages } from "../helpers/messages";
import MatchModel from "../models/Match";
import { toast } from "react-toastify";
import { getMessages } from "../helpers/getMessages";
import type { FirebaseError } from "firebase/app";
import { getCourseDetail, getCourses } from "../services/courses";
import type { GolfCourse } from "../services/courses";
import type { IPlayer } from "../models/Tournament";
import ScoreViewModel from "./ScoreViewModel";
import UserViewModel from "./UserViewModel";
import MatchViewModel from "./MatchViewModel";

export interface IGolfCourse {
  course: GolfCourse;
  isOpen: boolean;
}

class PlayViewModel {
  match: MatchModel = new MatchModel();
  courses: Array<IGolfCourse> = [];
  emailList: Array<Partial<IPlayer>> = [];
  currentTeeBox = "";
  currentTeeBoxDisplayName = "";
  author: UserViewModel = new UserViewModel();
  idMatch = "";
  tournamentId = "";
  currentDistance: Array<number> = [];
  currentHcp: Array<number> = [];
  currentPar: Array<number> = [];
  openModal = false;
  holeModal = "";
  parModal = "";
  modalKey = 0;
  currentStep = 0;
  allPlayers: Array<ScoreViewModel> = [];
  matches: Array<MatchViewModel> = [];

  constructor() {
    makeObservable(this, {
      match: observable,
      emailList: observable,
      currentTeeBox: observable,
      courses: observable,
      author: observable,
      idMatch: observable,
      tournamentId: observable,
      currentTeeBoxDisplayName: observable,
      currentDistance: observable,
      currentHcp: observable,
      currentPar: observable,
      currentStep: observable,
      openModal: observable,
      holeModal: observable,
      parModal: observable,
      modalKey: observable,
      allPlayers: observable,
      getCourses: action,
      openCloseCourse: action,
      selectTeeBox: action,
      getAuthor: action,
      setAuthor: action,
      getEmailList: action,
      addEmailToList: action,
      removeEmailFromList: action,
      setModal: action,
      setModalValues: action,
      setScoreModal: action,
    });
    this.getCourses();
  }

  setCurrentStep(step: number): void {
    this.currentStep = step;
    if (this.currentStep === 2) {
      const author = this.allPlayers[0];
      const players = [...this.allPlayers].slice(1);
      console.log("tournamentId", this.tournamentId);
      players.forEach((player) => {
        const newMatch = new MatchViewModel();
        newMatch.setAuthor(this.author);
        newMatch.setPlayers([author, player]);
        newMatch.tournamentId = this.tournamentId;
        newMatch.matchResults = [];
        // Set TeeBox and Course
        newMatch.setMatch(this.match);

        newMatch.currentDistance = this.currentDistance;
        newMatch.currentHcp = this.currentHcp;
        newMatch.currentPar = this.currentPar;
        newMatch.tournamentId = this.tournamentId;

        newMatch.setDifferenceHP();
        this.matches.push(newMatch);
      });
    }
  }

  setModalValues(key: number): void {
    this.modalKey = key;
    this.holeModal = String(key + 1);
    this.parModal = String(this.currentPar[key]);
  }

  setModal(value: boolean): void {
    this.openModal = value;
  }

  setScoreModal(scores: Array<number>, hole: number): void {
    scores.forEach((score, key) => {
      this.allPlayers[key].setHoleScore(hole, score);
    });
    const author = scores[0];
    const allScores = [...scores].slice(1);
    const allScoresMatches = allScores.map((score) => [author, score]);
    this.matches.forEach((match, key) => {
      match.setHoleScores(allScoresMatches[key], hole);
      match.calculateWinners();
    });
    this.setModal(false);
  }

  getAuthor(): string {
    return this.author.getUserId();
  }

  setAuthor(author: UserViewModel): void {
    this.author = author;
    const name = `${this.author.user.name} ${this.author.user.lastName}`;
    this.addEmailToList(this.author.user.email, name, 0);
  }

  getSelectedTeeBox() {
    return this.match.teeBox;
  }

  addEmailToList(email: string, name: string, handicap: number): void {
    this.emailList.push({ name, email, handicap });
    const player = new ScoreViewModel();
    player.setPlayer(name, email, handicap);
    this.allPlayers.push(player);
  }

  updateEmailList(email: string, name: string, handicap: number, key: number) {
    this.emailList[key] = { name, email, handicap };
    this.allPlayers[key].setPlayer(name, email, handicap);
  }

  removeEmailFromList(key: number): void {
    const newEmailList = [...this.emailList];
    const newAllPlayers = [...this.allPlayers];
    newEmailList.splice(key, 1);
    newAllPlayers.splice(key, 1);
    this.emailList = newEmailList;
    this.allPlayers = newAllPlayers;
  }

  getEmailList(): Array<Partial<IPlayer>> {
    return this.emailList;
  }

  selectTeeBox(course: GolfCourse, id: string) {
    this.match.course = course.id;
    this.match.courseDisplayName = course.name;
    const teeBoxKey = course.teeBoxes.findIndex((c) => c.id === id);
    if (teeBoxKey >= 0) {
      this.currentTeeBox = course.teeBoxes[teeBoxKey].id;
      this.currentTeeBoxDisplayName = course.teeBoxes[teeBoxKey].color;
      this.match.teeBox = course.teeBoxes[teeBoxKey].id;
      this.match.teeBoxDisplayName = course.teeBoxes[teeBoxKey].color;
      const teeBoxDetail = getCourseDetail(this.currentTeeBox);
      this.currentDistance = teeBoxDetail.distance;
      this.currentHcp = teeBoxDetail.hcp;
      this.currentPar = teeBoxDetail.par;
    }
  }

  closeAllCourses() {
    this.courses.forEach((element) => {
      element.isOpen = false;
    });
  }

  openCloseCourse(id: string) {
    this.closeAllCourses();
    const key = this.courses.findIndex(({ course }) => course.id === id);
    if (key >= 0) {
      this.courses[key].isOpen = !this.courses[key].isOpen;
    }
  }

  async getCourses(): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    try {
      const tempCourses = await getCourses().courses;
      this.courses = tempCourses.map((course) => ({
        isOpen: false,
        course,
      }));
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

  setMatchId(id: string): void {
    this.idMatch = id;
  }

  async createMatch(): Promise<void> {
    console.log("createMatch", toJS(this.matches));
    for (const match of this.matches) {
      await match.createMatch();
    }
  }
}

export default PlayViewModel;
