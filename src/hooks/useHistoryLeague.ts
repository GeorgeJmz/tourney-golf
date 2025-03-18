import React, { useEffect, useState } from "react";
import { ITournament } from "../models/Tournament";
import { getYearDayJS } from "../helpers/convertDate";

export interface IhistoryLeague {
  champion: string;
  year: number;
  name: string;
  id?: string;
  isTeamplay?: boolean;
}
export interface IIdLeague {
  [key: string]: IhistoryLeague[];
}

export const useHistoryLeague = (
  leagueAdminItems: ITournament[],
  leagueHistoryItems: ITournament[]
) => {
  const leagueHistoryMulligans = [
    {
      champion: "Juan Kim",
      year: 2016,
      name: "Mulligans",
    },
    {
      champion: "Juan Morales",
      year: 2017,
      name: "Mulligans",
    },
    {
      champion: "Sonny Covarrubias",
      year: 2018,
      name: "Mulligans",
    },
    {
      champion: "Jose Luis Gil",
      year: 2019,
      name: "Mulligans",
    },
    {
      champion: "Carlos Mattei",
      year: 2021,
      name: "Mulligans",
    },
    {
      champion: "Juan Morales",
      year: 2022,
      name: "Mulligans",
    },
    {
      champion: "Adrian Lara",
      year: 2023,
      name: "Mulligans",
    },
  ] as IhistoryLeague[];
  const leagueHistoryGorillas = [
    {
      champion: "Jorge Jimenez",
      year: 2003,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2004,
      name: "Gorilas",
    },
    {
      champion: "Jose Carlos Perez",
      year: 2005,
      name: "Gorilas",
    },
    {
      champion: "Julio Rodriguez",
      year: 2006,
      name: "Gorilas",
    },
    {
      champion: "Oscar Foglio",
      year: 2007,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2008,
      name: "Gorilas",
    },
    {
      champion: "Gabriel Garcia de Leon",
      year: 2009,
      name: "Gorilas",
    },
    {
      champion: "Luis Togno",
      year: 2010,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2011,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo",
      year: 2012,
      name: "Gorilas",
    },
    {
      champion: "Andres Lujan",
      year: 2013,
      name: "Gorilas",
    },
    {
      champion: "Felipe Acosta",
      year: 2014,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo ",
      year: 2015,
      name: "Gorilas",
    },
    {
      champion: "Alejandro Valenzuela ",
      year: 2016,
      name: "Gorilas",
    },
    {
      champion: "Juan Pablo Alcocer",
      year: 2017,
      name: "Gorilas",
    },
    {
      champion: "Philippe Caymaris",
      year: 2018,
      name: "Gorilas",
    },
    {
      champion: "Damian Salazar",
      year: 2019,
      name: "Gorilas",
    },
    {
      champion: "Jose Lopez ",
      year: 2020,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo",
      year: 2021,
      name: "Gorilas",
    },
    {
      champion: "Humberto Martinez ",
      year: 2022,
      name: "Gorilas",
    },
    {
      champion: "Alejandro Valenzuela Sr",
      year: 2023,
      name: "Gorilas",
    },
  ] as IhistoryLeague[];
  const [historyLeague, setHistoryLeague] = useState([] as IhistoryLeague[]);
  useEffect(() => {
    const mapLeagues = {
      Al3hhHdhgzDNvATsrsT1: leagueHistoryGorillas.reverse(),
      rt7KCe7b8ZKLCjiux6nn: leagueHistoryMulligans.reverse(),
    } as IIdLeague;

    let empty: IhistoryLeague[] = [];
    const gorMull = [...leagueAdminItems, ...leagueHistoryItems];
    gorMull.forEach((active) => {
      if (mapLeagues[active.id || ""]) {
        empty = [...empty, ...mapLeagues[active.id || ""]];
      }
    });

    empty = [
      ...leagueHistoryItems.map((tournament) => {
        return {
          champion: tournament.champion || "",
          year: tournament.startDate ? getYearDayJS(tournament.startDate) : 0,
          name: tournament.name,
          id: tournament.id,
          isTeamplay: tournament.tournamentType === "teamplay",
        } as IhistoryLeague;
      }),
      ...empty,
    ];
    setHistoryLeague(empty);
  }, [leagueAdminItems]);
  return { historyLeague };
};
