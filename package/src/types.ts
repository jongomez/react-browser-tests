
export type ThemeProps = {
  style?: React.CSSProperties;
  className?: string;
}

export type ThemeContextType = {
  testTitleThemeProps: ThemeProps;
  testResultThemeProps: ThemeProps;
  testTitleAndResultContainerThemeProps: ThemeProps;
  testGroupThemeProps: ThemeProps;
  sidebarUlThemeProps: ThemeProps;
  sidebarLiThemeProps: ThemeProps;
  sidebarLiActiveThemeProps: ThemeProps;
  iconsThemeProps: ThemeProps;
  skippedClassName: string;
  successClassName: string;
  failClassName: string;
};

export type ThemeProviderProps = {
  theme: ThemeContextType;
  children: React.ReactNode;
}

export type BeforeAndAfterFunctions = {
  beforeEach?: () => void;
  afterEach?: () => void;
  beforeAll?: (tests: TestRecord) => void
  afterAll?: (tests: TestRecord) => void;
}


export type TestGroupType = BeforeAndAfterFunctions & {
  title: string;
};

export type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export type SidebarUrls = Record<string, string>;

export type SidebarMenu = {
  [key: string]: [string, SidebarUrls?];
}

export type SidebarLiProps = React.HTMLAttributes<HTMLLIElement> & {
  active: boolean;
}

export type TestState = "Pending" | "Running" | "Skipped" | "Success" | "Fail";

export type TestType = {
  title: string;
  groupTitle?: string;
  id: string;
  fn: (contentWindow: Window, contentDocument: Document) => void | Promise<void>;
  skip: boolean;
  only: boolean;
  state: TestState;
  resultInfo?: string;
}

export type GroupRecord = Record<string, TestGroupType>;
export type TestRecord = Record<string, TestType>;

export type TestContextType = {
  tests: TestRecord;
  groupRecord: GroupRecord;
  reRunCount: number;
  containerId: string;
  registerTest: (test: TestType) => void;
  addGroup: (group: TestGroupType) => void;
  reRunTests: () => void;
}

export type SetTestRecord = React.Dispatch<React.SetStateAction<TestRecord>>

export type UpdateTestRecord = (test: TestType) => TestRecord;

export type TotalNumberOfTests = number | null;

export type TestStats = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  pending: number;
  running: number;
  state: TestState;
};

export type TestArrayStatsMap = Map<string, TestStats>;


export type TestContainerState = {
  tests: TestRecord;
  groupRecord: GroupRecord;
  reRunCount: number;
  currentTestIndex: number;
  containerId: string;
  totalNumberOfTests: TotalNumberOfTests;
  iframeUrl?: string;
}

// Original goal of this type - the keys are the urls for the iframes.
export type TestContainerStateArrayPerUrl = Record<string, TestContainerState[]>

export type UpdateTestClosure = (test: TestType, updateIndex?: boolean) => TestContainerState;

export type IframeState = "Waiting For A Test Container" | "Test Container Available" | "Pending";

export type IframeStatesObject = {
  [key: string]: IframeState;
}

export type ReactBrowserTestsWindowObject = {
  testContainers: TestContainerState[];
  getContainerState: (containerId?: string, windowRef?: Window) => TestContainerState | undefined;
  getTestRecord: (containerId?: string, windowRef?: Window) => Record<string, TestType>;
  getTestArray: (containerId?: string, windowRef?: Window) => TestType[];
  checkIfContainerTestsComplete: (containerId?: string, windowRef?: Window) => boolean;
  checkIfTestsFromAllContainersComplete: (windowRef?: Window) => boolean;
  sumTotalNumberOfTests: (windowRef?: Window) => number | null;
  checkIfAllTestsRegistered: (windowRef?: Window) => boolean;
}
