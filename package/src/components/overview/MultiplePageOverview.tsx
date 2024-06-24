import React, { FC, useEffect, useRef, useState } from "react";
import { IframeState, MultipleTestContainersOverview, TestContainerState, TestContainerStateArrayPerUrl, getBorderStyles, useWaitForIframeTestContainers } from "../..";
import { IframeTestStatsDisplay } from "../stats/IframeTestStatsDisplay";

type IframeStatesAndOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  iframeUrl: string;
  iframeProps?: React.HTMLAttributes<HTMLIFrameElement>;
  onIframeTestsComplete?: (containerStateArray: TestContainerState[]) => void;
};

const IframeStateAndOverview: FC<IframeStatesAndOverviewProps> = ({
  iframeUrl,
  iframeProps,
  onIframeTestsComplete,
  ...props
}) => {
  const [iframeState, setIframeState] = useState<IframeState>("Pending");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [readyUrl, setReadyUrl] = useState<string | null>(null);

  const handleIframeContainerReady = () => {
    setReadyUrl(iframeUrl);
    setIframeState("Test Container Available");
  };

  useEffect(() => {
    // When a new iframe url is passed in, the iframe state should be reset.
    setIframeState("Pending");
  }, [iframeUrl]);

  useWaitForIframeTestContainers(
    iframeUrl,
    iframeRef,
    handleIframeContainerReady);

  const isCurrentUrlReady = readyUrl === iframeUrl;

  // Initialize the iframe state string.
  let iframeStateString = iframeState;

  if (iframeState === "Pending") {
    iframeStateString = "Pending url: " + iframeUrl;
  } else {
    // TODO (maybe): Add more states here?
  }

  // console.log("iframeUrl -", iframeUrl, ";;;;;",
  //   "currentRefUrl -", readyUrl, ";;;;;",
  //   "iframeState -", iframeState, ";;;;;",
  //   "iframeStateString -", iframeStateString, ";;;;;",
  //   "isCurrentUrlReady -", isCurrentUrlReady);

  return <div {...props}>
    <iframe src={iframeUrl} ref={(el) => {
      if (!el) {
        // el is null when the component is unmounted. We're not interested in this case.
        return;
      }

      iframeRef.current = el;
    }} {...iframeProps} />

    {!isCurrentUrlReady && <div
      className={"rbt-overview " + getBorderStyles("Pending")}>
      {iframeStateString}
    </div>}

    {isCurrentUrlReady && <MultipleTestContainersOverview
      iframeUrl={iframeUrl}
      onAllTestsComplete={onIframeTestsComplete} />}
  </div >;
};

// Initialization function for testContainerStates.
function initTestContainerStates(urls: string[]): TestContainerStateArrayPerUrl {
  const states: TestContainerStateArrayPerUrl = {};

  urls.forEach(url => {
    states[url] = [];
  });

  return states;
}


export type MultiplePageOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  urls: string[];
  iframeProps?: React.HTMLAttributes<HTMLIFrameElement>;
  singleIframeMode?: boolean;
};

// Single iframe mode component
const SingleIframeOverview: FC<MultiplePageOverviewProps> = ({ urls, iframeProps, ...props }) => {
  const [currentIframeUrl, setCurrentIframeUrl] = useState<string>(urls[0]);

  // Define a state to hold the test container states for each URL.
  const [testContainerStates, setTestContainerStates] = useState<TestContainerStateArrayPerUrl>(initTestContainerStates(urls));

  const handleIframeTestsComplete = (containerStateArray: TestContainerState[]) => {
    const currentIframeUrl = containerStateArray[0].iframeUrl;

    if (!currentIframeUrl) {
      throw new Error("SingleIframeOverview - iframe url is not defined in the test container state");
    }

    // Update the state with the new test container state for the current URL
    setTestContainerStates(prevStates => ({
      ...prevStates,
      [currentIframeUrl]: containerStateArray,
    }));

    const nextUrlIndex = urls.indexOf(currentIframeUrl) + 1;
    if (nextUrlIndex < urls.length) {
      setCurrentIframeUrl(urls[nextUrlIndex]);
    }
  };

  return (
    <div {...props}>
      <IframeStateAndOverview
        iframeUrl={currentIframeUrl}
        iframeProps={iframeProps}
        onIframeTestsComplete={handleIframeTestsComplete}
        // XXX: NOTE: Hide the overview stats here. IframeTestStatsDisplay will handle the stats.
        style={{
          display: "none"
        }}
      />

      {Object.entries(testContainerStates).map(([url, containerStateArray], index) => (
        <IframeTestStatsDisplay
          key={`${url}-${index}`}
          containerStates={containerStateArray}
          isLoading={url === currentIframeUrl && containerStateArray.length === 0}
          iframeUrl={url}
        />
      ))}
    </div>
  );
};

// Multiple iframes mode component
const MultipleIframeOverview: FC<MultiplePageOverviewProps> = ({ urls, iframeProps, ...props }) => {
  return (
    <div {...props}>
      {urls.map(url => (
        <IframeStateAndOverview key={url} iframeUrl={url} iframeProps={iframeProps} />
      ))}
    </div>
  );
};

// Main component to decide which component to render
export const MultiplePageOverview: FC<MultiplePageOverviewProps> = ({
  singleIframeMode,
  ...props
}) => {
  if (props.urls.length === 0) {
    throw new Error("No urls provided to MultiplePageOverview");
  }

  if (singleIframeMode) {
    return <SingleIframeOverview {...props} />;
  } else {
    return <MultipleIframeOverview {...props} />;
  }
};