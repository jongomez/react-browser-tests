import { useGetContainerStateUntilAllTestsFinish } from "@/lib/hooks";
import { getTestArrayFromContainerState, groupTests } from "@/lib/testHelpers";
import { FC } from "react";
import { ContainerStateStats } from "../stats/ContainerStateStats";
import { TestGroupStats } from "../stats/TestGroupStatsProps";

export type SingleTestContainerOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  containerId?: string;
  iframeUrl?: string;
  title?: string;
}

export const SingleTestContainerOverview: FC<SingleTestContainerOverviewProps> = ({
  containerId,
  iframeUrl,
  title,
  ...props
}) => {
  const containerState = useGetContainerStateUntilAllTestsFinish(containerId, iframeUrl);
  const testsArray = getTestArrayFromContainerState(containerState);
  const groupedTests = groupTests(testsArray, "(no test group)");
  const uniqueTestGroupTitles = Object.keys(groupedTests);
  const isLoading = !containerState;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div {...props}>
      {!!title && <h2>title</h2>}
      <ContainerStateStats containerState={containerState} />

      {uniqueTestGroupTitles.map((groupTitle) => (
        <TestGroupStats key={groupTitle} groupTitle={groupTitle} tests={groupedTests[groupTitle]} />
      ))}
    </div>
  );
}
