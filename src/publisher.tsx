import React, { useEffect, useRef } from "react";
import  {Director, Publish } from "@millicast/sdk";

const PublishStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const PublishingToken =
      "8cc3d3390bd1be140d38be260191065413a2c68d721512a0987ed8cce816348d";
    const StreamName = "myStreamName";

    const tokenGenerator = () =>
        Director.getPublisher({
        token: PublishingToken,
        streamName: StreamName,
      });

    const millicastPublish = new Publish(StreamName, tokenGenerator);
    console.log("millicast publish:",millicastPublish);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        const broadcastOptions = { mediaStream };
        millicastPublish
          .connect(broadcastOptions)
          .then(() => console.log("Successfully started broadcast"))
          .catch((error) => console.log("Error starting broadcast", error));
      })
      .catch((error) => console.log("Error getting media devices", error));
    return () => {
      millicastPublish.stop();
    };
  }, []);

  return (
    <div>
      <h1>Publish Stream</h1>
      <video ref={videoRef} controls autoPlay muted></video>
    </div>
  );
};

export default PublishStream;
