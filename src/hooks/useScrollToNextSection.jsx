import { useRef } from "react";

export default function useScrollToNextSection() {
  const sectionRef = useRef(null);

  const scrollToNextSection = (offset = 0) => {
    if (!sectionRef.current) return;
  
    const sectionHeight = sectionRef.current.offsetHeight;
    window.scrollTo({
      top: sectionRef.current.offsetTop + sectionHeight + offset,
      behavior: "smooth",
    });
  };
  

  return { sectionRef, scrollToNextSection };
}
