import { useState, useEffect } from "react";

type UseResizeWindowProps = {
    isOpen: boolean;
    isDesktop: boolean;
    handleNavClick: () => void;
}
  
export const useResizeWindow = ():UseResizeWindowProps=>{
      const [isOpen, setIsOpen] = useState(false);
      const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {

    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(isLargeScreen);
      setIsOpen(isLargeScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (!isDesktop) {
      setIsOpen(!isOpen);
    }
  };

  return { isOpen, isDesktop, handleNavClick };
}