/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { baseUrl } from "./playerSlice";
function isRejectedAction(action) {
    return action.type.endsWith("rejected");
}
export const fetchAllTournaments = createAsyncThunk("tournaments/get", async (thunkAPI) => {
    const response = await axios.get(`${baseUrl}/api/data/tournaments`);
    return response.data;
});
const getEnumKeyByValue = (val) => {
    return val === "singles" ? "SINGLES" : "DOUBLES";
};
const convertToMysqlDatetime6 = (dateString) => {
    // required by mysql: datetime(6)
    // e.g. `java.util.Date` from String "5.04.2023"
    const dateArr = dateString.split(".");
    // return new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`).getTime();
    const convertedDate = new Date(`"${dateArr[2]}.${dateArr[1]}.${dateArr[0]}"`);
    // need to set the date one day after as sql stores the date one day before
    convertedDate.setDate(convertedDate.getDate() + 1);
    return convertedDate;
};
export const saveTournament = createAsyncThunk("tournaments/save", async (tournament, { rejectWithValue }) => {
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
    }
    catch (error) {
        return rejectWithValue(`error saving the tournament: ${error.message}`);
    }
});
export const assignPlayersToTournament = createAsyncThunk("tournaments/assignPlayers", async (tdata, { rejectWithValue }) => {
    try {
        const { tournamentId, type } = tdata;
        const URL = type === "singles"
            ? `${baseUrl}/api/data/tournaments/assignToSingles?tournamentId=${tournamentId}`
            : `${baseUrl}/api/data/tournaments/assignToDoubles?tournamentId=${tournamentId}`;
        // console.log("ASSIGNING: ", tournamentId, type);
        const response = await axios.get(URL);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(`error saving the tournament: ${error?.message}`);
    }
});
export const deleteTournament = createAsyncThunk("tournaments/delete", async (tournamentId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${baseUrl}/api/data/tournaments/${tournamentId}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(`error deleting the tournament: ${error?.message}`);
    }
});
const initialState = {
    tournaments: [],
    loading: "idle",
};
export const TournamentSlice = createSlice({
    name: "tournament",
    initialState,
    reducers: {
        addTournament: (state, action) => {
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
            const tournamentIdAlreadyInState = (id) => {
                if (!state.tournaments.length)
                    return false;
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
            }
            else {
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
            const tournamentIdNotInState = (id) => {
                return state.tournaments.filter((t) => t.id === id).length === 0;
            };
            if (tournamentIdNotInState(action.payload.id)) {
                console.warn("invalid tournament id for deletion");
            }
            else {
                state.tournaments = state.tournaments.filter((t) => t.id !== action.payload.id);
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
            console.info("assignPlayersToTournament promise fulfilled, fetching updates...");
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
