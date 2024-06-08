import { useGetContainerIds } from "@/lib/hooks";
import { FC } from "react";
import { SingleTestContainerOverview } from "./SingleTestContainerOverview";

export type MultipleTestContainersOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  iframeUrl?: string;
};

export const MultipleTestContainersOverview: FC<MultipleTestContainersOverviewProps> = ({
  iframeUrl,
}) => {
  const containerIds = useGetContainerIds(iframeUrl);

  return <>
    {!!iframeUrl && <h2>Results for url {iframeUrl}</h2>}
    {containerIds.map((containerId) => (
      <SingleTestContainerOverview
        key={containerId}
        containerId={containerId}
        iframeUrl={iframeUrl}
        title={containerIds.length > 1 ? `Container with Id ${containerId}` : undefined}
      />
    ))}
  </>;
}
