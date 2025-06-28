import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy load the pages
const Contactme = lazy(() => import('./pages/Contactme'));
const Aboutme = lazy(() => import('./pages/Aboutme'));

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
          <Route path="/about" element={<Aboutme />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
