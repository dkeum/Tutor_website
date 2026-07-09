import { useEffect } from "react";



const usePuter = () => {

    // ── Initialize Puter.js Temporary Session ──
    useEffect(() => {
        const initializePuter = async () => {
            try {
                // First, check if the Puter SDK is loaded on the window object
                if (window.puter) {
                    // Check if the user is already signed in to prevent unnecessary calls
                    const isSignedIn = window.puter.auth.isSignedIn();

                    if (!isSignedIn) {
                        await window.puter.auth.signIn({ attempt_temp_user_creation: true });
                        console.log("Temporary Puter session created successfully.");
                    }
                } else {
                    console.warn("Puter.js SDK not found. Make sure the script tag is in your index.html.");
                }
            } catch (error) {
                console.error("Failed to initialize Puter session:", error);
            }
        };

        initializePuter();
    }, []); // Empty dependency array ensures this runs only once on mount

}

export default usePuter;