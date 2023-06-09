/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
import { TournamentType } from "../components/Tournament";
// import { Tournaments } from "../pages/Tournaments";
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
  return someObj ? "firstName" in someObj : false;
}

export function isTeam(someObj: Item): someObj is Team {
  return someObj ? "playerOneId" in someObj : false;
}

export function isTournament(someObj: Item): someObj is Tournament {
  return someObj ? "type" in someObj : false;
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
  console.warn("something went wrong with the key assignment");
  return new Date().getTime().toString();
};

export const highlighted = () => "border-solid border-2 border-sky-500";

export const serializeDate = (date: Date): string => date.toLocaleDateString();

export const findById = (items: Item[], id: number, type?: string) => {
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
    return (
      items.find((i) => isTournament(i) && i.id === id && i.type === type) ||
      emptyTournament
    );
  }
  console.warn("something is fishy with item type selection");
  return isPlayer(items[0])
    ? emptyPlayer
    : isTeam(items[0])
    ? emptyTeam
    : isTournament(items[0])
    ? emptyTournament
    : emptyPlayer;
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

export const count = (
  items: string,
  tournaments: Tournament[],
  tournamentId: number,
  tournamentType: string
): number => {
  const foundTournament = findById(tournaments, tournamentId, tournamentType);
  if (
    items === "players" &&
    isTournament(foundTournament) &&
    foundTournament.participatingPlayers
  ) {
    return foundTournament.participatingPlayers.filter((id) => id !== -1)
      .length;
  }
  if (
    items === "teams" &&
    isTournament(foundTournament) &&
    foundTournament.participatingTeams
  ) {
    return foundTournament.participatingTeams.filter((id) => id !== -1).length;
  }
  if (
    items === "groups" &&
    isTournament(foundTournament) &&
    foundTournament.groups
  ) {
    return foundTournament.groups.length;
  }
  return -1;
};

const isValid = (itemArr: (Player | Team)[], size: number): boolean => {
  const isBelowGroupSize = (value: string) => String(value).length <= size;
  const distribution = itemArr
    .map((p) => (p.id !== 999 ? "0" : "1"))
    .join("")
    .split("1")
    .filter((i) => i !== "");
  if (!distribution.every(isBelowGroupSize)) {
    console.warn("invalid player grouping, trying again...");
  }
  return distribution.every(isBelowGroupSize);
};

export const getSortedPlayerOrTeamGroups = (
  tournaments: Tournament[],
  id: number,
  isParticipantsSingles: boolean,
  allGroups: Group[],
  allPlayers: Player[],
  allTeams: Team[]
): Array<Player | Team> => {
  const type: string = isParticipantsSingles
    ? TournamentType.SINGLES
    : TournamentType.DOUBLES;

  const tournament = findById(tournaments, id, type);
  const itemsSorted: (Player | Team)[] = [];
  const undersizedGroupToGoLast: (Player | Team)[] = [];
  if (
    (Array.isArray(tournaments) &&
      isTournament(tournament) &&
      tournament.groups &&
      Array.isArray(tournament.groups) &&
      isTournament(tournaments[0]) &&
      tournament.groups.length === 0) ||
    !tournament
  ) {
    return [];
  }
  let groupNumber = 1;
  const iterableGroups =
    isTournament(tournament) && tournament.groups
      ? Array.from(tournament.groups)
      : [];
  // the highest-id group is the only one that can be undersized
  const iterableGroupsSortedByNumberOfMembers = iterableGroups.sort(
    (a, b) => a - b
  );
  const iterableAllGroups = Array.from(allGroups);

  iterableGroupsSortedByNumberOfMembers.forEach((gId) => {
    const markedEmptyPlayer = { ...emptyPlayer };
    const markedEmptyTeam = { ...emptyTeam };
    // using the comment field for numbering groups
    markedEmptyPlayer.comment = String(groupNumber);
    markedEmptyTeam.comment = String(groupNumber);
    groupNumber += 1;
    if (isParticipantsSingles) {
      itemsSorted.push(markedEmptyPlayer); // group display separator, item.id = 999
    }
    if (!isParticipantsSingles) {
      itemsSorted.push(markedEmptyTeam); // group display separator, item.id = 999
    }
    const nextGroup = iterableAllGroups.find((group) => group.id === gId);
    if (isParticipantsSingles && nextGroup && nextGroup.members.length > 0) {
      nextGroup.members.forEach((mId) => {
        const member = findById(allPlayers, mId);
        if (isPlayer(member) && isTournament(tournament)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          nextGroup.members.length === tournament.groupSize
            ? itemsSorted.push(member)
            : undersizedGroupToGoLast.push(member);
        }
      });
    }
    if (!isParticipantsSingles && nextGroup && nextGroup.members.length > 0) {
      nextGroup.members.forEach((mId) => {
        const member = findById(allTeams, mId);
        if (isTeam(member) && isTournament(tournament)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          nextGroup.members.length === tournament.groupSize
            ? itemsSorted.push(member)
            : undersizedGroupToGoLast.push(member);
        }
      });
    }
  });
  const result = [...itemsSorted, ...undersizedGroupToGoLast];

  if (isTournament(tournament)) {
    return isValid(result, tournament.groupSize)
      ? result
      : getSortedPlayerOrTeamGroups(
          tournaments,
          id,
          isParticipantsSingles,
          allGroups,
          allPlayers,
          allTeams
        );
  }
  return [];
};
