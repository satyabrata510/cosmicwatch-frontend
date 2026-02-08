"use client";

/**
 * Chat Shell Component
 *
 * Provides the full chat experience, including room list, message history,
 * input area, and typing indicators. Manages socket connection and state.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Hash, Loader2, Menu, MessageCircle, Send, Wifi, WifiOff, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useWatchlistStore } from "@/stores/watchlist-store";
import MessageBubble from "./MessageBubble";
import RoomSelector from "./RoomSelector";

export default function ChatShell() {
  const toast = useToast();
  const {
    connected,
    currentRoom,
    messages,
    typingUsers,
    error,
    connect,
    disconnect,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChatStore();

  const user = useAuthStore((s) => s.user);
  const watchlistItems = useWatchlistStore((s) => s.items);
  const loadWatchlist = useWatchlistStore((s) => s.load);
  const { can } = usePermission();
  const canManageChat = can("chat", "manage");

  useEffect(() => {
    if (error) toast.error(error, "Chat");
  }, [error, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Connect on mount
  useEffect(() => {
    connect();
    loadWatchlist();
    return () => {
      disconnect();
    };
  }, [connect, disconnect, loadWatchlist]);

  // Auto-join general room
  useEffect(() => {
    if (connected && !currentRoom) {
      joinRoom("general");
    }
  }, [connected, currentRoom, joinRoom]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Build asteroid rooms from watchlist
  const asteroidRooms = watchlistItems.map((w) => ({
    id: `asteroid-${w.asteroidId}`,
    name: w.asteroidName,
  }));

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput("");
    stopTyping();
  }, [input, sendMessage, stopTyping]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      // Typing indicator with debounce
      startTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    },
    [startTyping, stopTyping]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Determine if consecutive messages from same user
  function shouldShowAvatar(idx: number) {
    if (idx === 0) return true;
    return messages[idx].userId !== messages[idx - 1].userId;
  }

  const roomLabel =
    currentRoom === "general"
      ? "General"
      : currentRoom === "risk-alerts"
        ? "Risk Alerts"
        : currentRoom?.startsWith("asteroid-")
          ? (watchlistItems.find((w) => `asteroid-${w.asteroidId}` === currentRoom)?.asteroidName ??
            currentRoom)
          : (currentRoom ?? "—");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
          Live Chat
        </h1>
        <p className="text-secondary text-sm font-body">
          Discuss asteroids, risks, and observations in real time
        </p>
        {canManageChat && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-body px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning">
            Moderator
          </span>
        )}
      </motion.div>

      {/* Chat container */}
      <motion.div
        className="rounded-2xl bg-card border border-border overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        style={{ height: "calc(100vh - 260px)", minHeight: 400 }}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                className="w-56 flex-shrink-0 border-r border-border p-3 overflow-y-auto hidden sm:block"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Connection status */}
                <div className="flex items-center gap-1.5 mb-4 px-2">
                  {connected ? (
                    <Wifi className="h-3 w-3 text-success" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-danger" />
                  )}
                  <span
                    className={`text-[10px] font-body ${
                      connected ? "text-success" : "text-danger"
                    }`}
                  >
                    {connected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <RoomSelector
                  currentRoom={currentRoom}
                  onJoin={joinRoom}
                  asteroidRooms={asteroidRooms}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-secondary hover:text-foreground transition-colors sm:block hidden"
              >
                {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Hash className="h-4 w-4 text-accent" />
              <span className="font-display text-sm text-foreground truncate">{roomLabel}</span>

              {/* Connection indicator (mobile) */}
              <div className="ml-auto sm:hidden flex items-center gap-1.5">
                {connected ? (
                  <Wifi className="h-3 w-3 text-success" />
                ) : (
                  <WifiOff className="h-3 w-3 text-danger" />
                )}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="px-4 py-2 bg-danger/5 border-b border-danger/20 text-danger text-xs font-body">
                {error}
              </div>
            )}

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {!connected && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto mb-3" />
                    <p className="text-secondary text-sm font-body">Connecting…</p>
                  </div>
                </div>
              )}

              {connected && messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-accent/20 mx-auto mb-3" />
                    <p className="text-secondary text-sm font-body">No messages yet — say hello!</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.userId === user?.id}
                  showAvatar={shouldShowAvatar(i)}
                  canModerate={canManageChat}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  className="px-4 py-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-[10px] text-muted font-body">
                    {typingUsers.length === 1
                      ? `${typingUsers[0].email} is typing…`
                      : `${typingUsers.length} people typing…`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={connected ? `Message #${roomLabel.toLowerCase()}…` : "Connecting…"}
                  disabled={!connected}
                  className="flex-1 bg-white/[0.04] border border-border rounded-xl px-4 py-2.5 text-sm text-foreground font-body placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!connected || !input.trim()}
                  className="rounded-xl bg-accent hover:bg-accent-hover text-background p-2.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
