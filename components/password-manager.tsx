"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Lock } from "lucide-react"

interface PasswordEntry {
  password: string
  role: "admin" | "user"
}

export function PasswordManager() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<"admin" | "user">("user")
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("passwords")
    if (stored) {
      const passwordObj = JSON.parse(stored)
      const entries = Object.entries(passwordObj).map(([password, role]) => ({
        password,
        role: role as "admin" | "user",
      }))
      setPasswords(entries)
    }
  }, [])

  const handleAddPassword = () => {
    if (!newPassword || newPassword.trim() === "") {
      alert("Please enter a password")
      return
    }

    const stored = JSON.parse(localStorage.getItem("passwords") || "{}")

    if (stored[newPassword]) {
      alert("This password already exists")
      return
    }

    stored[newPassword] = newRole
    localStorage.setItem("passwords", JSON.stringify(stored))

    setPasswords([...passwords, { password: newPassword, role: newRole }])
    setNewPassword("")
    setNewRole("user")
    setShowForm(false)
  }

  const handleDeletePassword = (password: string) => {
    if (confirm(`Delete password: ${password}?`)) {
      const stored = JSON.parse(localStorage.getItem("passwords") || "{}")
      delete stored[password]
      localStorage.setItem("passwords", JSON.stringify(stored))
      setPasswords(passwords.filter((p) => p.password !== password))
    }
  }

  const handleChangeRole = (password: string, newRole: "admin" | "user") => {
    const stored = JSON.parse(localStorage.getItem("passwords") || "{}")
    stored[password] = newRole
    localStorage.setItem("passwords", JSON.stringify(stored))
    setPasswords(passwords.map((p) => (p.password === password ? { ...p, role: newRole } : p)))
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Passwords & Access Levels</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Password
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Access Level</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="user">User (View Only)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddPassword} className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Password
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setNewPassword("")
                  setNewRole("user")
                }}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Password</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Access Level</th>
                <th className="px-6 py-3 text-center font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {passwords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                    No passwords created yet
                  </td>
                </tr>
              ) : (
                passwords.map((entry) => (
                  <tr key={entry.password} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-mono text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      {entry.password}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={entry.role}
                        onChange={(e) => handleChangeRole(entry.password, e.target.value as "admin" | "user")}
                        className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button onClick={() => handleDeletePassword(entry.password)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-blue-900/20 border-blue-700/30 p-4">
        <p className="text-sm text-blue-200">
          <strong>Tip:</strong> Admin users can create and manage passwords. Regular users can only view inventory.
        </p>
      </Card>
    </div>
  )
}
