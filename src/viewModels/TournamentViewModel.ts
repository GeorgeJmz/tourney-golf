import { action, makeObservable, observable, toJS } from "mobx";
import {
  createTournament,
  updateTournament,
  assignActiveTourneyByEmail,
  getPlayersByTournamentId,
  getScoresByID,
  getMatchesByTournamentId,
  getNamesByEmails,
  updatePlayerAllFields,
  deleteActiveTourneyById,
  sendCustomEmail,
  deleteMatch,
  deleteScore,
  updatePlayerListByTournamentId,
  updateScore,
  updateMatch,
  assignNewActiveTourneyByEmail,
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
import PlayerModel, { ITournamentPlayer } from "../models/Player";
import { IMatch } from "../models/Match";

class TournamentViewModel {
  tournament: TournamentModel = new TournamentModel();
  author = "";
  idTournament = "";
  statsPlayers: Array<{
    id: number;
    position: number;
    tourneyName: string;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    matchPoints: number;
    medalPoints: number;
    totalPoints: number;
    grossAverage: string;
    handicapAverage: string;
    netAverage: string;
    teamPoints: number;
    conference: string;
    group: string;
  }> = [];
  statsTeams: Array<{
    name: string;
    playersNames: string;
    roundsPlayed: number;
    points: number;
  }> = [];
  conferencesOptions: Array<{ value: string; label: string }> = [];
  groupsOptions: Array<{ value: string; label: string }> = [];
  leagueResults: Array<IMatch> = [];
  playersResultsOptions: Array<{ label: string; value: string }> = [];

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
      getStatsPlayersByTournament: action,
      startTournament: action,
      statsPlayers: observable,
      statsTeams: observable,
      conferencesOptions: observable,
      groupsOptions: observable,
      getAllMatchesResultsByTournament: action,
      leagueResults: observable,
      playersResultsOptions: observable,
      updatePlayersAndMatches: action,
      deleteLeague: action,
      deleteMatch: action,
      switchPlayer: action,
    });
    this.statsPlayers = [];
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
      playoffs: this.tournament.playOffs,
      startDate: this.tournament.startDate,
      cutOffDate: this.tournament.cutOffDate,
      matchesPerRound: toJS(this.tournament.matchesPerRound),
      pointsPerTie: this.tournament.pointsPerTie || 1,
      pointsPerWin: this.tournament.pointsPerWin || 3,
      pointsPerTieMedal: this.tournament.pointsPerTieMedal || 1,
      pointsPerWinMedal: this.tournament.pointsPerWinMedal || 3,
      numberOfRounds: this.tournament.numberOfRounds || 1,
      roundDates: toJS(this.tournament.roundDates) || [],
      championshipRound: this.tournament.championshipRound || false,
      championshipDate: this.tournament.champoinshipDate,
      minRounds: this.tournament.minRounds || 1,
    };
  }

  getTournamentName(): string {
    return this.tournament.name;
  }

  saveEmailList(): void {
    this.updateTournament(toJS(this.tournament));
  }
  addEmailToList(email: string, name: string): void {
    this.tournament.playersList.push({
      name,
      email: email.toLowerCase(),
      id: email,
    });
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
      email: email.toLowerCase(),
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
        const conference = this.tournament.groupsList.find(
          (gr) => gr.id === group
        );
        if (conference) {
          player.conference = conference.conference;
        }
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

      assignActiveTourneyByEmail(
        player.email || "",
        this.idTournament,
        this.tournament.name,
        toJS(nPlayer)
      );
    });
    //this.updateTournament(toJS(this.tournament));
  }

  async getAllMatchesResultsByTournament(): Promise<void> {
    const players = (await getPlayersByTournamentId(this.idTournament)) || [];
    if (players.length === 0) {
      return;
    }
    const emails = players.map((player) => player.email);
    const names = await getNamesByEmails(emails);
    const listEmails = names?.reduce((acc, curr) => {
      acc[curr.email] = curr.name + " " + curr.lastName;
      return acc;
    }, {} as { [key: string]: string });
    this.playersResultsOptions = players
      .map((player) => ({
        label: listEmails ? listEmails[player.email] : player.name,
        value: player.email,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    const matches = await getMatchesByTournamentId(this.idTournament);
    const getPointsPerMatch = (idPlayer: string, idOpponent: string) => {
      const player = players.find((p) => p.email === idPlayer);
      const opponentIndex =
        player?.opponent.findIndex((id) => id === idOpponent) || 0;
      const matchPoints = player?.pointsMatch[opponentIndex] || 0;
      const medalPoints = player?.pointsStroke[opponentIndex] || 0;
      const teamPoints = player?.pointsTeam[opponentIndex] || 0;
      return { matchPoints, medalPoints, teamPoints };
    };
    this.leagueResults = matches.map((match) => ({
      ...match,
      matchResults: match.matchResults.map((result) => ({
        ...result,
        ...getPointsPerMatch(
          result.idPlayer,
          match.matchResults.find((r) => r.idPlayer !== result.idPlayer)
            ?.idPlayer || ""
        ),
        playerName: listEmails
          ? listEmails[result.idPlayer]
          : result.playerName,
      })),
    }));
  }

  async deleteMatch(matchId: string): Promise<void> {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    const match = this.leagueResults.find((m) => m.id === matchId);
    const tournamentId = match?.tournamentId || "";
    const scoreId1 = match?.scoresId[0] || "";
    const scoreId2 = match?.scoresId[1] || "";
    const players = (await getPlayersByTournamentId(tournamentId)) || [];
    const p1 = match?.matchResults[0].idPlayer || "";
    const p2 = match?.matchResults[1].idPlayer || "";
    const player1 = players.find((p) => p.email === p1);
    const player2 = players.find((p) => p.email === p2);
    const index1 = player1?.scoreId.findIndex((o) => o === scoreId1) || 0;
    const index2 = player2?.scoreId.findIndex((o) => o === scoreId2) || 0;
    if (!player1 || !player2) {
      return;
    }
    const newPlayer1 = { ...player1 };
    const newPlayer2 = { ...player2 };
    newPlayer1.opponent = player1?.opponent.filter((o, i) => i !== index1);
    newPlayer2.opponent = player2?.opponent.filter((o, i) => i !== index2);
    newPlayer1.pointsMatch = player1?.pointsMatch?.filter(
      (o, i) => i !== index1
    );
    newPlayer2.pointsMatch = player2?.pointsMatch?.filter(
      (o, i) => i !== index2
    );
    newPlayer1.pointsStroke = player1?.pointsStroke?.filter(
      (o, i) => i !== index1
    );
    newPlayer2.pointsStroke = player2?.pointsStroke?.filter(
      (o, i) => i !== index2
    );
    newPlayer1.pointsTeam = player1?.pointsTeam?.filter((o, i) => i !== index1);
    newPlayer2.pointsTeam = player2?.pointsTeam?.filter((o, i) => i !== index2);
    newPlayer1.gross = player1?.gross?.filter((o, i) => i !== index1);
    newPlayer2.gross = player2?.gross?.filter((o, i) => i !== index2);
    newPlayer1.handicap = player1?.handicap?.filter((o, i) => i !== index1);
    newPlayer2.handicap = player2?.handicap?.filter((o, i) => i !== index2);
    newPlayer1.net = player1?.net?.filter((o, i) => i !== index1);
    newPlayer2.net = player2?.net?.filter((o, i) => i !== index2);
    newPlayer1.scoreId = player1?.scoreId?.filter((o, i) => i !== index1);
    newPlayer2.scoreId = player2?.scoreId?.filter((o, i) => i !== index2);
    newPlayer1.id = player1?.id || "";
    newPlayer2.id = player2?.id || "";

    await updatePlayerAllFields(newPlayer1);
    await updatePlayerAllFields(newPlayer2);
    await deleteScore(scoreId1);
    await deleteScore(scoreId2);
    await deleteMatch(matchId);

    const displayMessage = getMessages(Messages.MATCH_DELETED);
    toast.update(cuToast, {
      render: displayMessage,
      type: toast.TYPE.SUCCESS,
      isLoading: false,
      autoClose: 800,
    });
  }

  async switchPlayer(prevId: string, newId: string, newName: string) {
    const players = (await getPlayersByTournamentId(this.idTournament)) || [];
    const player = players.find((p) => p.email === prevId);
    if (!player) {
      return;
    }
    const tournamentId = this.tournament.id || "";
    const newPlayer = {
      ...player,
      email: newId,
      name: newName,
      prevEmail: prevId,
    };

    console.log(toJS(player), toJS(newPlayer), "player");
    await updatePlayerAllFields(newPlayer);
    if (prevId !== newId) {
      await assignNewActiveTourneyByEmail(
        newPlayer.email || "",
        player.email || "",
        tournamentId,
        this.tournament.name,
        toJS(newPlayer)
      );
    }

    const newPlayers = this.tournament.playersList.map((p) => {
      if (p.email === prevId) {
        return { ...p, email: newId, name: newName, id: newId };
      }
      return toJS(p);
    });

    await updatePlayerListByTournamentId(tournamentId || "", newPlayers);

    for (const opponent of newPlayer.opponent) {
      const player = players.find((p) => p.email === opponent);
      if (player) {
        const newPlayer = {
          ...player,
          opponent: player?.opponent.map((o) => (o === prevId ? newId : o)),
        };
        await updatePlayerAllFields(newPlayer);
        await getMatchesByTournamentId(tournamentId).then(async (matches) => {
          for (const match of matches) {
            let updated = false;
            const newMatch = {
              ...match,
              matchResults: match.matchResults.map((m) => {
                if (m.idPlayer === prevId) {
                  updated = true;
                  return { ...m, idPlayer: newId, playerName: newName };
                }
                return m;
              }),
            };
            if (updated) {
              await updateMatch(match.id || "", newMatch);
            }
          }
        });
      }
    }

    for (const scoreId of newPlayer.scoreId) {
      const score = await getScoresByID(scoreId);
      if (score) {
        const newScore = {
          ...score,
          idPlayer: score.idPlayer === prevId ? newId : score.idPlayer,
          player: score.idPlayer === prevId ? newName : score.player,
        };
        await updateScore(scoreId, newScore);
      }
    }
  }

  async updatePlayersAndMatches(changes: {
    [key: string]: { [key: string]: string };
  }): Promise<void> {
    const players = (await getPlayersByTournamentId(this.idTournament)) || [];

    const newPlayers: { [key: string]: ITournamentPlayer } = {};
    const matches = [];
    for (const i in changes) {
      const m = i.split("-");
      const p1 = m[0];
      const p2 = m[1];
      if (!newPlayers[p1]) {
        newPlayers[p1] = players.filter((e) => e.email === p1)[0];
      }
      if (!newPlayers[p2]) {
        newPlayers[p2] = players.filter((e) => e.email === p2)[0];
      }
      matches.push(i.split("-"));
      const index1 = newPlayers[p1].opponent.findIndex((o) => o === p2);
      const index2 = newPlayers[p2].opponent.findIndex((o) => o === p1);
      newPlayers[p1].pointsMatch[index1] = parseInt(changes[i].matchpoints1);
      newPlayers[p2].pointsMatch[index2] = parseInt(changes[i].matchpoints2);
      newPlayers[p1].pointsStroke[index1] = parseInt(changes[i].medalPoints1);
      newPlayers[p2].pointsStroke[index2] = parseInt(changes[i].medalPoints2);
      newPlayers[p1].pointsTeam[index1] = parseInt(changes[i].teampoints1);
      newPlayers[p2].pointsTeam[index2] = parseInt(changes[i].teampoints2);
    }

    for (const np in newPlayers) {
      await updatePlayerAllFields(newPlayers[np]);
    }
  }

  async getStatsPlayersByTournament(): Promise<void> {
    const t1 = performance.now();

    const tournamentType = this.tournament.tournamentType;

    const playType = this.tournament.playType;
    const pointsPerTie = this.tournament.pointsPerTie;
    const pointsPerWin = this.tournament.pointsPerWin;
    const pointsPerTieMedal = this.tournament.pointsPerTieMedal;
    const pointsPerWinMedal = this.tournament.pointsPerWinMedal;

    const isLTMATCH =
      tournamentType === "leagueteamplay" && playType === "matchPlay";
    const isLTMEDAL =
      tournamentType === "leagueteamplay" && playType === "strokePlay";
    const isLMATCH = tournamentType === "league" && playType === "matchPlay";
    const isLMEDAL = tournamentType === "league" && playType === "strokePlay";

    // Fetch players and optimize data fetching
    const fullPlayers = await getPlayersByTournamentId(this.idTournament);
    const emails = fullPlayers.map((player) => player.email);

    // Use a more efficient approach for large datasets:
    const names = (await getNamesByEmails(emails)) || []; // Optimized name fetching
    const nameMap = new Map(
      names.map((player) => [player.email, player.name + " " + player.lastName])
    );

    const players = fullPlayers.map((player) => ({
      ...player,
      name: nameMap.get(player.email) || player.name,
    }));

    // Fetch scores in batches for improved performance
    const newPlayers = await Promise.all(
      players.map(async (player) => {
        const getAverage = (values: Array<number>) => {
          const average = values.reduce((acc, curr) => acc + curr, 0);
          return average > 0 ? (average / values.length).toFixed(1) : "0";
        };

        const getWins = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerWin ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerWinMedal ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerWin ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerWinMedal ? acc + 1 : acc),
              0
            )
          );
        };

        const getDraws = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerTie ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerTieMedal ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerTie ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerTieMedal ? acc + 1 : acc),
              0
            )
          );
        };

        const getLoss = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            )
          );
        };

        const getTotalPoints = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce((acc, curr) => acc + curr, 0);
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce((acc, curr) => acc + curr, 0);
          }
          return (
            player.pointsMatch.reduce((acc, curr) => acc + curr, 0) +
            player.pointsStroke.reduce((acc, curr) => acc + curr, 0)
          );
        };

        return {
          id: Number(player.id),
          position: 0, // Add position property
          tourneyName: player.name, // Add tourneyName property
          matchesPlayed:
            playType !== "matchstrokePlay"
              ? player.opponent.length
              : player.opponent.length * 2,
          wins: getWins(),
          draws: getDraws(),
          losses: getLoss(),
          matchPoints: player.pointsMatch.reduce((acc, curr) => acc + curr, 0),
          medalPoints: player.pointsStroke.reduce((acc, curr) => acc + curr, 0),
          totalPoints: getTotalPoints(),
          grossAverage: getAverage(
            player.gross.map((value) => parseInt(value.toString()))
          ),
          handicapAverage: getAverage(
            player.handicap.map((value) => parseInt(value.toString()))
          ),
          netAverage: getAverage(
            player.net.map((value) => parseInt(value.toString()))
          ),
          teamPoints: player.pointsTeam.reduce((acc, curr) => acc + curr, 0),
          conference: player.conference,
          group: player.group,
        };
      })
    );

    // Sort players by total points
    this.statsPlayers = newPlayers.sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    // ... rest of the function logic (with potential optimizations for data structure usage and caching)
    if (players) {
      const teams: { [key: string]: Array<ITournamentPlayer> } =
        players?.reduce((acc, curr) => {
          const team = curr.team;
          if (!acc[team]) {
            acc[team] = [];
          }
          acc[team].push(curr);
          return acc;
        }, {} as { [key: string]: Array<ITournamentPlayer> });

      const finalTeams = [];
      for (const team in teams) {
        const teamName =
          this.tournament.teamsList.find((t) => t.id === team)?.name || "";
        const roundsPlayed = teams[team].reduce(
          (acc, curr) => acc + curr.pointsTeam.length,
          0
        );
        const points = teams[team].reduce(
          (acc, curr) =>
            acc + curr.pointsTeam.reduce((acc, curr) => acc + curr, 0),
          0
        );
        const newTeam = {
          name: teamName,
          playersNames: teams[team].map((player) => player.name).join(", "),
          roundsPlayed,
          points,
        };
        finalTeams.push(newTeam);
      }
      this.statsTeams = finalTeams.sort((a, b) => b.points - a.points);
      this.conferencesOptions = this.tournament.conferencesList.map(
        (conference) => ({
          value: conference.id,
          label: conference.name,
        })
      );
      this.groupsOptions = this.tournament.groupsList.map((group) => ({
        value: group.id,
        label: group.name,
      }));
    }
    const t2 = performance.now();
    console.log("Call to NEW took" + (t2 - t1) + "milliseconds.");
  }

  async sendEmail(): Promise<void> {
    sendCustomEmail(
      "jeckox@gmail.com",
      "Envio Firebase George",
      "Hola Envio Correo"
    );
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

  async deleteLeague(): Promise<void> {
    await deleteActiveTourneyById(this.idTournament);
    location.reload();
  }
}

export default TournamentViewModel;
