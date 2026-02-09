import { TimeUse } from "./pages/TimeUse";
import { Travel } from "./pages/Travel";
import { Telework } from "./pages/Telework";
import { SampleComposition } from "./pages/SampleComposition";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { About } from "./pages/About";
import { Home } from "./pages/Home";


ReactGA.initialize('G-TXP1R3BQ6J');

function App(): JSX.Element {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/timeuse" element={<TimeUse />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/telework" element={<Telework />} />
        <Route path="/sample-composition" element={<SampleComposition />} />
      </Routes>
    </>
  );
}

export default App;