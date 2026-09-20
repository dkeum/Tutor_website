import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Loader2 } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import ReactGA from "react-ga4";

const GroupTutoringSignUp = lazy(() => import("./pages/GroupTutoringSignUp"))

const Loader = () => (
    <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
    </div>


)

window.addEventListener('load', () => {
    import('react-ga4').then(({ default: ReactGA }) => ReactGA.initialize("G-4HEPW2QJWG"))
})

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Suspense fallback={<Loader />}>
            <GroupTutoringSignUp />
        </Suspense>
        <Toaster />
    </StrictMode>
)