import React, { useState, useEffect, useContext, useRef } from "react";
import { SaveCommand, ClearCommand } from "./classes";
import { CommandContext } from "./commandContext";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import "./styles.css";

const TextArea = () => {
  const { commandManager, notepad } = useContext(CommandContext);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const debouncedSaveAndCount = useRef();

  useEffect(() => {
    const savedContent = localStorage.getItem("notepadContent");
    if (savedContent) {
      setContent(savedContent);
      updateWordCount(savedContent);
    }
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    debouncedSaveAndCount.current = debounce(saveContent, 300);
  }, []);

  const updateWordCount = (text) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  const cutToClipboard = (text, start, end) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const newContent = content.slice(0, start) + content.slice(end);
        notepad.setContent(newContent);
        setContent(newContent);
        updateWordCount(newContent);
      })
      .catch((err) => console.error("Failed to cut text to clipboard:", err));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .catch((err) => console.error("Failed to copy text to clipboard:", err));
  };

  const pasteFromClipboard = () => {
    return navigator.clipboard
      .readText()
      .then((text) => text)
      .catch((err) =>
        console.error("Failed to read text from clipboard:", err)
      );
  };

  const handleChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    const newContent = e.target.value;
    notepad.content = newContent;
    setContent(newContent);
    debouncedSaveAndCount.current(newContent);
    updateWordCount(newContent);
  };

  const handleClearText = () => {
    const command = new ClearCommand(notepad);
    commandManager.executeCommand(command);
    setContent(notepad.getContent());
    updateWordCount("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        notepad.setContent(fileContent);
        setContent(fileContent);
        updateWordCount(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    const command = new SaveCommand(notepad);
    commandManager.executeCommand(command);
  };

  const handleUndo = () => {
    commandManager.undo();
    setContent(notepad.getContent());
    updateWordCount(notepad.getContent());
  };

  const handleRedo = () => {
    commandManager.redo();
    setContent(notepad.getContent());
    updateWordCount(notepad.getContent());
  };

  const handleCopy = () => {
    const selectedContent = window.getSelection().toString();
    copyToClipboard(selectedContent);
  };

  const handlePaste = () => {
    const textarea = document.querySelector("textarea");
    const position = textarea.selectionStart;
    pasteFromClipboard().then((pastedText) => {
      const newContent =
        content.slice(0, position) + pastedText + content.slice(position);
      notepad.setContent(newContent);
      setContent(newContent);
      updateWordCount(newContent);
    });
  };

  const handleCut = () => {
    const textarea = document.querySelector("textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedContent = content.slice(start, end);
    cutToClipboard(selectedContent, start, end);
  };

  const saveContent = (text) => {
    localStorage.setItem("notepadContent", text);
    updateWordCount(text);
  };

  const findAndReplace = (findText, replaceText) => {
    const newContent = content.split(findText).join(replaceText);
    notepad.setContent(newContent);
    setContent(newContent);
    updateWordCount(newContent);
  };

  return (
    <div className="text-area-container">
      
      <div className="button-container">
        <button className="btn" onClick={handleClearText}>
          <InsertDriveFileOutlinedIcon />
        </button>
        <button className="btn" onClick={handleSave}>
          <SaveOutlinedIcon />
        </button>
        <button className="btn" onClick={handleCut}>
          <ContentCutOutlinedIcon />
        </button>
        <button className="btn" onClick={handleUndo}>
          <UndoOutlinedIcon />
        </button>
        <button className="btn" onClick={handleRedo}>
          <RedoOutlinedIcon />
        </button>
        <button className="btn" onClick={handleCopy}>
          <ContentCopyOutlinedIcon />
        </button>
        <button className="btn" onClick={handlePaste}>
          <ContentPasteOutlinedIcon />
        </button>
        <button className="btn file-input-wrapper">
          <label htmlFor="fileInput">
            <FindInPageOutlinedIcon />
          </label>
          <input
            type="file"
            id="fileInput"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden-input"
          />
        </button>
        <span className="word-count">Word Count: {wordCount}</span>
      </div>
      <textarea
        className="text-area"
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default TextArea;
