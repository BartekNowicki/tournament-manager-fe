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

export interface Tournament {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  comment: string;
  participatingPlayerIds?: number[];
  participatingPlayers?: Player[];
  participatingTeamIds?: number[];
  participatingTeams?: Player[];
}

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

const getEnumKeyByValue = (val: string) => {
  return val === "singles" ? "SINGLES" : "DOUBLES";
};

const convertToMysqlDatetime6 = (dateString: string) => {
  // required by mysql: datetime(6)
  // e.g. `java.util.Date` from String "5.04.2023"
  const dateArr: string[] = dateString.split(".");
  // return new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`).getTime();
  const convertedDate: Date = new Date(
    `"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`
  );
  // need to set the date one day after as sql stores the date one day before
  convertedDate.setDate(convertedDate.getDate() + 1);
  return convertedDate;
};

export const saveTournament = createAsyncThunk(
  "tournaments/save",
  async (tournament: Tournament, { rejectWithValue }) => {
    const tournamentWithTypeConvertedToEnumKey = {
      ...tournament,
      type: getEnumKeyByValue(tournament.type),
    };
    try {
      const response = await axios.put(`${baseUrl}/api/data/tournaments`, {
        ...tournamentWithTypeConvertedToEnumKey,
        startDate: convertToMysqlDatetime6(tournament.startDate),
        endDate: convertToMysqlDatetime6(tournament.endDate),
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error.message}`);
    }
  }
);
interface TData {
  tournamentId: number;
  type: string;
}

export const assignPlayersToTournament = createAsyncThunk(
  "tournaments/assignPlayers",
  async (tdata: TData, { rejectWithValue }) => {
    try {
      const { tournamentId, type } = tdata;
      console.log("ASSIGNING: ", tournamentId, type);
      if (type === "singles") {
        const response = await axios.post(
          // `${baseUrl}/api/data/tournaments?tournamentId=${tournamentId}`
          `${baseUrl}/api/data/tournaments/assignToSingles?tournamentId=${tournamentId}`
        );
        return response.data;
      }
      if (type === "doubles") {
        const response = await axios.post(
          // `${baseUrl}/api/data/tournaments?tournamentId=${tournamentId}`
          `${baseUrl}/api/data/tournaments/assignToDoubles?tournamentId=${tournamentId}`
        );
        return response.data;
      }
      throw new Error("Invalid tournament type for assignment");
    } catch (error: any) {
      return rejectWithValue(`error saving the tournament: ${error?.message}`);
    }
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/delete",
  async (tournamentId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/data/tournaments/${tournamentId}`
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
        startDate: string;
        endDate: string;
        groupSize: number;
        comment: string;
      }>
    ) => {
      state.tournaments = [
        ...state.tournaments,
        {
          id: state.tournaments.length,
          type: action.payload.type,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          groupSize: action.payload.groupSize,
          comment: action.payload.comment,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        console.info("fetch tournaments promise fulfilled");
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
                };
          });
        } else {
          state.tournaments = [...state.tournaments, action.payload];
        }
        console.info("save tournament promise fulfilled");
      })
      .addCase(saveTournament.rejected, () => {
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
