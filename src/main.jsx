import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

import store from "./app/store";
import { Provider } from "react-redux";

import ProtectedRoute from "./components/ProtectRoute.jsx";
import { AuthProvider } from "./hook/useAuthSession.jsx";


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

const Settings = lazy(() => import("./components/userProfile/Settings"));

const Mistakes = lazy(() => import("./components/userProfile/Mistakes"))

const Test = lazy(() => import("./pages/Test"))

const HomeworkHelp = lazy(() => import("./pages/HomeworkHelp"))
const Donate = lazy(() => import("./pages/Donate"))
const FinalExamPrep = lazy(() => import("./pages/FinalExamPrep"))

const Pricing = lazy(() => import("./pages/Pricing"))

const Lessons = lazy(() => import("./pages/Lessons"))

const Tutors = lazy(() => import("./pages/Tutors"))

const PracticeTopics = lazy(() => import("./pages/PracticeTopics"))

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/contact" element={<Contactme />} />
              <Route path="/about" element={<About />} />
              <Route path="/Waitlist" element={<Waitlist />} />
              <Route path="/freeResources" element={<FreeResources />} />
              <Route path="/freeResources/:subject" element={<Subject />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/showpersonaldata" element={
                <ProtectedRoute>
                  <ShowPersonalData />
                </ProtectedRoute>
              } />
              <Route
                path="/surveypersonaldetail"
                element={<SurveyPersonalDetail />}
              />
              <Route path="/question/:topic" element={
                <ProtectedRoute>

                  <SolveProblems />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/track-improvement" element={
                <ProtectedRoute>
                  <TrackImprovement />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/correct-mistakes" element={
                <ProtectedRoute>
                  <Mistakes />
                </ProtectedRoute>
              } />
              <Route path="/random/test" element={<ProtectedRoute>
                <Test />
              </ProtectedRoute>} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/practice-topics" element={<PracticeTopics />} />
              <Route path="/homework-help" element={<HomeworkHelp />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/final-exam-prep" element={<ProtectedRoute>
                <FinalExamPrep />
              </ProtectedRoute>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
