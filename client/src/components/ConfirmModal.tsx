import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmOptions {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface ConfirmContextType {
    askConfirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    function askConfirm(opt: ConfirmOptions) {
        setOptions(opt);
    }

    function handleCancel() {
        setOptions(null);
    }

    function handleConfirm() {
        if (options) {
            options.onConfirm();
        }
        setOptions(null);
    }

    return (
        <ConfirmContext.Provider value={{ askConfirm }}>
            {children}
            {options && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[260px] p-8 text-center animate-bounce-in">
                        <p className="text-gray-900 font-extrabold text-xl mb-8 leading-tight">
                            {options.message}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirm}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
                            >
                                {options.confirmText || "Confirm"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full py-2 text-gray-400 font-semibold hover:text-gray-600 transition-colors text-sm"
                            >
                                {options.cancelText || "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context;
}
