import { ITournament } from "../types/DashboardLeagues";
import { Score } from "../types/Match";

/**
 * Genera HTML con el listado de jugadores y sus equipos
 * Solo para tournamentType: "teamplay", "leagueteamplay" o "derby"
 */
export const getPlayersTeamListHTML = (
  players: Score[],
  tournament: ITournament
): string => {
  const tournamentType = tournament.tournamentType;

  // Solo generar el listado para teamplay, leagueteamplay o derby
  if (
    tournamentType !== "teamplay" &&
    tournamentType !== "leagueteamplay" &&
    tournamentType !== "derby"
  ) {
    return "";
  }

  // Para Derby: solo mostrar lista de jugadores sin equipos
  if (tournamentType === "derby") {
    const playerRows = players
      .map((player) => {
        const playerName = player.player;
        return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${playerName}</td>
      </tr>
    `;
      })
      .join("");

    return `
    <div style="margin-top: 30px; margin-bottom: 30px;">
      <h3 style="margin-bottom: 10px; font-family: Arial, sans-serif;">Players</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Player</th>
          </tr>
        </thead>
        <tbody>
          ${playerRows}
        </tbody>
      </table>
    </div>
  `;
  }

  // Para TeamPlay/LeagueTeamPlay: mostrar jugadores con equipos
  // Crear un mapa de email -> team para búsqueda rápida
  const playerTeamMap = new Map<string, string>();
  tournament.playersList.forEach((player) => {
    if (player.email && player.team) {
      playerTeamMap.set(player.email, player.team);
    }
  });

  // Buscar el nombre del equipo en teams primero, luego en teamsList
  const getTeamDisplayName = (teamId: string): string => {
    if (!teamId) {
      return "Sin equipo";
    }

    // Intentar buscar primero en teams[] (IGroup[])
    const teamFromTeams = tournament.teams?.find((team) => team.id === teamId);
    if (teamFromTeams?.name) {
      return teamFromTeams.name;
    }

    // Si no está en teams[], buscar en teamsList[]
    const teamFromTeamsList = tournament.teamsList?.find(
      (team) => team.id === teamId
    );
    if (teamFromTeamsList?.name) {
      return teamFromTeamsList.name;
    }

    return teamId;
  };

  // Construir las filas del listado
  const playerRows = players
    .map((player) => {
      const playerEmail = player.idPlayer;
      const playerName = player.player;
      const teamId = playerTeamMap.get(playerEmail) || "";
      const teamName = getTeamDisplayName(teamId);

      return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${playerName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;">${teamName}</td>
      </tr>
    `;
    })
    .join("");

  // Construir la tabla completa
  return `
    <div style="margin-top: 30px; margin-bottom: 30px;">
      <h3 style="margin-bottom: 10px; font-family: Arial, sans-serif;">Player/Team</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Player</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Team</th>
          </tr>
        </thead>
        <tbody>
          ${playerRows}
        </tbody>
      </table>
    </div>
  `;
};
