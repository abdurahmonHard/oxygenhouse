import React from "react";

import { BarLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="fixed top-0 w-full left-0 z-50">
      <BarLoader color="#1769c7" width={"100%"} height={5} />
    </div>
  );
};

export default Loading;
