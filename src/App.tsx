import React from "react";
import Viewer from "./viewer";
import Publisher from "./publisher";

function App(): JSX.Element {
  return (
    <>
      <Publisher />
      <Viewer streamName="myStreamName" streamAccountId="M6JHkf" />
    </>
  );
}

export default App;
