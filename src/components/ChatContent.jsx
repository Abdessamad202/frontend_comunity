import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Image, Info, Mic, MoreHorizontal, Paperclip, Phone, Send, Smile, Video } from "lucide-react"
import { getConversations, sendMessage, typing } from "../apis/apiCalls";
import useUser from "../hooks/useUser";
import { use, useEffect, useRef, useState } from "react";
import ProfilePictureLink from "./ProfilePictureLink";
import ChatInput from "./ChatInput";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import Pusher from "pusher-js";
import { u } from "framer-motion/client";
import { handleInputChange } from "../utils/formHelpers";
import { getToken } from "../utils/localStorage";
import echo from "../utils/echo";
import { pusher } from "../utils/pusher";
import MessageStatus from "./MessageStatus";

export default function ChatContent({ activeConvId, showSidebar, setShowSidebar, showRightPanel, setShowRightPanel }) {
    const queryClient = useQueryClient()
    const [isTyping, setIsTyping] = useState(false);

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: ({ pageParam = 1 }) => getConversations(pageParam),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? false,
    });
    const conversations = data?.pages.flatMap((page) => page.conversations) || [];
    const [activeConvo, setActiveConvo] = useState();
    useEffect(() => {
        if (activeConvId) {
            setActiveConvo(conversations.find((conv) => conv.id === activeConvId))
        }
    }, [activeConvId, conversations])
    const participant = activeConvo?.participant?.[0]
    const messagesEndRef = useRef(null);
    const { user } = useUser()

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConvId, activeConvo?.messages.length, isTyping]);

    // Format the message time based on date
    const formatMessageTime = (dateString) => {
        if (!dateString) return '';

        const date = parseISO(dateString);

        return format(date, 'h:mm a');
        // if (isToday(date)) {
        // } else if (isYesterday(date)) {
        // return 'Yesterday ' + format(date, 'h:mm a');
        // } else {
        // return format(date, 'MMM d, h:mm a');
        // }
    };

    // Function to format date separator
    const formatDateSeparator = (dateString) => {
        if (!dateString) return '';

        const date = parseISO(dateString);

        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'MMMM d, yyyy');
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        if (!messages || messages.length === 0) return [];

        const groups = [];
        let currentDate = null;
        let currentMessages = [];

        messages.forEach(message => {
            const messageDate = parseISO(message?.created_at);
            const dateKey = format(messageDate, 'yyyy-MM-dd');

            if (currentDate !== dateKey) {
                if (currentMessages.length > 0) {
                    groups.push({
                        date: currentDate,
                        separator: formatDateSeparator(currentMessages[0].created_at),
                        messages: currentMessages
                    });
                }
                currentDate = dateKey;
                currentMessages = [message];
            } else {
                currentMessages.push(message);
            }
        });

        if (currentMessages.length > 0) {
            groups.push({
                date: currentDate,
                separator: formatDateSeparator(currentMessages[0].created_at),
                messages: currentMessages
            });
        }

        return groups;
    };

    const [message, setMessage] = useState({
        content: "",
    })
    const messageInputRef = useRef(null);

    // const ChatInput = ({ activeConvId }) => {
    //     const [isTyping, setIsTyping] = useState(false)
    //     const [message, setMessage] = useState({
    //         content: "",
    //     })
    //     const typingTimeout = setTimeout(() => {
    //         setIsTyping(false);
    //     }, 3000);
    //     useEffect(() => {
    //         // Clear previous timeout (if any)
    //         // Set a new timeout to turn it off after 3 seconds

    //         if (isTyping) {
    //             typingTimeout
    //         }

    //         return () => {
    //             clearTimeout(typingTimeout)
    //         }
    //     }, [isTyping, setIsTyping])
    //     useEffect(() => {
    //         messageInputRef.current?.focus();
    //         const typingChannelName = `typing.${activeConvId}`;
    //         const typingChannel = pusher.subscribe(typingChannelName)
    //         typingChannel.bind('typing', function (data) {
    //             console.log("is Typing", data);

    //             if (data.userId !== user.id) {
    //                 setIsTyping(true);
    //             }
    //         });
    //         return () => {
    //             pusher.unsubscribe(typingChannelName);
    //         };
    //     }, [activeConvId]);

    //     const handleKeyPress = (e) => {
    //         if (e.key === 'Enter') {
    //             handleSendMessage();
    //         }
    //     };
    //     const sendMessageMutation = useMutation({
    //         mutationFn: (message) => sendMessage(activeConvId, message),
    //         onMutate: async (newMessage) => {
    //             await queryClient.cancelQueries(['conversations']);
    //             const previousConversations = queryClient.getQueryData(['conversations']);
    //             const updatedConversations = conversations.map(convo => {
    //                 if (convo.id === activeConvId) {
    //                     return {
    //                         ...convo,
    //                         messages: [
    //                             ...convo.messages,
    //                             {
    //                                 id: convo.messages.length + 1,
    //                                 sender_id: user.id,
    //                                 content: newMessage.content,
    //                                 created_at: new Date().toISOString(),
    //                                 updated_at: new Date().toISOString(),
    //                                 status: "sent",
    //                             }
    //                         ],
    //                         last_message_at: new Date().toISOString(),
    //                     };
    //                 }
    //                 return convo;
    //             });
    //             queryClient.setQueryData(['conversations'], {
    //                 ...previousConversations,
    //                 pages: previousConversations.pages.map(page => ({
    //                     ...page,
    //                     conversations: updatedConversations,
    //                 })),
    //             });
    //             return { previousConversations };
    //         },
    //         onError: (err, newMessage, context) => {
    //             log("Error sending message: ", err);
    //             queryClient.setQueryData(['conversations'], context.previousConversations);
    //         },
    //         onSuccess: () => {
    //             scrollToBottom();
    //             messageInputRef.current?.focus();
    //         },
    //         onSettled: () => {
    //             queryClient.invalidateQueries(['conversations']);
    //         },
    //     });
    //     const handleSendMessage = () => {

    //         if (messageInputRef.current?.value?.trim() === "") return;
    //         // if (messageInputRef.current && messageInputRef.current?.value) {
    //         message.content = messageInputRef.current.value;
    //         // }
    //         sendMessageMutation.mutate(message);
    //         messageInputRef.current.value = '';
    //         // setMessage('');

    //         // const updatedConversations = conversations.map(convo => {
    //         //     if (convo.id === activeConvId) {
    //         //         return {
    //         //             ...convo,
    //         //             messages: [
    //         //                 ...convo.messages,
    //         //                 {
    //         //                     id: convo.messages.length + 1,
    //         //                     sender: "me",
    //         //                     text: message,
    //         //                     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         //                     status: "sent"
    //         //                 }
    //         //             ]
    //         //         };
    //         //     }
    //         //     return convo;
    //         // });

    //         // setActiveConvo(updatedConversations);
    //         // setMessage("");

    //         // Simulate reply after a delay
    //         // setTimeout(() => {
    //         //     const updatedWithReply = conversations.map(convo => {
    //         //         if (convo.id === activeConvId) {
    //         //             return {
    //         //                 ...convo,
    //         //                 messages: [
    //         //                     ...convo.messages,
    //         //                     {
    //         //                         id: convo.messages.length + 1,
    //         //                         sender: "me",
    //         //                         text: message,
    //         //                         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         //                         status: "sent"
    //         //                     },
    //         //                     {
    //         //                         id: convo.messages.length + 2,
    //         //                         sender: "them",
    //         //                         text: "I'll review this information and get back to you shortly. Thanks for the update.",
    //         //                         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         //                         status: "sent"
    //         //                     }
    //         //                 ]
    //         //             };
    //         //         }
    //         //         return convo;
    //         //     });

    //         //     setActiveConvo(updatedWithReply);
    //         // }, 2000);
    //     };
    //     const typingMutation = useMutation({
    //         mutationFn: () => typing(activeConvId),
    //         onMutate: () => {
    //             console.log("is working");
    //         }
    //     })
    //     const typingTimeoutRef = useRef(null);

    //     const handleTyping = (e) => {
    //         const {value} = e.target;
    //         handleInputChange(e,setMessage)

    //         if (value.length > 3) {
    //             // Clear any existing timeout to prevent overlap
    //             clearTimeout(typingTimeoutRef.current);

    //             // Start a new 300ms timer
    //             typingTimeoutRef.current = setTimeout(() => {
    //                 typingMutation.mutate();
    //             }, 300);
    //         }
    //     };
    //     return (
    //         <div className="bg-white border-t border-gray-200 p-3 md:p-4">
    //             <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
    //                 <div className="flex space-x-1 pl-2 md:pl-3">
    //                     <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors hidden sm:block">
    //                         <Image size={18} />
    //                     </button>
    //                 </div>
    //                 <input
    //                     ref={messageInputRef}
    //                     type="text"
    //                     name="content"
    //                     value={message.content}
    //                     onChange={handleTyping}
    //                     placeholder="Type a message"
    //                     className="flex-1 bg-transparent border-none py-3 px-2 md:px-3 focus:outline-none text-gray-800"
    //                     onKeyUp={handleKeyPress}
    //                 />
    //                 <div className="flex pr-2 md:pr-3">
    //                     <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
    //                         <Smile size={18} />
    //                     </button>
    //                     {message.content?.trim() ? (
    //                         <button
    //                             onClick={handleSendMessage}
    //                             className="p-1.5 rounded-md hover:bg-indigo-100 text-indigo-600 transition-colors"
    //                         >
    //                             <Send size={18} />
    //                         </button>
    //                     ) : (
    //                         <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
    //                             <Mic size={18} />
    //                         </button>
    //                     )}
    //                 </div>
    //             </div>

    //             {/* Typing indicator (optional) */}
    //             {isTyping && (
    //                 <div className="px-2 mt-1">
    //                     <p className="text-xs text-gray-500 italic">{participant?.profile.name} is typing...</p>
    //                 </div>
    //             )}
    //         </div>
    //     )
    // }
    useEffect(() => {
        if (!activeConvId) return;
        const chatChannelName = `chat.${activeConvId}`;
        const chatChannel = pusher.subscribe(chatChannelName);

        chatChannel.bind('message-sent', (data) => {
            console.log("Received via Pusher: ", data);
            // if (data.message.sender_id === user.id) return;
            queryClient.setQueryData(['conversations'], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        conversations: page.conversations.map(conv => {
                            if (conv.id === activeConvId) {
                                // Prepare new message
                                let newMessage = data.message;

                                // // If it's the current user's sent message, mark it as read
                                // if (data.message.sender_id === user.id) {
                                //     newMessage = {
                                //         ...newMessage,
                                //         read_at: new Date().toISOString()
                                //     };
                                // }

                                return {
                                    ...conv,
                                    messages: [...conv.messages, newMessage]
                                };
                            }
                            return conv;
                        })
                    }))
                };
            });

            // Scroll after state update
            scrollToBottom();
            messageInputRef.current?.focus();
        });


        // Cleanup
        return () => {
            pusher.unsubscribe(chatChannelName);
        };

    }, [activeConvId]);



    // If no conversation is selected, show empty state
    if (!activeConvId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center p-8 max-w-md">
                    <div className="bg-indigo-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Messages</h2>
                    <p className="text-gray-600 mb-6">Select a conversation from the sidebar to start chatting or create a new one.</p>
                    {!showSidebar && (
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <ChevronLeft size={16} className="mr-2" />
                            Show conversations
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Group messages by date
    const messageGroups = groupMessagesByDate(activeConvo?.messages || []);
    if (activeConvo) {
        return (
            <>
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
                                    {participant && (
                                        <ProfilePictureLink
                                            name={participant.profile.name}
                                            picture={participant.profile.picture}
                                            userId={participant.id}
                                        />
                                    )}
                                    {activeConvo?.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h2 className="font-medium text-gray-900">{participant?.profile.name}</h2>
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
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setShowRightPanel(!showRightPanel)}>
                                <Info size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 md:hidden">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50" id="messages-container">
                        <div className="flex flex-col space-y-6">
                            {messageGroups.map((group, groupIndex) => (
                                <div key={group.date} className="space-y-4">
                                    {/* Date separator */}
                                    <div className="flex justify-center mb-4">
                                        <div className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                            {group.separator}
                                        </div>
                                    </div>

                                    {/* Messages for this date */}
                                    {group.messages.map((message, index) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.sender_id === user.id ? 'ml-2' : ''}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl shadow-sm ${message.sender_id === user.id
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-800 border border-gray-100'
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                </div>
                                                <div className={`text-xs mt-1 ${message.sender_id === user.id ? 'text-right' : ''} text-gray-500`}>
                                                    {formatMessageTime(message.created_at)} {message.sender_id === user.id && <MessageStatus status={message.read_at !== null ? 'read' : 'sent'} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2  text-gray-800 rounded-bl-none">
                                                <div className="flex space-x-1 items-center h-6">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input code commented out in original */}
                    {/* Chat Input */}
                    <ChatInput activeConvId={activeConvId} isTyping={isTyping} setIsTyping={setIsTyping} conversations={conversations} />
                </div>
            </>
        )
    }
}