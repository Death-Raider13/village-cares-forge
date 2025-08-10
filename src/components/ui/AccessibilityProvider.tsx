import React from 'react';

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
    const [fontSize, setFontSize] = useState(16);
    const [highContrast, setHighContrast] = useState(false);

    const value = {
        fontSize,
        increaseFontSize: () => setFontSize(prev => prev + 2),
        decreaseFontSize: () => setFontSize(prev => prev - 2),
        highContrast,
        toggleHighContrast: () => setHighContrast(prev => !prev)
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};