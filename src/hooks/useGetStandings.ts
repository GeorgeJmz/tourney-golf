import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/firebase";
import type TournamentViewModel from "../viewModels/TournamentViewModel";

export const useGetStandings = (
  tournamentId: string,
  tournamentViewModel: TournamentViewModel
) => {
  return useQuery({
    queryKey: ["standings", { tournamentId }],
    queryFn: async () => {
      const standings = await getStandings(tournamentId!);
      tournamentViewModel.setStandingsBytTournament(standings.data.standings);
      return standings;
    },
    staleTime: Infinity,
  });
};
