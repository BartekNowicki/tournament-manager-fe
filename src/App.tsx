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
import AddOrEditTeam from "./components/AddOrEditTeam";
import { TeamLayout } from "./pages/TeamLayout";
import { Teams } from "./pages/Teams";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllPlayers());
    dispatch(fetchAllTeams());
    dispatch(fetchAllTournaments());
  });

  return (
    <MainWrapper>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<TournamentLayout />}>
          <Route index element={<Tournaments />} />
          <Route path="addoredit/:action" element={<AddOrEditTournament />} />
        </Route>
        <Route path="/players" element={<PlayerLayout />}>
          <Route index element={<Players />} />
          <Route path="addoredit/:action" element={<AddOrEditPlayer />} />
        </Route>
        <Route path="/teams" element={<TeamLayout />}>
          <Route index element={<Teams />} />
          <Route path="addoredit/:action" element={<AddOrEditTeam />} />
        </Route>
        <Route path="/location" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </MainWrapper>
  );
}

export default App;
