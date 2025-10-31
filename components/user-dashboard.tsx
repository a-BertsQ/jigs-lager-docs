"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { InventoryTable } from "@/components/inventory-table"
import { LogOut } from "lucide-react"

interface UserDashboardProps {
  onLogout: () => void
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [inventory, setInventory] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("inventory")
    const storedCategories = localStorage.getItem("categories")
    if (stored) {
      setInventory(JSON.parse(stored))
    }
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    }
  }, [])

  const handleInventoryUpdate = (updatedInventory: any[]) => {
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))
    setInventory(updatedInventory)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Burger Warehouse</h1>
            <p className="text-sm text-slate-400">Warehouse Staff</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <InventoryTable
          inventory={inventory}
          onUpdate={handleInventoryUpdate}
          isAdmin={false}
          categories={categories}
        />
      </main>
    </div>
  )
}
