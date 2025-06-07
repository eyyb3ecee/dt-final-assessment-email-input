import React from "react";

const EmailPrompt = () => {
  return (
    <div className="bg-[#ebebeb] flex justify-center items-center min-h-screen">
      <input
        placeholder="Enter Recipients..."
        className="bg-white p-[10px] pr-[200px] w-100% rounded-[5px] text-[15px] shadow-lg hover:shadow-xl transition-shadow duration-300 outline-none focus:ring-0"
      ></input>
    </div>
  );
};

export default EmailPrompt;
