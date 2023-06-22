/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Action,
  AnyAction,
  createAction,
  isPending,
} from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { Player, baseUrl } from "./playerSlice";
// eslint-disable-next-line import/no-cycle
import { Team } from "./teamSlice";
// eslint-disable-next-line import/no-cycle
import { Group } from "./groupSlice";
// eslint-disable-next-line import/no-cycle
// import { serializeDate } from "../../utils/funcs";
import { TournamentType } from "../../components/Tournament";
// import { serializeDate } from "../../utils/funcs";

// TODO: figure out which ones are optional
export interface Tournament {
  id: number;
  type: string;
  startDate: Date;
  endDate: Date;
  groupSize: number;
  comment: string;
  participatingPlayers: Player[];
  participatingPlayerIds: number[];
  participatingTeams: Team[];
  participatingTeamIds: number[];
  groups: Group[];
  groupIds: number[];
}

export const placeholderTournament: Tournament = {
  id: -2,
  startDate: new Date(),
  endDate: new Date(),
  type: TournamentType.SINGLES,
  groupSize: 0,
  comment: "",
  participatingPlayers: [],
  participatingPlayerIds: [],
  participatingTeams: [],
  participatingTeamIds: [],
  groups: [],
  groupIds: [],
};

export const emptyTournament: Tournament = {
  id: 999,
  startDate: new Date(),
  endDate: new Date(),
  type: TournamentType.SINGLES,
  groupSize: 0,
  comment: "",
  participatingPlayers: [],
  participatingPlayerIds: [],
  participatingTeams: [],
  participatingTeamIds: [],
  groups: [],
  groupIds: [],
};

interface TournamentSliceState {
  tournaments: Tournament[];
}

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

export const fetchAllTournaments = createAsyncThunk(
  "tournaments/get",
  async (thunkAPI) => {
    const response = await axios.get(`${baseUrl}/api/data/tournaments`);
    return response.data;
  }
);

const getEnumKeyByValue = (val: string): string => {
  if (val === "SINGLES") return "SINGLES";
  if (val === "DOUBLES") return "DOUBLES";
  console.warn("HERE IS THE ERROR WHEN SAVING SINGLES!!!");
  return "DOUBLES";
};

// export const convertToMysqlDatetime6 = (dateString: string): Date => {
//   // required by mysql: datetime(6)
//   // e.g. `java.util.Date` from String "5.04.2023"
//   const dateArr: string[] = dateString.split(".");
//   // return new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`).getTime();
//   const convertedDate: Date = new Date(
//     `"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`
//   );
//   // need to set the date one day after as sql stores the date one day before
//   convertedDate.setDate(convertedDate.getDate() + 1);
//   return convertedDate;
// };

// export const convertFromMysqlDatetime6 = (mysqlDatetime6: Date): string => {
//   console.log(
//     "CONVERTED FROM  DB: ",
//     mysqlDatetime6.getFullYear(),
//     mysqlDatetime6.getDate()
//   );
//   // required by mysql: datetime(6)
//   // e.g. `java.util.Date` from String "5.04.2023"
//   // const dateArr: string[] = dateString.split(".");
//   // return new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`).getTime();
//   // const convertedDate: Date = new Date(
//   //   `"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`
//   // );
//   // need to set the date one day after as sql stores the date one day before
//   // convertedDate.setDate(convertedDate.getDate() + 1);
//   return "convertedDate";
// };

export const saveTournament = createAsyncThunk(
  "tournaments/save",
  async (tournament: Tournament, { rejectWithValue }) => {
    console.log("ASYNC THINK RECEIVED TYPE: ", tournament.type);
    const tournamentWithTypeConvertedToEnumKey = {
      ...tournament,
      // type: getEnumKeyByValue(tournament.type),  IS THIS CONVERSION NECESSARY?? PROBABLY NOT IF YOU JUST SET THE ENUM VALUE TO "SINGLES" AND "DOUBLES" AND NOT TO "singles" and "doubles" because BE EXPECTS IN ITS ENUM CONVERSION TO RECEIVE SINGLES OR DOUBLES, IF YOU SEND "singles" THEN YOU NEED TO CONVERT... IS IT NOT BETTER TO JUST USE CAPITALS EVERYWHERE?
    };
    try {
      console.log("SAVE REQUEST: ", tournament);
      const response = await axios.put(`${baseUrl}/api/data/tournaments`, {
        ...tournamentWithTypeConvertedToEnumKey,
        // startDate: convertToMysqlDatetime6(tournament.startDate),
        // endDate: convertToMysqlDatetime6(tournament.endDate),
      });
      // console.log("SAVE RESPONSE: tournament, response.data");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error.message}`);
    }
  }
);
export interface TData {
  tournamentId: number;
  type: string;
}

