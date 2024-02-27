import { TimeUse } from "./pages/TimeUse";
import { Travel } from "./pages/Travel";
import { Telework } from "./pages/Telework";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import { useEffect } from "react";

ReactGA.initialize('G-03ZSYS61MK');

function App(): JSX.Element {

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