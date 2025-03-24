import { useQuery } from "@tanstack/react-query";
import { getAllLeagues } from "../services/firebase";
import type { ITournament } from "../models/Tournament";
import type UserViewModel from "../viewModels/UserViewModel";

export const useGetLeagues = (user: UserViewModel) => {
  return useQuery({
    queryKey: ["dashboard"], // Una clave única para tu consulta
    queryFn: async () => {
      const leagues = await getAllLeagues(user.user.id!);
      const actives =
        (leagues.data.activeLeagues as ITournament[]) || ([] as ITournament[]);
      const admin =
        (leagues.data.adminLeagues as ITournament[]) || ([] as ITournament[]);
      const history =
        (leagues.data.historyLeagues as ITournament[]) || ([] as ITournament[]);
      user.setTournaments(actives, history, admin);
      return leagues;
    },
    staleTime: Infinity, // Asegura que los datos en caché nunca se consideren obsoletos en esta configuración.
  });
};
