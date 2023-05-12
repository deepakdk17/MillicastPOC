import { useEffect, useRef } from "react";
import { Director , View } from "@millicast/sdk";


type Props = {
  streamName: string;
  streamAccountId: string;
};

const Viewer = ({ streamName, streamAccountId }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName,
        streamAccountId,
      });

    const millicastView = new View(streamName, tokenGenerator, video);
    console.log("millicast view:",millicastView);

    millicastView.connect().catch((e) => {
      console.log("Connection failed, handle error", e);
    });

    return () => {
      millicastView.stop();
    };
  }, [streamName, streamAccountId]);

  return  (
    <div>
      <h1>Viewer Stream</h1>
      <video ref={videoRef} controls autoPlay muted></video>
    </div>
  );
};


export default Viewer;
