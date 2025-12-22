import React, { useState } from 'react';
import ChatApp from './ChatApp';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-300">
        <ChatApp />
      </div>
    </div>
  );
}

export default App;