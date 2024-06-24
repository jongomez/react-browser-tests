import { FC, useRef } from "react";
import { TestContainerState, useGetContainerIds } from "../..";
import { SingleTestContainerOverview } from "./SingleTestContainerOverview";

function getTitle(
  numContainers: number,
  containerId: string,
  iframeUrl: string | undefined): string | undefined {
  let title: string | undefined;

  if (numContainers > 1 && !iframeUrl) {
    title = `Container Id '${containerId}'`;
  } else if (numContainers > 1 && iframeUrl) {
    title = `Url '${iframeUrl}' - Container Id '${containerId}'`;
  } else if (numContainers === 1 && iframeUrl) {
    title = `Url '${iframeUrl}'`;
  }

  return title;
}

export type MultipleTestContainersOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  iframeUrl?: string;
  showGroupStats?: boolean;
  onAllTestsComplete?: (containerStateArray: TestContainerState[]) => void;
};

export const MultipleTestContainersOverview: FC<MultipleTestContainersOverviewProps> = ({
  iframeUrl,
  showGroupStats = false,
  onAllTestsComplete,
  ...props
}) => {
  const completedContainerStates = useRef<TestContainerState[]>([]);
  const containerIds = useGetContainerIds(iframeUrl);

  const singleTestContainerCompleteCallback = (containerState: TestContainerState) => {
    const containerId = containerState.containerId;
    const completedContainerIds = new Set(completedContainerStates.current.map((state) => state.containerId));

    // Sanity check: make sure we don't add the same container state twice.
    if (completedContainerIds.has(containerId)) {
      throw new Error(`Container with ID '${containerId}' already completed.`);
    }

    completedContainerStates.current.push(containerState);

    // When all the tests from all the containers are complete, call the onAllTestsComplete callback.
    if (completedContainerStates.current.length === containerIds.length) {
      onAllTestsComplete?.(completedContainerStates.current);
    }
  };

  return <div {...props}>
    {containerIds.map((containerId) => (
      <SingleTestContainerOverview
        key={containerId}
        containerId={containerId}
        iframeUrl={iframeUrl}
        showGroupStats={showGroupStats}
        title={getTitle(containerIds.length, containerId, iframeUrl)}
        testsCompleteCallback={singleTestContainerCompleteCallback}
      />
    ))}
  </div>;
}
