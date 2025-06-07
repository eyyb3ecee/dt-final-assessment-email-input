import React from "react";
import { IoClose, IoAlert } from "react-icons/io5";

//Email Tag Component (for displaying the option to remove the tags)
const EmailTag = React.memo(({ tag, onRemove }) => {
  const actionElement = tag.isValid ? (
    <button
      onClick={() => onRemove(tag.id)}
      className="ml-0.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
      type="button"
    >
      <IoClose className="w-[14px] h-[14px]" />
    </button>
  ) : (
    <div className="relative ml-0.5 flex items-center">
      <button
        onClick={() => onRemove(tag.id)}
        className="w-5 h-5 rounded-full bg-[#F1515F] transition-opacity group flex items-center justify-center"
        type="button"
      >
        <IoAlert className="w-4 h-4 text-white transition-opacity group-hover:opacity-0" />
        <IoClose className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[14px] font-medium transition-colors ${
        tag.isValid
          ? "text-black group border border-transparent hover:bg-gray-100 hover:border-gray-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      <span className={tag.isValid ? "" : "max-w-24 truncate"}>
        {tag.email}
      </span>
      {actionElement}
    </div>
  );
});

export default EmailTag;
