import { defaultContainerId } from '@/lib/constants';
import { useCustomRouter } from '@/lib/hooks';
import { BeforeAndAfterFunctions, SidebarUrls } from '@/lib/types';
import { Check, CircleSlash, Hourglass, LoaderCircle, X } from 'lucide-react';
import { FC } from 'react';
import { TestProvider, useTestContext } from './TestContext';

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

export const TestGroupStateIcon: FC<TestGroupStateIconProps> = ({
  hasRunningTests,
  hasPendingTests,
  hasFailedTests,
  allTestsPassed,
  allTestsSkipped,
  hasSkippedButPassedRemainingTests
}) => {
  if (hasPendingTests) {
    return <Hourglass />;
  } else if (hasRunningTests) {
    return <LoaderCircle className="spin-animation" />;
  } else if (hasFailedTests) {
    return <X />
  } else if (allTestsPassed || hasSkippedButPassedRemainingTests) {
    return <Check />
  } else if (allTestsSkipped) {
    return <CircleSlash />
  }

  return null;
};


const DefaultSidebar = () => {
  const { sidebarUrls } = useTestContext();
  const router = useCustomRouter();
  const urlsEntries = Object.entries(sidebarUrls || {});

  const handleNavigation = (urlParam: string) => {
    router.push(urlParam);
  };

  if (urlsEntries.length === 0) {
    // If no side
    return null;
  }

  return (
    <div className="sidebar">
      <ul>
        {urlsEntries.map(([url, groupTitle], index) => (
          <li
            key={index}
            className={router.pathname === url ? 'sidebar-li-active' : ''}
            onClick={() => handleNavigation(`${url}`)}>
            {groupTitle}
          </li>
        ))}
      </ul>
    </div>
  );
};

export type TestContainerProps = React.HTMLAttributes<HTMLDivElement> & BeforeAndAfterFunctions & {
  Sidebar?: React.FC | null;
  mainContentProps?: React.HTMLAttributes<HTMLDivElement>,
  sidebarUrls?: SidebarUrls;
  children?: React.ReactNode;
}

export const TestContainer: FC<TestContainerProps> = ({
  mainContentProps,
  Sidebar = DefaultSidebar,
  sidebarUrls,
  id = defaultContainerId,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  children,
  ...props
}) => {
  return (
    <TestProvider
      sidebarUrls={sidebarUrls}
      containerId={id}
      beforeAndAfterFunctions={{ beforeEach, afterEach, beforeAll, afterAll }}>
      <div id={id} className="test-container" data-test-container={id} {...props}>
        {!!Sidebar && <Sidebar />}
        <div className="main-content" {...mainContentProps}>
          {children}
        </div>
      </div>
    </TestProvider>
  );
}