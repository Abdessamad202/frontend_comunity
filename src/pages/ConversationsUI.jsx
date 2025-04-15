import { useState, useEffect, useRef } from "react";
import {
    Phone,
    Video,
    Info,
    Image,
    Paperclip,
    Smile,
    Send,
    MoreHorizontal,
    Search,
    ChevronLeft,
    ChevronDown,
    Mic,
    ThumbsUp,
    Settings,
    FileText,
    Bell,
    Users,
    ArrowLeft,
    X,
    Plus
} from "lucide-react";

const ConversationUI = () => {
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            avatar: "/api/placeholder/40/40",
            isOnline: true,
            lastSeen: "Active now",
            unread: 0,
            messages: [
                {
                    id: 1,
                    sender: "them",
                    text: "Hi there! I've reviewed the proposal you sent over and I have some thoughts.",
                    time: "10:24 AM",
                    status: "read"
                },
                {
                    id: 2,
                    sender: "me",
                    text: "That's great to hear. What are your initial impressions?",
                    time: "10:26 AM",
                    status: "read"
                },
                {
                    id: 3,
                    sender: "them",
                    text: "Overall, I think the direction is strong. The timeline seems ambitious though - can we discuss extending the delivery date by two weeks?",
                    time: "10:28 AM",
                    status: "read"
                },
                {
                    id: 4,
                    sender: "me",
                    text: "I understand your concern. Let me check with the team and see what adjustments we can make to accommodate this request.",
                    time: "10:30 AM",
                    status: "read"
                },
                {
                    id: 5,
                    sender: "them",
                    text: "Thank you, I appreciate that. Also, do you have the latest version of the requirements document? The one I have might be outdated.",
                    time: "10:35 AM",
                    status: "read"
                }
            ]
        },
        {
            id: 2,
            name: "Alex Chen",
            avatar: "/api/placeholder/40/40",
            position: "Project Manager",
            isOnline: false,
            lastSeen: "1h ago",
            unread: 3,
            messages: []
        },
        {
            id: 3,
            name: "Development Team",
            avatar: "/api/placeholder/40/40",
            isGroup: true,
            position: "Team Channel",
            isOnline: true,
            lastSeen: "Michael is typing...",
            unread: 0,
            messages: []
        },
        {
            id: 4,
            name: "Emma Wilson",
            avatar: "/api/placeholder/40/40",
            position: "UX Designer",
            isOnline: false,
            lastSeen: "5h ago",
            unread: 1,
            messages: []
        },
        {
            id: 5,
            name: "Project Falcon",
            avatar: "/api/placeholder/40/40",
            isGroup: true,
            position: "Client Project",
            members: ["You", "Sarah", "James", "Lisa", "+2"],
            lastSeen: "Lisa is typing...",
            unread: 0,
            messages: []
        },
        {
            id: 6,
            name: "David Thompson",
            avatar: "/api/placeholder/40/40",
            position: "Finance Director",
            isOnline: false,
            lastSeen: "Yesterday",
            unread: 0,
            messages: []
        }
    ]);

    const [activeConversation, setActiveConversation] = useState(1);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isCompactSidebar, setIsCompactSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    // Screen size detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640); // True for really small screens
            setIsSmallScreen(window.innerWidth < 768); // True for small screens
            setIsCompactSidebar(window.innerWidth >= 640 && window.innerWidth < 1024); // Compact sidebar for sm-md screens

            if (window.innerWidth < 640) {
                setShowSidebar(false);
                setShowRightPanel(false);
            } else {
                setShowSidebar(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations]);

    // Focus on message input when conversation changes
    useEffect(() => {
        messageInputRef.current?.focus();
    }, [activeConversation]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const updatedConversations = conversations.map(convo => {
            if (convo.id === activeConversation) {
                return {
                    ...convo,
                    messages: [
                        ...convo.messages,
                        {
                            id: convo.messages.length + 1,
                            sender: "me",
                            text: message,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: "sent"
                        }
                    ]
                };
            }
            return convo;
        });

        setConversations(updatedConversations);
        setMessage("");

        // Simulate reply after a delay
        setTimeout(() => {
            const updatedWithReply = conversations.map(convo => {
                if (convo.id === activeConversation) {
                    return {
                        ...convo,
                        messages: [
                            ...convo.messages,
                            {
                                id: convo.messages.length + 1,
                                sender: "me",
                                text: message,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: "sent"
                            },
                            {
                                id: convo.messages.length + 2,
                                sender: "them",
                                text: "I'll review this information and get back to you shortly. Thanks for the update.",
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: "sent"
                            }
                        ]
                    };
                }
                return convo;
            });

            setConversations(updatedWithReply);
        }, 2000);
    };

    const handleConversationClick = (id) => {
        setActiveConversation(id);
        if (isMobile) {
            setShowSidebar(false);
        }
    };

    const activeConvo = conversations.find(c => c.id === activeConversation);

    const getSidebarWidth = () => {
        if (isCompactSidebar) return 'w-16';
        return 'w-80 md:w-72 lg:w-80';
    };
    return (
        <div className="flex h-[calc(100vh-64px)] mt-[64px] bg-gray-50">
            {/* Mobile overlay when sidebar is open */}
            {isMobile && showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            <div
                className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'
                    } fixed sm:relative bg-white border-r border-gray-200 transition-all duration-300 
                flex flex-col shadow-sm overflow-hidden ${getSidebarWidth()} z-20 h-full`}
            >
                <div className={`py-4 ${isCompactSidebar ? 'px-2' : 'px-5'} border-b border-gray-200 bg-indigo-700 text-white`}>
                    <div className="flex items-center justify-between">
                        {!isCompactSidebar && <h1 className="text-lg font-semibold">Messages</h1>}
                        {isCompactSidebar && (
                            <div className="flex w-full justify-center">
                                <Bell size={20} />
                            </div>
                        )}
                        <div className="flex space-x-2">
                            {!isCompactSidebar && (
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors">
                                    <Settings size={18} />
                                </button>
                            )}
                            {isMobile && (
                                <button
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors"
                                    onClick={() => setShowSidebar(false)}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    {!isCompactSidebar && (
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search conversations"
                                className="w-full bg-indigo-600 text-white placeholder-indigo-300 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <Search size={16} className="absolute left-3 top-3 text-indigo-300" />
                        </div>
                    )}
                    {isCompactSidebar && (
                        <div className="mt-4 relative flex justify-center">
                            <button className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors">
                                <Search size={16} className="text-indigo-300" />
                            </button>
                        </div>
                    )}
                </div>

                <div className={`py-3 ${isCompactSidebar ? 'px-2' : 'px-4'} border-b border-gray-200 bg-white`}>
                    <div className="flex justify-between items-center">
                        {!isCompactSidebar && <h2 className="font-medium text-gray-700">Recent</h2>}
                        {isCompactSidebar && (
                            <div className="w-full flex justify-center">
                                <button className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                        {!isCompactSidebar && (
                            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800">See all</button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conversation => (
                        <button
                            key={conversation.id}
                            className={`w-full flex ${isCompactSidebar ? 'justify-center' : 'items-center'} px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors 
                                ${activeConversation === conversation.id ? (isCompactSidebar ? 'bg-indigo-50 border-l-2 border-l-indigo-600' : 'bg-indigo-50 border-l-4 border-l-indigo-600') : ''}`}
                            onClick={() => handleConversationClick(conversation.id)}
                        >
                            <div className="relative">
                                <img
                                    src={conversation.avatar}
                                    alt={conversation.name}
                                    className={`${isCompactSidebar ? 'w-8 h-8' : 'w-12 h-12'} rounded-full object-cover`}
                                />
                                {conversation.isOnline && (
                                    <div className={`absolute bottom-0 right-0 ${isCompactSidebar ? 'w-2 h-2' : 'w-3 h-3'} bg-green-500 rounded-full border-2 border-white`}></div>
                                )}
                                {conversation.unread > 0 && (
                                    <div className={`absolute ${isCompactSidebar ? '-top-1 -right-1' : 'top-0 -right-1'} bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center`}>
                                        {conversation.unread}
                                    </div>
                                )}
                            </div>
                            {!isCompactSidebar && (
                                <div className="ml-3 flex-1 truncate">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`font-medium truncate ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                                            {conversation.name}
                                        </h3>
                                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                            {conversation.messages.length > 0
                                                ? conversation.messages[conversation.messages.length - 1].time
                                                : "10:30 AM"}
                                        </span>
                                    </div>
                                    {conversation.position && (
                                        <p className="text-xs text-indigo-600 mb-0.5">{conversation.position}</p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate ${conversation.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                            }`}>
                                            {conversation.messages.length > 0
                                                ? `${conversation.messages[conversation.messages.length - 1].sender === 'me' ? 'You: ' : ''}${conversation.messages[conversation.messages.length - 1].text}`
                                                : conversation.lastSeen}
                                        </p>
                                        {conversation.unread > 0 && (
                                            <span className="bg-indigo-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5 ml-2">
                                                {conversation.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Quick access footer */}
                {!isCompactSidebar && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-around">
                        <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 flex flex-col items-center text-xs">
                            <Users size={16} className="mb-1" />
                            <span>Contacts</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 flex flex-col items-center text-xs">
                            <Bell size={16} className="mb-1" />
                            <span>Alerts</span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 flex flex-col items-center text-xs">
                            <FileText size={16} className="mb-1" />
                            <span>Archive</span>
                        </button>
                    </div>
                )}
                {isCompactSidebar && (
                    <div className="py-3 border-t border-gray-200 bg-gray-50 flex justify-center">
                        <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-700">
                            <Settings size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile overlay when details panel is open */}
            {isMobile && showRightPanel && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setShowRightPanel(false)}
                ></div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full md:w-auto">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                        {!showSidebar && (
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="flex items-center">
                            <div className="relative">
                                <img
                                    src={activeConvo?.avatar || "/api/placeholder/40/40"}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                                {activeConvo?.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="flex items-center">
                                    <h2 className="font-medium text-gray-900">{activeConvo?.name}</h2>
                                    {activeConvo?.isGroup && (
                                        <span className="ml-2 text-xs py-0.5 px-2 bg-indigo-100 text-indigo-800 rounded-full">Group</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 flex items-center truncate max-w-32 md:max-w-full">
                                    {activeConvo?.isOnline ? (
                                        <>
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                            Active now
                                        </>
                                    ) : activeConvo?.lastSeen}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-1">
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 hidden md:block">
                            <Phone size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 hidden md:block">
                            <Video size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setShowRightPanel(!showRightPanel)}>
                            <Info size={18} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 md:hidden">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50" id="messages-container">
                    {/* Date separator */}
                    <div className="flex justify-center mb-4">
                        <div className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                            Today
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {activeConvo?.messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender !== 'me' && index > 0 && activeConvo.messages[index - 1].sender === 'me' && (
                                    <img
                                        src={activeConvo.avatar}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full mr-2 self-end"
                                    />
                                )}
                                {message.sender !== 'me' && (index === 0 || activeConvo.messages[index - 1].sender === 'me') && (
                                    <img
                                        src={activeConvo.avatar}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full mr-2 self-end"
                                    />
                                )}
                                <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.sender !== 'me' && 'ml-2'}`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm ${message.sender === 'me'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-800 border border-gray-100'
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                    <div className={`text-xs mt-1 ${message.sender === 'me' ? 'text-right' : ''} text-gray-500`}>
                                        {message.time} {message.sender === 'me' && (message.status === 'read' ? '• Seen' : '• Sent')}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                        <div className="flex space-x-1 pl-2 md:pl-3">
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                                <Paperclip size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors hidden sm:block">
                                <Image size={18} />
                            </button>
                        </div>
                        <input
                            ref={messageInputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                            className="flex-1 bg-transparent border-none py-3 px-2 md:px-3 focus:outline-none text-gray-800"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <div className="flex pr-2 md:pr-3">
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                                <Smile size={18} />
                            </button>
                            {message.trim() ? (
                                <button
                                    onClick={handleSendMessage}
                                    className="p-1.5 rounded-md hover:bg-indigo-100 text-indigo-600 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            ) : (
                                <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                                    <Mic size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Typing indicator (optional) */}
                    <div className="px-2 mt-1">
                        <p className="text-xs text-gray-500 italic">Sarah is typing...</p>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Details Panel */}
            <div
                className={`
                    ${showRightPanel ? 'translate-x-0' : 'translate-x-full'} 
                    fixed md:relative right-0 top-0 
                    md:translate-x-0 md:w-0 md:min-w-0 md:overflow-hidden
                    ${showRightPanel ? 'md:w-72 md:min-w-72' : ''}
                    bg-white border-l border-gray-200 
                    transition-all duration-300 flex flex-col z-20 h-full w-80
                `}
            >
                <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">Conversation Details</h3>
                    <button
                        onClick={() => setShowRightPanel(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} className="md:hidden" />
                        <ChevronRight size={20} className="hidden md:block" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-5 flex flex-col items-center border-b border-gray-200">
                        <img
                            src={activeConvo?.avatar || "/api/placeholder/80/80"}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover border border-gray-200"
                        />
                        <h2 className="font-medium text-lg mt-3 text-gray-900">{activeConvo?.name}</h2>
                        {activeConvo?.position && (
                            <p className="text-sm text-indigo-600">{activeConvo.position}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {activeConvo?.isOnline ? "Active now" : activeConvo?.lastSeen}
                        </p>

                        <div className="flex space-x-4 mt-4">
                            <button className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors">
                                <Phone size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors">
                                <Video size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    {activeConvo?.isGroup && (
                        <div className="p-5 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-sm text-gray-700">Group Members</h3>
                                <span className="text-xs text-indigo-600">5 members</span>
                            </div>
                            <div className="space-y-3">
                                {["Sarah Johnson", "James Wilson", "Lisa Chen"].map((member, index) => (
                                    <div key={index} className="flex items-center">
                                        <img
                                            src={`/api/placeholder/32/32`}
                                            alt={member}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-800">{member}</p>
                                            {index === 0 && <p className="text-xs text-gray-500">Group Admin</p>}
                                        </div>
                                    </div>
                                ))}
                                <button className="text-indigo-600 text-xs font-medium hover:text-indigo-800 transition-colors">
                                    View all members
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="p-5 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-sm text-gray-700">Shared Files</h3>
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">View all</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <div className="h-20 bg-gray-100 flex items-center justify-center">
                                    <FileText size={24} className="text-indigo-500" />
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-gray-800 truncate">Project_requirements.pdf</p>
                                    <p className="text-xs text-gray-500">1.2 MB • Yesterday</p>
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-200 overflow-hidden">
                                <div className="h-20 bg-gray-100 flex items-center justify-center">
                                    <Image size={24} className="text-indigo-500" />
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-gray-800 truncate">Design_mockup_final.jpg</p>
                                    <p className="text-xs text-gray-500">3.4 MB • Apr 10</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="font-medium text-sm text-gray-700 mb-3">Options</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-2.5 text-left hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                                <span className="text-sm">Search in conversation</span>
                                <Search size={16} className="text-gray-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2.5 text-left hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                                <span className="text-sm">Notifications</span>
                                <Bell size={16} className="text-gray-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-2.5 text-left hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                                <span className="text-sm">Privacy settings</span>
                                <Settings size={16} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add missing ChevronRight icon
const ChevronRight = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
};

export default ConversationUI;