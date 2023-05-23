import React, { useEffect, useRef } from "react";
import { Director, View  } from "@millicast/sdk";

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
    console.log("millicast view:", millicastView);

    millicastView.on("track", (event) => {
      video.srcObject = event.streams[0];
    });

    millicastView.connect().catch((e) => {
      console.log("Connection failed, handle error", e);
    });

    millicastView.on("reconnect", ({ timeout, error }) => {
      console.log(timeout);
      console.error(error);
    });

    // if (millicastView.webRTCPeer) {
    //   // Initialize stats
    //   millicastView.webRTCPeer.initStats();

    //   // Capture new stats from event every second
    //   millicastView.webRTCPeer.on("stats", (stats) => {
    //     console.log("Stats from event:", stats);
    //   });

    //   millicastView.webRTCPeer.stopStats();
    //   millicastView.webRTCPeer.removeAllListeners("stats");
    // }

    millicastView.connect({
      events: ["active", "inactive", "layers", "viewercount"],
    }).catch((e) => {
      console.error("Connection failed, handle error", e);
    });

    const activeSources = new Set();

    millicastView.on("broadcastEvent", (event) => {
      const { name, data } = event;
      console.log("event",event);
      switch (name) {
        // You have an active source
        case "active":
          activeSources.add(data.sourceId);
          console.log("Active Stream.");
          break;
        // You have an inactive source
        case "inactive":
          activeSources.delete(data.sourceId);
          if (activeSources.size === 0) {
            console.log("No active Stream.");
          }
          break;
        default:
          break;
      }
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
