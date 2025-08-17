import { useEffect } from "react";

const DogPortal = ({ mountRef, targetId }) => {
  useEffect(() => {
    if (!mountRef?.current) return;

    const moveDog = () => {
      const target = document.getElementById(targetId);
      if (!target) return; // target might not exist yet
      if (!target.contains(mountRef.current)) {
        target.appendChild(mountRef.current);
      }
    };

    // Try to move immediately
    moveDog();

    // Optional: observe DOM in case the target is added later (for dialogs)
    const observer = new MutationObserver(moveDog);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (mountRef.current?.parentNode) {
        mountRef.current.parentNode.removeChild(mountRef.current);
      }
    };
  }, [targetId, mountRef]);

  return null;
};

export default DogPortal;
