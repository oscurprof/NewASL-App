import React, { createContext, useMemo, useState } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  setIsDarkMode: () => {},
  theme: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
});

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

const darkTheme = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const value = useMemo(
    () => ({
      isDarkMode,
      setIsDarkMode,
      theme,
    }),
    [isDarkMode, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
