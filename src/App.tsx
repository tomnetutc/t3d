import { TimeUse } from "./pages/TimeUse";
import { Travel } from "./pages/Travel";
import { Telework } from "./pages/Telework";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { useEffect } from "react";

ReactGA.initialize('G-TXP1R3BQ6J');

function App(): JSX.Element {

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<TimeUse />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/telework" element={<Telework />} />
      </Routes>
    </>
  );
}

export default App;