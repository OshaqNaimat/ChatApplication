import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiMoreVertical,
  FiSearch,
  FiVideo,
  FiPhone,
  FiInfo,
  FiChevronLeft,
  FiCheck,
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiUsers
} from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

// Mock data for users and messages
const initialUsers = [
  { id: 1, name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=1e293b', lastSeen: 'Online', unread: 2 },
  { id: 2, name: 'Sarah Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=0f172a', lastSeen: '2 hours ago', unread: 0 },
  { id: 3, name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=1e293b', lastSeen: 'Yesterday', unread: 5 },
  { id: 4, name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=0f172a', lastSeen: 'Online', unread: 0 },
  { id: 5, name: 'David Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=1e293b', lastSeen: '3 hours ago', unread: 1 },
];

const initialMessages = [
  { id: 1, senderId: 1, text: 'Hey there! How are you doing?', timestamp: '10:30 AM', status: 'read' },
  { id: 2, senderId: 0, text: 'I\'m good! Just finished the project. What about you?', timestamp: '10:31 AM', status: 'read' },
  { id: 3, senderId: 1, text: 'That\'s great! Can you share the files when you get a chance?', timestamp: '10:32 AM', status: 'read' },
  { id: 4, senderId: 0, text: 'Sure, I\'ll send them over in a bit. Working on some final touches.', timestamp: '10:33 AM', status: 'read' },
  { id: 5, senderId: 1, text: 'Also, don\'t forget about the meeting tomorrow at 3 PM. We\'ll discuss the roadmap.', timestamp: '10:35 AM', status: 'delivered' },
];

const ChatApp = () => {
  const [users, setUsers] = useState(initialUsers);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(initialUsers[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter messages for selected user
  const userMessages = messages.filter(msg => 
    msg.senderId === selectedUser.id || msg.senderId === 0
  );

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 0, // 0 represents current user
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate reply after 1 second
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        senderId: selectedUser.id,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mark messages as read when user is selected
  useEffect(() => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id ? { ...user, unread: 0 } : user
      )
    );
  }, [selectedUser]);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar for desktop, overlay for mobile */}
      {(showSidebar || !isMobileView) && (
        <div 
          className={`${isMobileView ? 'absolute inset-0 z-50' : 'relative'} w-full md:w-96 flex flex-col ${
            darkMode 
              ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } border-r`}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
              : undefined
          }}
        >
          {/* Mobile header for sidebar */}
          {isMobileView && (
            <div className={`flex items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                onClick={() => setShowSidebar(false)}
                className={`p-2 mr-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FiChevronLeft className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Chats</h2>
            </div>
          )}

          {/* Sidebar content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!isMobileView && (
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gradient-to-r from-purple-600 to-blue-500' : 'bg-blue-500'}`}>
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Messages</h2>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-yellow-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search messages..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring-purple-500' 
                    : 'bg-gray-100 text-gray-800 focus:ring-blue-500'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Users list */}
            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedUser.id === user.id
                      ? darkMode 
                        ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20' 
                        : 'bg-blue-50 border border-blue-100'
                      : darkMode 
                        ? 'hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 border border-transparent hover:border-gray-600/30' 
                        : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedUser(user);
                    if (isMobileView) setShowSidebar(false);
                  }}
                >
                  <div className="relative">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-700"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}>
                        {user.lastSeen === 'Online' ? (
                          <div className="w-full h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                        ) : (
                          <div className={`w-full h-full rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</h3>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.lastSeen}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.unread > 0 ? `${user.unread} new messages` : 'No new messages'}
                      </p>
                      {user.unread > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {user.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col ${!showSidebar && isMobileView ? 'w-full' : ''}`}>
        {/* Chat header */}
        <div 
          className={`p-4 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-b border-gray-700/50 backdrop-blur-sm' 
              : 'bg-white border-b border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobileView && (
                <button 
                  onClick={() => setShowSidebar(true)}
                  className={`p-2 mr-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiChevronLeft className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} rotate-180`} />
                </button>
              )}
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 p-0.5">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-full h-full rounded-full border-2 border-transparent"
                    />
                  </div>
                  {selectedUser.lastSeen === 'Online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedUser.name}</h3>
                  <p className={`text-sm flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      selectedUser.lastSeen === 'Online' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></span>
                    {selectedUser.lastSeen}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}>
                <FiVideo className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}>
                <FiPhone className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}>
                <FiInfo className="w-5 h-5" />
              </button>
              <button className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}>
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{
            background: darkMode 
              ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #0a0f1a 100%)'
              : undefined
          }}
        >
          <div className="max-w-3xl mx-auto space-y-4">
            {userMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 backdrop-blur-sm ${
                    message.senderId === 0
                      ? darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-br-none'
                        : 'bg-blue-500 text-white rounded-br-none'
                      : darkMode
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-bl-none border border-gray-600/50'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                  style={message.senderId === 0 && darkMode ? {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                  } : undefined}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  <div className={`flex items-center justify-end mt-2 text-xs ${
                    message.senderId === 0 
                      ? darkMode ? 'text-blue-200' : 'text-blue-200' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="mr-2">{message.timestamp}</span>
                    {message.senderId === 0 && (
                      <span>
                        {message.status === 'sent' && <FiCheck className="w-3 h-3" />}
                        {message.status === 'delivered' && <FiCheck className="w-3 h-3" />}
                        {message.status === 'read' && <FiCheckCircle className="w-3 h-3" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div 
          className={`p-4 ${
            darkMode 
              ? 'bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent border-t border-gray-700/30' 
              : 'bg-white border-t border-gray-200'
          }`}
        >
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className={`p-3 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FiPaperclip className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={`p-3 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <FiSmile className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 ${
                    darkMode
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 text-gray-300 placeholder-gray-500 focus:ring-purple-500'
                      : 'bg-gray-100 text-gray-800 focus:ring-blue-500'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-3 rounded-full transition-all duration-300 ${
                  newMessage.trim()
                    ? darkMode
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={newMessage.trim() && darkMode ? {
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
                } : undefined}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;