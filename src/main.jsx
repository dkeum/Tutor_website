import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

import store from "./app/store";
import { Provider } from "react-redux";

// Lazy load the pages
const Contactme = lazy(() => import("./pages/Contactme"));
const About = lazy(() => import("./pages/About"));

const Waitlist = lazy(() => import("./pages/Waitlist"));
const FreeResources = lazy(() => import("./pages/FreeResources"));
const Subject = lazy(() => import("./pages/Subject"));
const ShowPersonalData = lazy(() => import("./pages/ShowPersonalData"));
const SurveyPersonalDetail = lazy(() =>
  import("./pages/SurveyPersonalDetails")
);
const SolveProblems = lazy(() => import("./pages/SolveProblems"));

const Login = lazy(() => import("./pages/Login"));

const TrackImprovement = lazy(() => import("./components/userProfile/TrackImprovement"));

const History = lazy(() => import("./components/userProfile/History"));

const Mistakes = lazy(()=>  import("./components/userProfile/Mistakes"))

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
 
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/contact" element={<Contactme />} />
              <Route path="/about" element={<About />} />
              <Route path="/Waitlist" element={<Waitlist />} />
              <Route path="/freeResources" element={<FreeResources />} />
              <Route path="/freeResources/:subject" element={<Subject />} />
              <Route path="/showpersonaldata" element={<ShowPersonalData />} />
              <Route
                path="/surveypersonaldetail"
                element={<SurveyPersonalDetail />}
              />
              <Route path="/question/:topic" element={<SolveProblems />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user/track-improvement" element={<TrackImprovement  />} />
              <Route path="/user/history" element={<History />} />
              <Route path="/user/mistakes" element={<Mistakes />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
  </StrictMode>
);
