"use client";

/**
 * Room Selector Component
 *
 * A sidebar/top-bar component for selecting chat rooms.
 * Supports default rooms and dynamic asteroid-specific rooms.
 */

import { AlertTriangle, Hash, Orbit } from "lucide-react";

const DEFAULT_ROOMS = [
  { id: "general", label: "General", icon: Hash, desc: "Open discussion" },
  { id: "risk-alerts", label: "Risk Alerts", icon: AlertTriangle, desc: "Hazard warnings" },
];

interface Props {
  currentRoom: string | null;
  onJoin: (roomId: string) => void;
  asteroidRooms?: { id: string; name: string }[];
}

export default function RoomSelector({ currentRoom, onJoin, asteroidRooms = [] }: Props) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted uppercase tracking-wider font-body px-2 mb-2">
        Channels
      </p>

      {DEFAULT_ROOMS.map((room) => {
        const Icon = room.icon;
        const active = currentRoom === room.id;
        return (
          <button
            key={room.id}
            onClick={() => onJoin(room.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-xs font-body ${
              active
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "text-secondary hover:text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="truncate">{room.label}</p>
              <p className="text-[9px] text-muted truncate">{room.desc}</p>
            </div>
          </button>
        );
      })}

      {asteroidRooms.length > 0 && (
        <>
          <div className="my-3 border-t border-border" />
          <p className="text-[10px] text-muted uppercase tracking-wider font-body px-2 mb-2">
            Asteroids
          </p>
          {asteroidRooms.map((room) => {
            const active = currentRoom === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onJoin(room.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-xs font-body ${
                  active
                    ? "bg-accent/10 border border-accent/20 text-accent"
                    : "text-secondary hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <Orbit className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{room.name}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
