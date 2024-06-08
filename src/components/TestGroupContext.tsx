import React, { useContext } from "react";

export type TestGroupContextType = {
  groupTitle: string;
}

const TestGroupContext = React.createContext<TestGroupContextType | undefined>(undefined);

export type TestGroupProviderProps = {
  groupTitle: string;
  children: React.ReactNode;
}

export const TestGroupProvider: React.FC<TestGroupProviderProps> = ({ groupTitle, children }) => {
  return (
    <TestGroupContext.Provider value={{ groupTitle }}>
      {children}
    </TestGroupContext.Provider>
  );
};

export const useTestGroupContext = (): TestGroupContextType | null => {
  const context = useContext(TestGroupContext);

  if (!context) {
    // No context means the test does not have a parent TestGroup. In this case, return null.
    return null
  }

  return context;
};
