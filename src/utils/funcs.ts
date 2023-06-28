/* eslint-disable import/no-cycle */
import { TournamentType } from "../components/Tournament";
import { Tournaments } from "../pages/Tournaments";
import { Group } from "../storeContent/storeSlices/groupSlice";
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

function getGlobalCounterClosure() {
  let counter = 0;
  function getCounter() {
    counter += 1;
    return counter;
  }
  return getCounter;
}

const getCurrentGlobalCounter = getGlobalCounterClosure();

export const injectItemKey = (item: Item): string => {
  if (item.id === 999) return String(getCurrentGlobalCounter());
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

export const findById = (items: Item[], id: number, type?: string): Item => {
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
    return items.find((i) => i.id === id && i.type === type) || emptyTournament;
  }
  console.warn("something is fishy wrong with item type selection");
  return emptyPlayer;
};

export const findPlayerById = (players: Player[], id: number) => {
  return findById(players, id);
};

export const findTeamById = (teams: Team[], id: number) => {
  return findById(teams, id);
};

export const findTournamentById = (
  tournaments: Tournament[],
  id: number,
  type: string
) => {
  return findById(tournaments, id, type);
};

export const countParticipants = (
  tournaments: Tournament[],
  tournamentId: number,
  tournamentType: string
): number => {
  return tournamentType === TournamentType.SINGLES
    ? findById(
        tournaments,
        tournamentId,
        tournamentType
      ).participatingPlayers.filter((id) => id !== -1).length
    : findById(
        tournaments,
        tournamentId,
        tournamentType
      ).participatingTeams.filter((id) => id !== -1).length * 2;
};

export const getSortedPlayerGroups = (
  tournaments: Tournament[],
  id: number,
  isSingles: boolean,
  allGroups: Group[],
  allPlayers: Player[]
): Array<Player> => {
  const type: string = isSingles
    ? TournamentType.SINGLES
    : TournamentType.DOUBLES;
  const tournament = findById(tournaments, id, type);
  const playersSorted: Player[] = [];
  const undersizedGroupToGoLast: Player[] = [];
  if (
    (Array.isArray(tournaments) &&
      Array.isArray(tournament.groups) &&
      isTournament(tournaments[0]) &&
      tournament.groups &&
      tournament.groups.length === 0) ||
    !tournament ||
    !tournament.groups
  ) {
    log("cannot provide sorted players, are there any?");
    return [];
  }

  let groupNumber = 1;

  tournament.groups.forEach((gId) => {
    const markedEmptyPlayer = { ...emptyPlayer };
    markedEmptyPlayer.firstName = String(groupNumber);
    groupNumber += 1;
    playersSorted.push(markedEmptyPlayer); // group display separator, item.id = 999
    const nextGroup: Group = Array.from(allGroups).find(
      (group) => group.id === gId
    );
    if (nextGroup && nextGroup.members.length > 0)
      nextGroup.members.forEach((mId) => {
        const member: Player = findById(allPlayers, mId);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nextGroup.members.length === tournament.groupSize
          ? playersSorted.push(member)
          : undersizedGroupToGoLast.push(member);
      });
  });
  return [...playersSorted, ...undersizedGroupToGoLast];
};
