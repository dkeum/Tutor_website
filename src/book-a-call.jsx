import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"




const GroupTutoringSignUp = lazy(() => import("./pages/GroupTutoringSignUp"))

const Loader = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
);

let gaInitialized = false;

window.addEventListener('load', () => {
    if (gaInitialized) return;
    gaInitialized = true;
    import('react-ga4').then(({ default: ReactGA }) => ReactGA.initialize("G-4HEPW2QJWG"))
})

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Suspense fallback={<Loader />}>
            <GroupTutoringSignUp />
        </Suspense>
    </StrictMode>
)