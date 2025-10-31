"use client"

import { useEffect, useState } from "react"
import { LoginPage } from "@/components/login-page"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserDashboard } from "@/components/user-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("warehouseSession")
    if (stored) {
      const session = JSON.parse(stored)
      setIsLoggedIn(true)
      setUserRole(session.role)
    }
  }, [])

  if (!mounted) return null

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={(role) => {
          setIsLoggedIn(true)
          setUserRole(role)
        }}
      />
    )
  }

  return userRole === "admin" ? (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem("warehouseSession")
        setIsLoggedIn(false)
        setUserRole(null)
      }}
    />
  ) : (
    <UserDashboard
      onLogout={() => {
        localStorage.removeItem("warehouseSession")
        setIsLoggedIn(false)
        setUserRole(null)
      }}
    />
  )
}
