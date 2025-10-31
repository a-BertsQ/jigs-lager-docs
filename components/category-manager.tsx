"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Edit2 } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface CategoryManagerProps {
  categories: Category[]
  onUpdate: (categories: Category[]) => void
}

export function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleAddCategory = () => {
    setFormData("")
    setEditingId(null)
    setShowForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setFormData(category.name)
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleSaveCategory = () => {
    if (!formData.trim()) {
      alert("Please enter a category name")
      return
    }

    if (editingId) {
      const updated = categories.map((cat) => (cat.id === editingId ? { ...cat, name: formData } : cat))
      onUpdate(updated)
    } else {
      onUpdate([
        ...categories,
        {
          id: Date.now().toString(),
          name: formData,
        },
      ])
    }

    setShowForm(false)
    setFormData("")
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      onUpdate(categories.filter((cat) => cat.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{editingId ? "Edit Category" : "Add New Category"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category Name *</label>
              <Input
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                placeholder="e.g., Burger, Beilagen, Beverages"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveCategory} className="bg-green-600 hover:bg-green-700">
                Save Category
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setFormData("")
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
          <table className="w-full text-sm">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-200">Category Name</th>
                <th className="px-6 py-3 text-center font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                    No categories yet
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-slate-200 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Button
                        onClick={() => handleEditCategory(category)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteCategory(category.id)} size="sm" variant="destructive">
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
    </div>
  )
}
