import React from "react";
import Modal from "./components/atoms/Modal";
import Giphy from "./pages/Giphy";

const App = () => {
  if (!process.env.REACT_APP_API_KEY) {
    return (
      <>
        {Modal.error({
          visible: true,
          maskClosable: false,
          mask: false,
          keyboard: false,
          title: "Missing API Key",
          content: (
            <div>
              <p>
                The following environment variable was not found:
                REACT_APP_API_KEY.
              </p>
              <p>Please set it up and try again.</p>
            </div>
          ),
          okButtonProps: { style: { display: "none" } },
        })}
      </>
    );
  }
  return <Giphy />;
};

export default App;
