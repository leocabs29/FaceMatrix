import { Routes, Route, BrowserRouter } from "react-router-dom";
import Gallery from "./Gallery";
import Home from "./Home";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/body/AboutUs";
import LandingPage from "./components/body/LandingPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/home" element={<Home />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
