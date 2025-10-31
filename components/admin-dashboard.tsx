"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryTable } from "@/components/inventory-table"
import { PasswordManager } from "@/components/password-manager"
import { CategoryManager } from "@/components/category-manager"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [inventory, setInventory] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedInventory = localStorage.getItem("inventory")
    const storedCategories = localStorage.getItem("categories")

    if (storedInventory) {
      setInventory(JSON.parse(storedInventory))
    } else {
      initializeSampleData()
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      initializeSampleCategories()
    }
  }, [])

  const initializeSampleCategories = () => {
    const sampleCategories = [
      { id: "1", name: "Burger" },
      { id: "2", name: "Beilagen" },
      { id: "3", name: "Beverages" },
      { id: "4", name: "Sauces" },
    ]
    localStorage.setItem("categories", JSON.stringify(sampleCategories))
    setCategories(sampleCategories)
  }

  const initializeSampleData = () => {
    const sampleItems = [
      {
        id: "1",
        name: "Beef Patties",
        category: "1",
        warehouseQty: 500,
        restaurantQty: 50,
        unit: "pieces",
        reorderLevel: 100,
        cost: 2.5,
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        lastEdited: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Burger Buns",
        category: "1",
        warehouseQty: 1000,
        restaurantQty: 100,
        unit: "pieces",
        reorderLevel: 200,
        cost: 0.5,
        purchaseDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        lastEdited: new Date().toISOString(),
      },
    ]
    localStorage.setItem("inventory", JSON.stringify(sampleItems))
    setInventory(sampleItems)
  }

  const handleInventoryUpdate = (updatedInventory: any[]) => {
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))
    setInventory(updatedInventory)
  }

  const handleCategoriesUpdate = (updatedCategories: any[]) => {
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">JiGs Lager and Logistik</h1>
            <p className="text-sm text-slate-400">Admin Dashboard</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <span className="w-4 h-4 mr-2">🚪</span>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-600">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">
              Manage Categories
            </TabsTrigger>
            <TabsTrigger value="passwords" className="data-[state=active]:bg-blue-600">
              Manage Passwords
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryTable
              inventory={inventory}
              onUpdate={handleInventoryUpdate}
              isAdmin={true}
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager categories={categories} onUpdate={handleCategoriesUpdate} />
          </TabsContent>

          <TabsContent value="passwords">
            <PasswordManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
