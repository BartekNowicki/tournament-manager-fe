/* eslint-disable import/no-cycle */
import {
  Player,
  emptyPlayer,
  placeholderPlayer,
} from "../storeContent/storeSlices/playerSlice";
import {
  Team,
  emptyTeam,
  placeholderTeam,
} from "../storeContent/storeSlices/teamSlice";
import {
  Tournament,
  emptyTournament,
  placeholderTournament,
} from "../storeContent/storeSlices/tournamentSlice";
// import { getDateOneDayBefore } from "./dates";

export type Item = Player | Team;

export function isPlayer(someObj: Item): someObj is Player {
  return "firstName" in someObj;
}

export function isTeam(someObj: Item): someObj is Team {
  return "playerOneId" in someObj;
}

export const injectItemPlayerOrTeamKey = (item: Item) => {
  if (isPlayer(item)) {
    return item.id + item.firstName + item.lastName;
  }
  return item.id + item.playerOneId + item.playerTwoId;
};

export const injectItemTournamentKey = (tournament: Tournament) => {
  return tournament.id + tournament.type;
};

export const highlighted = () => "border-solid border-2 border-sky-500";

// these functions are only to communicate the date from the date picker to component state and back,
// not with redux and db - redux and db date conversion takes place in the tournamentSlice
export const serializeDate = (date: Date): string => date.toLocaleDateString();

// export const deserializeDate = (dateString: string): Date => {
// if (!dateString || !dateString.length) return new Date();
// console.log("DATESTRING BEFORE: ", dateString, dateString.split("."));
// const dateArr: string[] = dateString.split(".");

// const dateStringDeserializedToDateObject: Date = new Date("2022-5-19 GMT");
// const year = parseInt(dateArr[2], 10);
// const month = parseInt(dateArr[1], 10);
// const day = parseInt(dateArr[0], 10);
// const dateStringDeserializedToDateObject: Date = new Date(`${year}-${month}-${day} GMT`);
// console.log(dateString);
// console.log(year, month, day);
// console.log("DATESTRING AFTER: ", dateStringDeserializedToDateObject);
// console.log(new Date(dateString));

// return new Date();
// return dateStringDeserializedToDateObject;
// };

export const findPlayerById = (players: Player[], id: number) => {
  if (id === -2) return placeholderPlayer;
  return Array.isArray(players)
    ? players.find((player) => player.id === id) || emptyPlayer
    : emptyPlayer;
};

export const findTeamById = (teams: Team[], id: number) => {
  if (id === -2) return placeholderTeam;
  return Array.isArray(teams)
    ? teams.find((team) => team.id === id) || emptyTeam
    : emptyTeam;
};

export const findTournamentById = (
  tournaments: Tournament[],
  id: number
): Tournament => {
  if (id === -2) {
    return placeholderTournament;
  }
  if (Array.isArray(tournaments)) {
    return (
      tournaments.find((tournament) => tournament.id === id) || emptyTournament
    );
  }
  return emptyTournament;

  // let foundTournament: Tournament = emptyTournament;

  // if (id === -2) foundTournament = placeholderTournament;

  // if (id !== -2)
  //   foundTournament = Array.isArray(tournaments)
  //     ? tournaments.find((tournament) => tournament.id === id) ||
  //       emptyTournament
  //     : emptyTournament;

  // return {
  //   ...foundTournament,
  //   type: foundTournament.type,
  //   startDate: serializeDate(
  //     getDateOneDayBefore(new Date(`${foundTournament.startDate}`))
  //   ),
  //   endDate: serializeDate(
  //     getDateOneDayBefore(new Date(`${foundTournament.endDate}`))
  //   ),
  // };

  // return {
  //   ...foundTournament,
  //   type: foundTournament.type,
  //   // startDate: serializeDate(new Date(`${foundTournament.startDate}`)),
  //   // endDate: serializeDate(new Date(`${foundTournament.endDate}`)),
  //   startDate: foundTournament.startDate,
  //   endDate: foundTournament.endDate,
  // };
};
