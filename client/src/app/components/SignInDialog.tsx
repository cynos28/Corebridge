"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignInCredentials, UserRole } from '../types/auth'

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (credentials: SignInCredentials) => void;
}

export default function SignInDialog({ isOpen, onClose, onSignIn }: SignInDialogProps) {
  const [credentials, setCredentials] = useState<SignInCredentials>({
    username: '',
    password: '',
    role: 'student'
  });

  const roles: UserRole[] = ['student', 'teacher', 'admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(credentials);

    // Store the role in localStorage for role-based redirection
    localStorage.setItem("user-role", credentials.role);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#ba9df1] mb-6">Sign In to Corebridge</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username/ID</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none"
                  value={credentials.username}
                  onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none"
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(role => (
                    <button
                      key={role}
                      type="button"
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        credentials.role === role
                          ? 'bg-[#ba9df1] text-white border-[#ba9df1]'
                          : 'border-gray-300 hover:border-[#ba9df1]'
                      }`}
                      onClick={() => setCredentials({ ...credentials, role })}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#ba9df1] text-white py-2 rounded-lg font-medium hover:bg-[#a78be0] transition-colors"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
