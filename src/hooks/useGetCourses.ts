import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../services/firebase";
import type UserViewModel from "../viewModels/UserViewModel";

export const useGetCourses = (user: UserViewModel) => {
  return useQuery({
    queryKey: ["courses"], // Una clave única para tu consulta
    queryFn: async () => {
      const courses = await getCourses(user.user.id!);
      //   const actives =
      //     (leagues.data.activeLeagues as ITournament[]) || ([] as ITournament[]);
      //   const admin =
      //     (leagues.data.adminLeagues as ITournament[]) || ([] as ITournament[]);
      //   const history =
      //     (leagues.data.historyLeagues as ITournament[]) || ([] as ITournament[]);
      //   user.setTournaments(actives, history, admin);
      return courses;
    },
    staleTime: Infinity, // Asegura que los datos en caché nunca se consideren obsoletos en esta configuración.
  });
};
