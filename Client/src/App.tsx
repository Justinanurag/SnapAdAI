import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SoftBackdrop from "./components/SoftBackdrop";
import Footer from "./components/Footer";
import LenisScroll from "./components/lenis";
import { Route, Routes } from "react-router-dom";
import Generator from "./pages/Generator.tsx";
import Results from "./pages/Results.tsx";
import MyGenerations from "./pages/MyGenerations.tsx";
import Community from "./pages/Community.tsx";
import Plans from "./pages/Plans.tsx";
import Loading from "./pages/Loading.tsx";

function App() {
  return (
    <>
      <SoftBackdrop />
      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generator/>} />
        <Route path="/results/:projectId" element={<Results/>} />
        <Route path="/my-generations" element={<MyGenerations/>} />
        <Route path="/community" element={<Community/>} />
        <Route path="/pricing" element={<Plans/>} />
        <Route path="/loading" element={<Loading/>} />
      </Routes>

      <Footer />
    </>
  );
}
export default App;
