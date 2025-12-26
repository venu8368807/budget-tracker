import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "warning";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "warning") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    function showToast(message: string, type: "success" | "error" | "warning" = "success") {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex flex-col gap-3 z-[9999] pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-6 py-3 rounded-xl shadow-2xl text-white font-semibold flex items-center gap-2 animate-bounce-in transition-all pointer-events-auto ${toast.type === "success" ? "bg-green-600" :
                            toast.type === "error" ? "bg-red-600" : "bg-amber-500"
                            }`}
                    >
                        {toast.type === "success" && <span>✅</span>}
                        {toast.type === "error" && <span>❌</span>}
                        {toast.type === "warning" && <span>⚠️</span>}
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
