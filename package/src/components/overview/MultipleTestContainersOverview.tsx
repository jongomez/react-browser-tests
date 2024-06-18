import { FC } from "react";
import { useGetContainerIds } from "../../lib/hooks";
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
};

export const MultipleTestContainersOverview: FC<MultipleTestContainersOverviewProps> = ({
  iframeUrl,
  showGroupStats = false,
  ...props
}) => {
  const containerIds = useGetContainerIds(iframeUrl);

  return <div {...props}>
    {containerIds.map((containerId) => (
      <SingleTestContainerOverview
        key={containerId}
        containerId={containerId}
        iframeUrl={iframeUrl}
        showGroupStats={showGroupStats}
        title={getTitle(containerIds.length, containerId, iframeUrl)}
      />
    ))}
  </div>;
}
