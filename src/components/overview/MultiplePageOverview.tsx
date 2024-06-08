import { FC, useState } from "react";
import { MultipleTestContainersOverview } from "./MultipleTestContainersOverview";

/*

export type TestPageIframeProps = React.HTMLAttributes<HTMLIFrameElement> & {
  url: string;
  onIframeLoad: () => void;
};

export const TestPageIframe: FC<TestPageIframeProps> = ({ url, onIframeLoad, ...props }) => {
  const handleLoad = (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    const iframe = event.target as HTMLIFrameElement;

    if (iframe.contentWindow) {
      onIframeLoad();
    } else {
      console.error(`Could not get contentWindow for iframe with src: ${iframe.src}`);
    }
  };

  return <iframe src={url} onLoad={handleLoad} {...props} />;
};

*/

export type MultiplePageOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  iframeProps?: React.HTMLAttributes<HTMLIFrameElement>;
  urls: string[];
};

export const MultiplePageOverview: FC<MultiplePageOverviewProps> = ({
  urls,
  iframeProps }) => {
  const [iframesLoaded, setIframesLoaded] = useState<number[]>([]);

  const handleIframeLoad = (index: number) => {
    setIframesLoaded((prev) => Array.from(new Set([...prev, index])));
  };

  if (urls.length === 0) {
    throw new Error("No urls provided to MultiplePageOverview");
  }

  return (
    <>
      {urls.map((url, index) => (
        <div key={index}>
          {iframesLoaded.includes(index) && <MultipleTestContainersOverview iframeUrl={url} />}
          <iframe src={url} onLoad={() => handleIframeLoad(index)} {...iframeProps} />
          {/* <TestPageIframe url={url} onIframeLoad={() => handleIframeLoad(index)}  /> */}
        </div>
      ))}
    </>
  );
};