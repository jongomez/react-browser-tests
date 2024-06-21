import { FC, useState } from "react";
import { useWaitForIframesTestContainers } from "../..";
import { MultipleTestContainersOverview } from "./MultipleTestContainersOverview";

export type MultiplePageOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  iframeProps?: React.HTMLAttributes<HTMLIFrameElement>;
  urls: string[];
};

export const MultiplePageOverview: FC<MultiplePageOverviewProps> = ({
  urls,
  iframeProps,
  ...props }) => {
  const [iframesLoaded, setIframesLoaded] = useState<number[]>([]);

  const handleIframeLoad = (index: number) => {
    setIframesLoaded((prev) => Array.from(new Set([...prev, index])));
  };

  const iframeRefs = useWaitForIframesTestContainers(urls, handleIframeLoad);

  if (urls.length === 0) {
    throw new Error("No urls provided to MultiplePageOverview");
  }

  return (
    <div {...props}>
      {urls.map((url, index) => (
        <div key={index}>
          {iframesLoaded.includes(index) && <MultipleTestContainersOverview iframeUrl={url} />}
          <iframe
            ref={(el) => {
              if (!el) {
                // The ref is null when the component is unmounted.
                // We're only interested in the ref when the component is mounted.
                return;
              }

              iframeRefs.current[index] = el
            }}
            src={url}
            {...iframeProps} />
        </div>
      ))}
    </div>
  );
};