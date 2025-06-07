import React from "react";

//Suggestion Item Component (for selecting from the suggested email texts)
const SuggestionItem = ({ email, isSelected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(email)}
    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
      isSelected ? "bg-blue-50 text-blue-500" : "text-gray-700"
    }`}
  >
    <span>{email}</span>
  </button>
);

export default SuggestionItem;
