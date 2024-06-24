import { FC } from "react";
import { TestContainerState, TestStatsDisplay, getBorderStyles, getTestStats } from "../..";

type CustomTestStatsDisplayProps = {
  containerState: TestContainerState;
  title: string;
};

const CustomTestStatsDisplay: FC<CustomTestStatsDisplayProps> = ({ containerState, title }) => {
  const testStats = getTestStats(Object.values(containerState?.tests || []));
  const classNames = "rbt-overview " + getBorderStyles(testStats.state);

  return <div className={classNames}>
    <div
      className="rbt-overview-title-and-stats">
      <span>{title}</span>
      <TestStatsDisplay testStats={testStats} />
    </div>
  </div>
}

type IframeTestStatsDisplayProps = {
  containerStates: TestContainerState[];
  iframeUrl: string;
  isLoading: boolean;
};

export const IframeTestStatsDisplay: FC<IframeTestStatsDisplayProps> = ({
  containerStates,
  iframeUrl,
  isLoading }) => {
  let title = `Tests for ${iframeUrl}`;

  if (isLoading) {
    return (
      <div className={"rbt-overview " + getBorderStyles("Running")}>
        {title} - Waiting for tests to complete...
      </div>
    );
  } else if (containerStates.length === 0) {
    return (
      <div className={"rbt-overview " + getBorderStyles("Pending")}>
        {title} - No test containers available yet.
      </div>
    );
  }

  return containerStates.map((containerState) => (
    <CustomTestStatsDisplay
      key={containerState.containerId}
      containerState={containerState}
      title={title + " - container Id: " + containerState.containerId} />
  ))
}
