import "./styles.css";
import TextArea from "./TextArea";
import Header from "./Header";
import { Notepad, CommandManager } from "./classes";

import { CommandContext } from "./commandContext";
const App = () => {
  const notepad = new Notepad();
  const commandManager = new CommandManager();

  return (
    <>
      <Header />
      <CommandContext.Provider value={{ commandManager, notepad }}>
        <TextArea />
      </CommandContext.Provider>
    </>
  );
};

export default App;
