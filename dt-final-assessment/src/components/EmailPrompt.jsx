import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { emailService } from "../services/emailService";
import EmailTag from "./EmailTag";
import SuggestionItem from "./SuggestionItem";

//Email validation utility (to check the format of the text if it uses the @ for the email address)
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const EmailPrompt = () => {
  const [emailTags, setEmailTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allEmails, setAllEmails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  //Load emails on component mount (to load emails from the suggesttion component)
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const emails = await emailService.getEmails();
        setAllEmails(emails);
      } catch (error) {
        console.error("Failed to load emails:", error);
      }
    };

    loadEmails();
  }, []);

  //Memoize filtered suggestions to save the email input to avoid unnecessary re-rendering of the whole object (to avoid lag)
  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim() || !allEmails.length) return [];

    const searchTerm = inputValue.toLowerCase();
    const filtered = allEmails.filter(
      (email) => !emailTags.some((tag) => tag.email === email)
    );

    //Sort suggestions to prioritize matches that start with the search term
    return filtered
      .filter((email) => email.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(searchTerm);
        const bStartsWith = b.toLowerCase().startsWith(searchTerm);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      });
  }, [inputValue, allEmails, emailTags]);

  //Update suggestions when filtered results change
  useEffect(() => {
    setSuggestions(filteredSuggestions);
    setShowDropdown(filteredSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [filteredSuggestions]);

  const addEmailTag = useCallback((email) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      setEmailTags((prev) => {
        if (!prev.some((tag) => tag.email === trimmedEmail)) {
          const newTag = {
            id: Date.now(),
            email: trimmedEmail,
            isValid: isValidEmail(trimmedEmail),
          };
          return [...prev, newTag];
        }
        return prev;
      });
    }
    setInputValue("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const removeEmailTag = useCallback((id) => {
    setEmailTags((prev) => prev.filter((tag) => tag.id !== id));
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addEmailTag(suggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        addEmailTag(inputValue);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showDropdown) {
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showDropdown) {
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setSelectedIndex(-1);
    } else if (e.key === "Backspace" && !inputValue && emailTags.length > 0) {
      removeEmailTag(emailTags[emailTags.length - 1].id);
    }
  };

  const handleSuggestionClick = useCallback(
    (email) => {
      addEmailTag(email);
    },
    [addEmailTag]
  );

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  //Memoize suggestion items
  const suggestionItems = useMemo(
    () =>
      suggestions.map((email, index) => (
        <SuggestionItem
          key={email}
          email={email}
          isSelected={index === selectedIndex}
          onClick={handleSuggestionClick}
        />
      )),
    [suggestions, selectedIndex, handleSuggestionClick]
  );

  return (
    <div className="bg-[#ebebeb] flex justify-center items-center min-h-screen">
      <div className="relative">
        {/* Input Container */}
        <div className="bg-white p-[14px] w-[388px] rounded-[10px] text-[15px] shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center flex-wrap gap-2">
            {/* Email Tags */}
            {emailTags.map((tag) => (
              <EmailTag key={tag.id} tag={tag} onRemove={removeEmailTag} />
            ))}

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={emailTags.length === 0 ? "Enter Recipients..." : ""}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-[18px] text-gray-500 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            {suggestionItems}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPrompt;
