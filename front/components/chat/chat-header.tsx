'use client';

import { Chat, UserRole } from '@/types/chat';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Users, CheckCircle2, UserPlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatHeaderProps {
  chat: Chat;
  currentUserRole: UserRole;
  onBack: () => void;
  onClose?: () => void;
  onTransfer?: () => void;
  onAssign?: () => void;
}

export const ChatHeader = ({ chat, currentUserRole, onBack, onClose, onTransfer, onAssign }: ChatHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const otherUser = currentUserRole === 'CLIENT' ? chat.advisor : chat.client;
  const canManageChat = currentUserRole !== 'CLIENT' && chat.status !== 'CLOSED';

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-semibold">
              {otherUser?.firstName?.[0]}
              {otherUser?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {otherUser?.firstName} {otherUser?.lastName}
              </h3>
              <p className="text-xs text-gray-500">
                {chat.status === 'ACTIVE' ? 'En ligne' : chat.status === 'CLOSED' ? 'Conversation fermée' : 'En attente'}
              </p>
            </div>
          </div>
        </div>

        {canManageChat && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-10"
              >
                {/* Options pour ADVISOR */}
                {currentUserRole === 'ADVISOR' && (
                  <>
                    {onTransfer && (
                      <button
                        onClick={() => {
                          onTransfer();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <Users className="h-4 w-4" />
                        Transférer la conversation
                      </button>
                    )}
                    {onClose && chat.status === 'ACTIVE' && (
                      <button
                        onClick={() => {
                          onClose();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Fermer la conversation
                      </button>
                    )}
                  </>
                )}

                {/* Options pour DIRECTOR */}
                {currentUserRole === 'DIRECTOR' && (
                  <>
                    {onAssign && (
                      <button
                        onClick={() => {
                          onAssign();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <UserPlus className="h-4 w-4" />
                        Assigner un conseiller
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {chat.status === 'CLOSED' && (
        <div className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Cette conversation est fermée
          </p>
        </div>
      )}
    </div>
  );
};
