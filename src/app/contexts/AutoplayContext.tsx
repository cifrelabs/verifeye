"use client"

import React, { createContext, useState, useContext } from 'react';

interface AutoplayContextType {
    globalAutoplay: boolean;
    setGlobalAutoplay: (autoplay: boolean) => void;
}

const AutoplayContext = createContext<AutoplayContextType | undefined>(undefined);

export const AutoplayProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [globalAutoplay, setGlobalAutoplay] = useState(false);

    return (
        <AutoplayContext.Provider value={{ globalAutoplay, setGlobalAutoplay }}>
        {children}
        </AutoplayContext.Provider>
    );
};

export const useAutoplay = () => {
    const context = useContext(AutoplayContext);
    if (context === undefined) {
        throw new Error('useAutoplay must be used within an AutoplayProvider');
    }
    return context;
};