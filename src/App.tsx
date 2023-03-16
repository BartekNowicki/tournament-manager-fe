/* eslint-disable import/extensions */
import { Route, Routes } from "react-router-dom";
import MainWrapper from "./components/mainWrapper/MainWrapper";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Tournaments } from "./pages/Tournaments";
import { NewTournament } from "./pages/NewTournament";
import { TournamentLayout } from "./pages/TournamentLayout";
import { Players } from "./pages/Players";
import { About } from "./pages/About";
import { Location } from "./pages/Location";
import { Contact } from "./pages/Contact";
import { ErrorPage } from "./pages/ErrorPage";
import "./App.css";

function App() {
  return (
    <MainWrapper>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<TournamentLayout />}>
          <Route index element={<Tournaments />} />
          <Route path="new" element={<NewTournament />} />
        </Route>
        <Route path="/players" element={<Players />} />
        <Route path="/about" element={<About />} />
        <Route path="/location" element={<Location />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </MainWrapper>
  );
}

export default App;
