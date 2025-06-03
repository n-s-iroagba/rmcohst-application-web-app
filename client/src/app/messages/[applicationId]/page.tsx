"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Send, Paperclip, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "applicant" | "officer" | "hoa"
  content: string
  timestamp: string
  attachments?: { name: string; url: string }[]
  read: boolean
}

export default function MessagesPage() {
  const params = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            senderId: "officer1",
            senderName: "Dr. Sarah Johnson",
            senderRole: "officer",
            content:
              "Hello John, I've reviewed your application. Could you please provide a clearer copy of your WAEC certificate?",
            timestamp: "2024-01-15T10:30:00Z",
            read: true,
          },
          {
            id: "2",
            senderId: "applicant1",
            senderName: "John Doe",
            senderRole: "applicant",
            content:
              "Good morning Dr. Johnson. I'll upload a new copy right away. Thank you for reviewing my application.",
            timestamp: "2024-01-15T11:15:00Z",
            read: true,
          },
          {
            id: "3",
            senderId: "applicant1",
            senderName: "John Doe",
            senderRole: "applicant",
            content: "I've uploaded the new WAEC certificate. Please let me know if you need anything else.",
            timestamp: "2024-01-15T11:45:00Z",
            attachments: [{ name: "WAEC_Certificate_Updated.pdf", url: "#" }],
            read: false,
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      senderName: "Current User",
      senderRole: "applicant",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Application Messages</h1>
              <p className="text-sm text-gray-500">Application #{params.applicationId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: "calc(100vh - 200px)" }}>
        {messages.map((message, index) => {
          const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)
          const isCurrentUser = message.senderId === "current-user"

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}

              <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? "order-2" : "order-1"}`}>
                  {!isCurrentUser && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {message.senderName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                      <span className="text-xs text-gray-500 capitalize">{message.senderRole}</span>
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white"
                        : message.senderRole === "officer"
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.attachments && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center space-x-2 p-2 rounded ${
                              isCurrentUser ? "bg-blue-700" : "bg-white"
                            }`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span className="text-xs">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`text-xs mt-1 ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
