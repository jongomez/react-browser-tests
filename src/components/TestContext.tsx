import { useInitWindowObject } from '@/lib/hooks';
import { getInitialContainerState, updateTest, useGetTotalNumberOfTests, useRunTests } from '@/lib/testHelpers';
import { updateWindowObject } from '@/lib/window';
import { FC, createContext, useContext, useState } from 'react';
import { BeforeAndAfterFunctions, SidebarUrls, TestContainerState, TestContextType, TestGroupType, TestType } from '../lib/types';

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};


export type SetTestContainerState = React.Dispatch<React.SetStateAction<TestContainerState>>

export type TestProviderProps = {
  beforeAndAfterFunctions: BeforeAndAfterFunctions;
  containerId: string;
  sidebarUrls?: SidebarUrls;
  children: React.ReactNode;
};

export const TestProvider: FC<TestProviderProps> = ({
  sidebarUrls,
  beforeAndAfterFunctions,
  containerId,
  children }) => {
  const [containerState, setContainerState] = useState<TestContainerState>(getInitialContainerState(containerId));
  useInitWindowObject(containerId, containerState);
  useGetTotalNumberOfTests(
    containerId,
    containerState.totalNumberOfTests,
    setContainerState);

  const updateTestClosure = (test: TestType, updateIndex = true): TestContainerState => {
    return updateTest(test, updateIndex, containerId, containerState, setContainerState);
  };

  useRunTests(
    containerState,
    updateTestClosure,
    beforeAndAfterFunctions
  );

  const reRunTests = () => {
    setContainerState((prevContainerState: TestContainerState) => {
      // TODO: FIXME: These are not deep copies. Maybe use immer or something?
      const newContainerState = { ...prevContainerState };
      newContainerState.reRunCount += 1;
      newContainerState.currentTestIndex = 0;
      newContainerState.tests = {};

      return newContainerState;
    });
  }

  const registerTest = (test: TestType) => {
    setContainerState((prevContainerState: TestContainerState) => {
      const newContainerState = { ...prevContainerState };
      newContainerState.tests[test.id] = test;

      updateWindowObject(newContainerState, containerId);

      return newContainerState;
    });
  }

  const addGroup = (group: TestGroupType) => {
    setContainerState((prevContainerState: TestContainerState) => {
      const newContainerState = { ...prevContainerState };
      newContainerState.groupRecord[group.title] = group;

      updateWindowObject(newContainerState, containerId);

      return newContainerState;
    });
  }

  const contextProviderValue: TestContextType = {
    sidebarUrls: sidebarUrls || {},
    tests: containerState.tests,
    groupRecord: containerState.groupRecord,
    reRunCount: containerState.reRunCount,
    containerId,
    registerTest,
    addGroup,
    reRunTests,
  };

  return (
    <TestContext.Provider value={contextProviderValue}>
      {children}
    </TestContext.Provider>
  );
};