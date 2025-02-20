import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

type Props = {
  msg?: string;
};

const Loader = ({ msg }: Props) => {
  return (
    <div className="w-full py-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">{msg ? msg : "Loading...."}</p>
      </div>
    </div>
  );
};

export default Loader;
