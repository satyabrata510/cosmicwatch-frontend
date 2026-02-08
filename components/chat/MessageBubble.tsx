"use client";

/**
 * Message Bubble Component
 *
 * Displays a single chat message with user avatar, content, and timestamp.
 * Handles styling for own messages vs. others' messages.
 */

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { ChatMessage } from "@/types";

interface Props {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  canModerate?: boolean;
}

export default function MessageBubble({ message, isOwn, showAvatar, canModerate = false }: Props) {
  const initials = (message.user?.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar */}
      {showAvatar ? (
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-display ${
            isOwn ? "bg-accent/20 text-accent" : "bg-white/[0.06] text-secondary"
          }`}
        >
          {message.user?.avatar ? (
            <img
              src={message.user.avatar}
              alt={message.user.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}

      {/* Bubble */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {showAvatar && !isOwn && (
          <p className="text-[10px] text-muted font-body mb-0.5 ml-1">
            {message.user?.name ?? "Unknown"}
          </p>
        )}

        <div
          className={`px-3 py-2 rounded-2xl text-sm font-body leading-relaxed ${
            isOwn
              ? "bg-accent text-background rounded-br-md"
              : "bg-white/[0.06] text-foreground border border-border rounded-bl-md"
          }`}
        >
          {message.content}
        </div>

        <div className={`flex items-center gap-1.5 mt-0.5 ${isOwn ? "justify-end mr-1" : "ml-1"}`}>
          <p className="text-[9px] text-muted font-body">{formatTime(message.createdAt)}</p>
          {canModerate && !isOwn && (
            <button
              className="text-[9px] text-danger/50 hover:text-danger transition-colors"
              title="Delete message (moderator)"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}
