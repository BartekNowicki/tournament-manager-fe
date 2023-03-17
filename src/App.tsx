import { Route, Routes } from "react-router-dom";
import MainWrapper from "./components/mainWrapper/MainWrapper";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Tournaments } from "./pages/Tournaments";
import { AddTournament } from "./pages/AddTournament";
import { TournamentLayout } from "./pages/TournamentLayout";
import { Players } from "./pages/Players";
import { About } from "./pages/About";
import { Location } from "./pages/Location";
import { Contact } from "./pages/Contact";
import { ErrorPage } from "./pages/ErrorPage";
import { PlayerLayout } from "./pages/PlayerLayout";
import AddPlayer from "./components/AddPlayer";
import "./App.css";

function App() {
  return (
    <MainWrapper>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<TournamentLayout />}>
          <Route index element={<Tournaments />} />
          <Route path="add" element={<AddTournament />} />
        </Route>
        <Route path="/players" element={<PlayerLayout />}>
          <Route index element={<Players />} />
          <Route path="add" element={<AddPlayer />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/location" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </MainWrapper>
  );
}

export default App;
