import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/firebase";

export const useGetStandings = (tournamentId: string) => {
  return useQuery({
    queryKey: ["standings", { tournamentId }],
    queryFn: async () => {
      const standings = await getStandings(tournamentId!);

      return standings;
    },
    staleTime: Infinity,
  });
};