export const assignPlayersToTournament = createAsyncThunk(
  "tournaments/assignPlayers",
  async (tdata: TData, { rejectWithValue }) => {
    try {
      const { tournamentId, type } = tdata;
      const URL =
        type === "singles"
          ? `${baseUrl}/api/data/tournaments/assignToSingles?tournamentId=${tournamentId}`
          : `${baseUrl}/api/data/tournaments/assignToDoubles?tournamentId=${tournamentId}`;
      // console.log("ASSIGNING: ", tournamentId, type);
      const response = await axios.get(URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error?.message}`);
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/delete",
  async (tdata: TData, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/data/tournaments/${tdata.type}/${tdata.tournamentId}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        `error deleting the tournament: ${error?.message}`
      );
    }
  }
);

interface TournamentSliceState {
  tournaments: Tournament[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  tournaments: [],
  loading: "idle",
} as TournamentSliceState;

export const TournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    addTournament: (
      state,
      action: PayloadAction<{
        type: string;
        startDate: Date;
        endDate: Date;
        groupSize: number;
        comment: string;
        participatingPlayers: Player[];
        participatingPlayerIds: number[];
        participatingTeams: Team[];
        participatingTeamIds: number[];
        groups: Group[];
        groupIds: number[];
      }>
    ) => {
      state.tournaments = [
        ...state.tournaments,
        {
          id: state.tournaments.length || 1,
          type: action.payload.type,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          groupSize: action.payload.groupSize,
          comment: action.payload.comment,
          participatingPlayers: action.payload.participatingPlayers,
          participatingPlayerIds: action.payload.participatingPlayerIds,
          participatingTeams: action.payload.participatingTeams,
          participatingTeamIds: action.payload.participatingTeamIds,
          groups: action.payload.groups,
          groupIds: action.payload.groupIds,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        console.info("fetch tournaments promise fulfilled", state.tournaments);
      })
      .addCase(fetchAllTournaments.pending, () => {
        // console.info("fetch tournaments promise pending...");
      })
      .addCase(fetchAllTournaments.rejected, () => {
        console.warn("fetch tournaments promise rejected!");
      })
      .addCase(saveTournament.fulfilled, (state, action) => {
        const tournamentIdAlreadyInState = (id: number) => {
          if (!state.tournaments.length) return false;
          return state.tournaments.filter((t) => t.id === id).length > 0;
        };

        if (tournamentIdAlreadyInState(action.payload.id)) {
          state.tournaments = state.tournaments.map((tournament) => {
            return tournament.id !== action.payload.id
              ? tournament
              : {
                  id: action.payload.id,
                  type: action.payload.type,
                  startDate: action.payload.startDate,
                  endDate: action.payload.endDate,
                  groupSize: action.payload.groupSize,
                  comment: action.payload.comment,
                  participatingPlayers: action.payload.participatingPlayers,
                  participatingPlayerIds: action.payload.participatingPlayerIds,
                  participatingTeams: action.payload.participatingTeams,
                  participatingTeamIds: action.payload.participatingTeamIds,
                  groups: action.payload.groups,
                  groupIds: action.payload.groupIds,
                };
          });
        } else {
          state.tournaments = [...state.tournaments, action.payload];
        }
        console.info("save tournament promise fulfilled");
      })
      .addCase(saveTournament.rejected, (e) => {
        console.warn("save tournament promise rejected!");
      })
      .addCase(saveTournament.pending, () => {
        // console.info("save tournament promise pending...");
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        const tournamentIdNotInState = (id: number) => {
          return state.tournaments.filter((t) => t.id === id).length === 0;
        };
        if (tournamentIdNotInState(action.payload.id)) {
          console.warn("invalid tournament id for deletion");
        } else {
          state.tournaments = state.tournaments.filter(
            (t) => t.id !== action.payload.id
          );
        }
        console.info("delete tournament promise fulfilled");
      })
      .addCase(deleteTournament.rejected, () => {
        console.warn("delete tournament promise rejected!");
      })
      .addCase(deleteTournament.pending, () => {
        // console.info("delete tournament promise pending...");
      })
      .addCase(assignPlayersToTournament.fulfilled, (state, action) => {
        console.info(
          "assignPlayersToTournament promise fulfilled, fetching updates..."
        );
      })
      .addCase(assignPlayersToTournament.rejected, () => {
        console.warn("assignPlayersToTournament promise rejected!");
      })
      .addMatcher(isRejectedAction, () => {
        console.info("promise rejected");
      })
      .addDefaultCase(() => {
        // console.log("thunk in default mode");
      });
  },
});

export default TournamentSlice.reducer;
