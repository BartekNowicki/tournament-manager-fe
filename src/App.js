import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import MainWrapper from "./components/mainWrapper/MainWrapper";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Tournaments } from "./pages/Tournaments";
import { TournamentLayout } from "./pages/TournamentLayout";
import { Players } from "./pages/Players";
import { Location } from "./pages/Location";
import { Contact } from "./pages/Contact";
import { ErrorPage } from "./pages/ErrorPage";
import { PlayerLayout } from "./pages/PlayerLayout";
import AddOrEditPlayer from "./components/AddOrEditPlayer";
import AddOrEditTournament from "./components/AddOrEditTournament";
import "./App.css";
import { useAppDispatch } from "./storeContent/store";
import { fetchAllPlayers } from "./storeContent/storeSlices/playerSlice";
import { fetchAllTournaments } from "./storeContent/storeSlices/tournamentSlice";
import { fetchAllTeams } from "./storeContent/storeSlices/teamSlice";
function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchAllPlayers());
        dispatch(fetchAllTeams());
        dispatch(fetchAllTournaments());
    });
    return (_jsxs(MainWrapper, { children: [_jsx(Navbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsxs(Route, { path: "/tournaments", element: _jsx(TournamentLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Tournaments, {}) }), _jsx(Route, { path: "addoredit/:action", element: _jsx(AddOrEditTournament, {}) })] }), _jsxs(Route, { path: "/players", element: _jsx(PlayerLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Players, {}) }), _jsx(Route, { path: "addoredit/:action", element: _jsx(AddOrEditPlayer, {}) })] }), _jsx(Route, { path: "/location", element: _jsx(Location, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "*", element: _jsx(ErrorPage, {}) })] })] }));
}
export default App;
