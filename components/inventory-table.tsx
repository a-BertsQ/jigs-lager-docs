"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { exportToPDF } from "@/lib/pdf-export"

interface InventoryItem {
  id: string
  name: string
  category: string
  warehouseQty: number
  restaurantQty: number
  unit: string
  reorderLevel: number
  purchaseDate: string
  lastEdited: string
}

interface InventoryTableProps {
  inventory: InventoryItem[]
  onUpdate: (inventory: InventoryItem[]) => void
  isAdmin: boolean
  categories: any[]
}

export function InventoryTable({ inventory, onUpdate, isAdmin, categories }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<InventoryItem>>({})
  const [showForm, setShowForm] = useState(false)

  const handleAddItem = () => {
    setFormData({
      id: Date.now().toString(),
      name: "",
      category: categories.length > 0 ? categories[0].id : "",
      warehouseQty: 0,
      restaurantQty: 0,
      unit: "pieces",
      reorderLevel: 0,
      purchaseDate: new Date().toISOString().split("T")[0],
      lastEdited: new Date().toISOString(),
    })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEditItem = (item: InventoryItem) => {
    setFormData(item)
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSaveItem = () => {
    if (!formData.name || formData.name.trim() === "") {
      alert("Please enter an item name")
      return
    }

    const itemToSave = {
      ...formData,
      lastEdited: new Date().toISOString(),
    }

    if (editingId) {
      const updated = inventory.map((item) => (item.id === editingId ? { ...item, ...itemToSave } : item))
      onUpdate(updated)
    } else {
      onUpdate([...inventory, itemToSave as InventoryItem])
    }

    setShowForm(false)
    setFormData({})
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      onUpdate(inventory.filter((item) => item.id !== id))
    }
  }

  const lowStockItems = inventory.filter((item) => item.warehouseQty + item.restaurantQty <= item.reorderLevel)
  

  const itemsByCategory = categories.map((cat) => ({
    category: cat,
    items: inventory.filter((item) => item.category === cat.id),
  }))

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + " " + date.toLocaleTimeString('de-DE', { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm mb-2">Total Items</p>
          <p className="text-3xl font-bold text-white">{inventory.length}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <p className="text-slate-400 text-sm mb-2">Low Stock Items</p>
          <p className="text-3xl font-bold text-orange-500">{lowStockItems.length}</p>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="bg-orange-900/20 border-orange-700/30 p-4">
          <div className="flex gap-3">
            <div className="text-orange-500 text-2xl flex-shrink-0">⚠️</div>
            <div>
              <p className="font-semibold text-orange-200 mb-2">Low Stock Alert</p>
              <ul className="text-sm text-orange-100 space-y-1">
                {lowStockItems.map((item) => (
                  <li key={item.id}>
                    {item.name} - Total: {item.warehouseQty + item.restaurantQty} ({item.unit})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white">
          + Add Item
        </Button>
        <Button onClick={() => exportToPDF(inventory, categories)} className="bg-blue-600 hover:bg-blue-700 text-white">
          📥 Export to PDF
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{editingId ? "Edit Item" : "Add New Item"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Item Name *</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Beef Patties"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unit</label>
              <Input
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., pieces, kg, liters"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Warehouse Qty</label>
              <Input
                type="number"
                value={formData.warehouseQty || 0}
                onChange={(e) => setFormData({ ...formData, warehouseQty: Number.parseInt(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Restaurant Qty</label>
              <Input
                type="number"
                value={formData.restaurantQty || 0}
                onChange={(e) => setFormData({ ...formData, restaurantQty: Number.parseInt(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Reorder Level</label>
              <Input
                type="number"
                value={formData.reorderLevel || 0}
                onChange={(e) => setFormData({ ...formData, reorderLevel: Number.parseInt(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Purchase Date</label>
              <Input
                type="date"
                value={formData.purchaseDate || ""}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveItem} className="bg-green-600 hover:bg-green-700">
              Save Item
            </Button>
            <Button
              onClick={() => {
                setShowForm(false)
                setFormData({})
              }}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {itemsByCategory.map((categoryGroup) => (
        <Card key={categoryGroup.category.id} className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="bg-slate-700 px-6 py-3 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white">{categoryGroup.category.name}</h3>
            <p className="text-sm text-slate-400">{categoryGroup.items.length} items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-200">Item Name</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Lager</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Restaurant</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Total</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Reorder Level</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Last Edited</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {categoryGroup.items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                      No items in this category
                    </td>
                  </tr>
                ) : (
                  categoryGroup.items.map((item) => {
                    const total = item.warehouseQty + item.restaurantQty
                    const isLowStock = total <= item.reorderLevel
                    return (
                      <tr key={item.id} className={isLowStock ? "bg-orange-900/10" : "hover:bg-slate-700/50"}>
                        <td className="px-6 py-4 text-slate-200 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-center text-slate-300">{item.warehouseQty}</td>
                        <td className="px-6 py-4 text-center text-slate-300">{item.restaurantQty}</td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-100">{total}</td>
                        <td className="px-6 py-4 text-center text-slate-300">{item.reorderLevel}</td>
                        <td className="px-6 py-4 text-center text-slate-300 text-xs">{formatDate(item.lastEdited)}</td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <Button
                            onClick={() => handleEditItem(item)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </Button>
                          <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive">
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
