import { useState, useEffect } from "react";

export default function usePersistentBudgetChat() {
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("");
  const [dessertCount, setDessertCount] = useState("");
  const [includeWine, setIncludeWine] = useState(false);

  const [remainingVolume, setRemainingVolume] = useState(0);
  const [remainingDessertVolume, setRemainingDessertVolume] = useState(0);
  const [mode, setMode] = useState(""); // "budget" | "volume" | ""

  // טעינה ראשונית מה־localStorage
  useEffect(() => {
    const get = (key, fallback, parse = (v) => v) =>
      localStorage.getItem(key) ? parse(localStorage.getItem(key)) : fallback;

    setResults(get("results", [], JSON.parse));
    setBudget(get("budget", ""));
    setPeople(get("people", ""));
    setDessertCount(get("dessertCount", ""));
    setIncludeWine(get("includeWine", false, (v) => v === "true"));
    setShowResults(get("showResults", false, (v) => v === "true"));
    setMode(get("mode", ""));
    setRemainingVolume(get("remainingVolume", 0, Number));
    setRemainingDessertVolume(get("remainingDessertVolume", 0, Number));
  }, []);

  // שמירות
  useEffect(() => localStorage.setItem("results", JSON.stringify(results)), [results]);
  useEffect(() => localStorage.setItem("showResults", showResults), [showResults]);
  useEffect(() => {
    localStorage.setItem("budget", budget);
    localStorage.setItem("mode", "budget");
  }, [budget]);
  useEffect(() => {
    localStorage.setItem("people", people);
    localStorage.setItem("mode", "volume");
  }, [people]);
  useEffect(() => localStorage.setItem("dessertCount", dessertCount), [dessertCount]);
  useEffect(() => localStorage.setItem("includeWine", includeWine), [includeWine]);
  useEffect(() => localStorage.setItem("remainingVolume", remainingVolume), [remainingVolume]);
  useEffect(() => localStorage.setItem("remainingDessertVolume", remainingDessertVolume), [remainingDessertVolume]);

  return {
    results, setResults,
    showResults, setShowResults,
    budget, setBudget,
    people, setPeople,
    dessertCount, setDessertCount,
    includeWine, setIncludeWine,
    remainingVolume, setRemainingVolume,
    remainingDessertVolume, setRemainingDessertVolume,
    mode, setMode
  };
}
