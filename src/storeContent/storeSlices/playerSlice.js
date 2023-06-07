/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios from "axios";
function isRejectedAction(action) {
    return action.type.endsWith("rejected");
}
export const baseUrl = "http://localhost:8080";
export const fetchAllPlayers = createAsyncThunk("players/get", async (thunkAPI) => {
    const response = await axios.get(`${baseUrl}/api/data/players`);
    return response.data;
});
export const savePlayer = createAsyncThunk("players/save", async (player, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${baseUrl}/api/data/players`, player);
        return response.data;
    }
    catch (error) {
        // return rejectWithValue(error.message);
        return rejectWithValue("error saving the player");
    }
});
export const checkPlayers = createAsyncThunk("players/check", async (mapping, { rejectWithValue }) => {
    try {
        console.log("SENDING : ", Object.fromEntries(mapping));
        const response = await axios.patch(`${baseUrl}/api/data/players`, Object.fromEntries(mapping));
        return response.data;
    }
    catch (error) {
        // return rejectWithValue(error.message);
        return rejectWithValue("error checking or unchecking the players");
    }
});
export const deletePlayer = createAsyncThunk("players/delete", async (playerId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${baseUrl}/api/data/players/${playerId}`);
        return response.data;
    }
    catch (error) {
        return rejectWithValue("error deleting the player");
    }
});
const initialState = {
    players: [],
    forceRerenderPlayerListCount: 0,
    loading: "idle",
};
export const PlayerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        addPlayer: (state, action) => {
            state.players = [
                ...state.players,
                {
                    id: state.players.length,
                    isChecked: false,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    strength: action.payload.strength,
                    comment: action.payload.comment,
                },
            ];
        },
        checkPlayer: (state, action) => {
            state.players = state.players.map((player) => player.id !== action.payload.id
                ? player
                : { ...player, isChecked: action.payload.isChecked || false });
        },
        checkAllPlayers: (state, action) => {
            state.players = state.players.map((player) => ({
                ...player,
                isChecked: action.payload.isChecked,
            }));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPlayers.fulfilled, (state, action) => {
            state.players = action.payload;
            console.info("fetch players promise fulfilled");
            state.forceRerenderPlayerListCount += 1;
        })
            .addCase(fetchAllPlayers.pending, () => {
            // console.info("fetch promise pending...");
        })
            .addCase(savePlayer.fulfilled, (state, action) => {
            const playerIdAlreadyInState = (id) => {
                if (!state.players.length)
                    return false;
                return state.players.filter((p) => p.id === id).length > 0;
            };
            if (playerIdAlreadyInState(action.payload.id)) {
                state.players = state.players.map((player) => {
                    return player.id !== action.payload.id
                        ? player
                        : {
                            id: action.payload.id,
                            firstName: action.payload.firstName,
                            lastName: action.payload.lastName,
                            isChecked: action.payload.isChecked,
                            strength: action.payload.strength,
                            comment: action.payload.comment,
                        };
                });
            }
            else {
                state.players.push(action.payload);
            }
            console.info("save player promise fulfilled");
            state.forceRerenderPlayerListCount += 1;
        })
            .addCase(savePlayer.rejected, () => {
            console.warn("save player promise rejected!");
        })
            .addCase(savePlayer.pending, () => {
            // console.info("save player promise pending...");
        })
            .addCase(checkPlayers.fulfilled, (state, action) => {
            console.log("PAYLOAD: ", action.payload);
            const newIdToCheckStatusMapping = new Map(Object.entries(action.payload));
            state.players = state.players.map((player) => {
                return !newIdToCheckStatusMapping.has(String(player.id))
                    ? player
                    : {
                        id: player.id,
                        firstName: player.firstName,
                        lastName: player.lastName,
                        isChecked: newIdToCheckStatusMapping.get(String(player.id)),
                        strength: player.strength,
                        comment: player.comment,
                    };
            });
            console.info("check player promise fulfilled", state.players[1]);
            state.forceRerenderPlayerListCount += 1;
        })
            .addCase(checkPlayers.rejected, () => {
            console.warn("check player promise rejected!");
        })
            .addCase(checkPlayers.pending, () => {
            // console.info("check player promise pending...");
        })
            .addCase(deletePlayer.fulfilled, (state, action) => {
            const playerIdNotInState = (id) => {
                return state.players.filter((p) => p.id === id).length === 0;
            };
            if (playerIdNotInState(action.payload.id)) {
                console.warn("invalid player id for deletion");
            }
            else {
                state.players = state.players.filter((p) => p.id !== action.payload.id);
            }
            console.info("delete player promise fulfilled");
            state.forceRerenderPlayerListCount += 1;
        })
            .addCase(deletePlayer.rejected, () => {
            console.warn("delete player promise rejected!");
        })
            .addCase(deletePlayer.pending, () => {
            // console.info("delete player promise pending...");
        })
            .addMatcher(isRejectedAction, () => {
            console.info("promise rejected");
        })
            .addDefaultCase(() => {
            // console.log("thunk in default mode");
        });
    },
});
export default PlayerSlice.reducer;
