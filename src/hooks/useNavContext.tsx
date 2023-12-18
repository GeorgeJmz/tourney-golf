import React, { createContext, useState } from "react";

// Define the type for the context value
interface NavbarTitleContextValue {
  title: string;
  setTitle: (newTitle: string) => void;
}

const NavbarTitleContext = createContext<NavbarTitleContextValue>({
  title: "",
  setTitle: () => null,
});

// Create the provider component with types
const NavbarTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<string>(""); // Initial title with type

  const handleSetTitle = (newTitle: string) => setTitle(newTitle);

  return (
    <NavbarTitleContext.Provider value={{ title, setTitle: handleSetTitle }}>
      {children}
    </NavbarTitleContext.Provider>
  );
};

// Export the context and provider with types
export { NavbarTitleContext, NavbarTitleProvider };
