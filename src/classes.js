import { createContext } from "react";
class Command {
  execute() {}
  undo() {}
}

class SaveCommand extends Command {
  constructor(receiver) {
    super();
    this.receiver = receiver;
    this.previousContent = receiver.getContent();
  }

  execute() {
    this.receiver.saveContent();
  }

  undo() {
    this.receiver.setContent(this.previousContent);
  }
}

class ClearCommand extends Command {
  constructor(receiver) {
    super();
    this.receiver = receiver;
    this.previousContent = receiver.getContent();
  }

  execute() {
    console.log("Executing ClearCommand");
    this.receiver.clearContent();
  }

  undo() {
    console.log("Undoing ClearCommand");
    this.receiver.setContent(this.previousContent);
  }
}
class Notepad {
  constructor() {
    this.content = "";
    this.clipboard = "";
  }

  removeText(text) {
    this.content = this.content.slice(0, -text.length);
  }

  saveContent() {
    localStorage.setItem("notepadContent", this.content);
    console.log("Content saved:", this.content);
  }

  clearContent() {
    this.content = "";
    console.log("Content cleared");
  }

  getContent() {
    return this.content;
  }

  setContent(text) {
    this.content = text;
    console.log("Content set to:", text);
  }

  setClipboard(text) {
    this.clipboard = text;
    console.log("Clipboard set to:", text);
  }

  getClipboard() {
    return this.clipboard;
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.undoStack = [];
  }

  executeCommand(command) {
    command.execute();
    this.history.push(command);
    console.log(
      "Command executed and added to history. History:",
      this.history
    );
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.undoStack.push(command);
      console.log(
        "Command undone and moved to undo stack. UndoStack:",
        this.undoStack
      );
    } else {
      console.log("No command to undo");
    }
  }

  redo() {
    const command = this.undoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
      console.log(
        "Command redone and added to history. History:",
        this.history
      );
    } else {
      console.log("No command to redo");
    }
  }
}

export { Notepad, CommandManager, SaveCommand, ClearCommand };
