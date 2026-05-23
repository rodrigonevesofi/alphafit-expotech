import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o comportamento de scroll "instantâneo" ignorando o CSS "scroll-behavior: smooth"
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    
    // Restaura o smooth scroll para âncoras dentro da mesma página
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 10);
  }, [pathname]);

  return null;
}
