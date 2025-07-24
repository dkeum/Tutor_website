import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy load the pages
const Contactme = lazy(() => import('./pages/Contactme'));
const About = lazy(() => import('./pages/About'));

const Waitlist = lazy(()=> import ('./pages/Waitlist'))
const FreeResources = lazy(()=>import('./pages/FreeResources'))
const Subject = lazy(()=>import('./pages/Subject'))
const ShowPersonalData = lazy(()=>import('./pages/ShowPersonalData'))
const SurveyPersonalDetail = lazy(()=>import('./pages/SurveyPersonalDetails'))

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/contact" element={<Contactme />} />
          <Route path="/about" element={<About />} />
          <Route path="/Waitlist" element={<Waitlist />} />
          <Route path="/freeResources" element={<FreeResources/>} />
          <Route path="/freeResources/:subject" element={<Subject/>} />
          <Route path="/showpersonaldata" element={<ShowPersonalData/>} />
          <Route path="/surveypersonaldetail" element={<SurveyPersonalDetail/>} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
