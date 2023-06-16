import { Player } from "../storeContent/storeSlices/playerSlice";
import { Team } from "../storeContent/storeSlices/teamSlice";
import { Tournament } from "../storeContent/storeSlices/tournamentSlice";

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
