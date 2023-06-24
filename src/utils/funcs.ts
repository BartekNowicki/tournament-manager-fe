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

// eslint-disable-next-line no-console, prefer-destructuring
export const log = console.log;

export type Item = Player | Team | Tournament;

export function isPlayer(someObj: Item): someObj is Player {
  return "firstName" in someObj;
}

export function isTeam(someObj: Item): someObj is Team {
  return "playerOneId" in someObj;
}

export function isTournament(someObj: Item): someObj is Tournament {
  return "startDate" in someObj;
}

export const injectItemKey = (item: Item): string => {
  if (isPlayer(item)) {
    return String(item.id + item.firstName + item.lastName);
  }
  if (isTeam(item)) {
    return String(item.id + item.playerOneId + item.playerTwoId);
  }
  if (isTournament(item)) {
    return item.id + item.type;
  }
  console.warn("something went wrong with key assignment");
  return new Date().getTime().toString();
};

export const highlighted = () => "border-solid border-2 border-sky-500";

export const serializeDate = (date: Date): string => date.toLocaleDateString();

export const findById = (items: Item[], id: number): Item => {
  if (id === -2 && isPlayer(items[0])) return placeholderPlayer;
  if (id === -2 && isTeam(items[0])) return placeholderTeam;
  if (id === -2 && isTournament(items[0])) return placeholderTournament;

  if (Array.isArray(items) && isPlayer(items[0])) {
    return items.find((i) => i.id === id) || emptyPlayer;
  }
  if (Array.isArray(items) && isTeam(items[0])) {
    return items.find((i) => i.id === id) || emptyTeam;
  }
  if (Array.isArray(items) && isTournament(items[0])) {
    return items.find((i) => i.id === id) || emptyTournament;
  }
  console.warn("somethingwent wrong with item type selection");
  return emptyPlayer;
};

export const findPlayerById = (players: Player[], id: number) => {
  return findById(players, id);
};

export const findTeamById = (teams: Team[], id: number) => {
  return findById(teams, id);
};

export const findTournamentById = (tournaments: Tournament[], id: number) => {
  return findById(tournaments, id);
};

// export const findPlayerById = (players: Player[], id: number) => {
//   if (id === -2) return placeholderPlayer;
//   return Array.isArray(players)
//     ? players.find((player) => player.id === id) || emptyPlayer
//     : emptyPlayer;
// };

// export const findTeamById = (teams: Team[], id: number) => {
//   if (id === -2) return placeholderTeam;
//   return Array.isArray(teams)
//     ? teams.find((team) => team.id === id) || emptyTeam
//     : emptyTeam;
// };

// export const findTournamentById = (
//   tournaments: Tournament[],
//   id: number
// ): Tournament => {
//   if (id === -2) {
//     return placeholderTournament;
//   }
//   if (Array.isArray(tournaments)) {
//     return (
//       tournaments.find((tournament) => tournament.id === id) || emptyTournament
//     );
//   }
//   return emptyTournament;
// };
