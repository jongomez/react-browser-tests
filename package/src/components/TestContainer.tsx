import { FC } from 'react';
import { useCSS } from '..';
import { defaultContainerId } from '../constants';
import { testContainerStyles } from '../styles';
import { BeforeAndAfterFunctions } from '../types';
import { TestProvider } from './TestContext';

export const toUrlParam = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export type TestGroupStateIconProps = {
  hasRunningTests: boolean;
  hasPendingTests: boolean;
  hasFailedTests: boolean;
  allTestsPassed: boolean;
  allTestsSkipped: boolean;
  hasSkippedButPassedRemainingTests: boolean;
};

export type TestContainerProps = React.HTMLAttributes<HTMLDivElement> & BeforeAndAfterFunctions & {
  css?: string | null;
};

export const TestContainer: FC<TestContainerProps> = ({
  id = defaultContainerId,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  css = testContainerStyles,
  children,
  ...props
}) => {
  const cssAdded = useCSS("rbt-test-container-styles", css);

  return (
    <TestProvider
      containerId={id}
      beforeAndAfterFunctions={{ beforeEach, afterEach, beforeAll, afterAll }}>
      <div id={id} data-test-container={id} style={cssAdded ? {} : {
        display: "none",
      }}  {...props}>
        {children}
      </div>
    </TestProvider>
  );
}
