import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MonthContextType {
    month: string;
    setMonth: (month: string) => void;
    refreshTrigger: number;
    triggerRefresh: () => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: ReactNode }) {
    const getInitialMonth = () => {
        // Try to get from localStorage first
        const stored = localStorage.getItem("selected_month");
        if (stored) return stored;

        // Default to current month
        return new Date().toISOString().slice(0, 7);
    };

    const [month, setMonthState] = useState<string>(getInitialMonth);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const setMonth = (newMonth: string) => {
        setMonthState(newMonth);
        localStorage.setItem("selected_month", newMonth);
    };

    const triggerRefresh = () => {
        const newTrigger = Date.now();
        setRefreshTrigger(newTrigger);

        // Dispatch custom event for same-page communication
        window.dispatchEvent(new CustomEvent("dataRefresh", { detail: newTrigger }));

        // Also update localStorage for cross-tab communication
        localStorage.setItem("data_refresh_trigger", String(newTrigger));
    };

    useEffect(() => {
        // Listen for custom events (same page)
        const handleCustomRefresh = (e: Event) => {
            const customEvent = e as CustomEvent;
            setRefreshTrigger(customEvent.detail);
        };

        // Listen for storage changes (cross-tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "selected_month" && e.newValue) {
                setMonthState(e.newValue);
            }
            if (e.key === "data_refresh_trigger" && e.newValue) {
                setRefreshTrigger(Number(e.newValue));
            }
        };

        window.addEventListener("dataRefresh", handleCustomRefresh);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("dataRefresh", handleCustomRefresh);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <MonthContext.Provider value={{ month, setMonth, refreshTrigger, triggerRefresh }}>
            {children}
        </MonthContext.Provider>
    );
}

export function useMonth() {
    const context = useContext(MonthContext);
    if (!context) {
        throw new Error("useMonth must be used within MonthProvider");
    }
    return context;
}
