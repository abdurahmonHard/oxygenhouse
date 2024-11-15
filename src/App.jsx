import React from "react";
import { useLocation } from "react-router";
import PageNotFound from "./pages/PageNotFound";
import { ToastContainer } from "react-toastify";
import Routers from "./router/Routers";

const App = () => {
  const { pathname } = useLocation();

  if (pathname.includes("page-not-found")) {
    return <PageNotFound />;
  }

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routers />
    </>
  );
};

export default App;
