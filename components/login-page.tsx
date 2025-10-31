"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: "admin" | "user") => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!password) {
      setError("Please enter a password")
      return
    }

    const passwords = JSON.parse(localStorage.getItem("passwords") || "{}")
    const role = passwords[password]

    if (role && (role === "admin" || role === "user")) {
      localStorage.setItem("warehouseSession", JSON.stringify({ role, password }))
      onLogin(role)
    } else {
      setError("Invalid password")
      setPassword("")
    }
  }

  const initializeDefaults = () => {
    const existing = localStorage.getItem("passwords")
    if (!existing) {
      const defaultPasswords = {
        admin123: "admin",
        user123: "user",
      }
      localStorage.setItem("passwords", JSON.stringify(defaultPasswords))
      setError("Default passwords initialized. Try: admin123 (admin) or user123 (user)")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Burger Warehouse</h1>
          <p className="text-slate-400 text-center mb-8">Inventory Management System</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-200">{error}</span>
              </div>
            )}

            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Login
            </Button>

            <Button
              onClick={initializeDefaults}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Initialize Demo Passwords
            </Button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">Demo: admin123 (Admin) • user123 (User)</p>
        </div>
      </Card>
    </div>
  )
}
