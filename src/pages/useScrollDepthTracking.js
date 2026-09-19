import { useEffect, useRef } from "react";
import ReactGA from "react-ga4";

const THRESHOLDS = [25, 50, 75, 90, 100];

export function useScrollDepthTracking(pageLabel) {
    const fired = useRef(new Set());
    const ticking = useRef(false);

    useEffect(() => {
        fired.current = new Set();

        const checkScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            const scrolledPct = Math.round((scrollTop / docHeight) * 100);

            THRESHOLDS.forEach((threshold) => {
                if (scrolledPct >= threshold && !fired.current.has(threshold)) {
                    fired.current.add(threshold);
                    ReactGA.event({
                        category: "Scroll Depth",
                        action: `scroll_${threshold}`,
                        label: pageLabel,
                        value: threshold,
                    });
                }
            });
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                requestAnimationFrame(checkScroll);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pageLabel]);
}
