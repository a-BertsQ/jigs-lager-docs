import jsPDF from "jspdf"
import "jspdf-autotable"

export function exportToPDF(inventory: any[], categories: any[] = []) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 10

  // Header
  doc.setFontSize(18)
  doc.text("Burger Warehouse Inventory Report", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 10

  // Date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 10

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]))

  if (inventory.length === 0) {
    doc.setFontSize(12)
    doc.text("No inventory items", pageWidth / 2, yPosition, { align: "center" })
    doc.save("inventory_report.pdf")
    return
  }

  // Group by category
  const groupedByCategory = categories.map((cat) => ({
    name: cat.name,
    items: inventory.filter((item) => item.category === cat.id),
  }))

  groupedByCategory.forEach((group, index) => {
    if (group.items.length === 0) return

    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage()
      yPosition = 10
    }

    // Category title
    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text(group.name, 10, yPosition)
    yPosition += 8

    // Table data
    const tableData = group.items.map((item) => [
      item.name,
      item.warehouseQty.toString(),
      item.restaurantQty.toString(),
      (item.warehouseQty + item.restaurantQty).toString(),
      item.reorderLevel.toString(),
      `$${item.cost.toFixed(2)}`,
      item.expiryDate,
      item.lastEdited ? new Date(item.lastEdited).toLocaleDateString() : "N/A",
    ])
    ;(doc as any).autoTable({
      startY: yPosition,
      head: [["Item", "Warehouse", "Restaurant", "Total", "Reorder Lvl", "Cost/Unit", "Expiry", "Last Edited"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 9,
      },
      margin: { left: 10, right: 10 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10
  })

  // Summary
  if (yPosition > pageHeight - 30) {
    doc.addPage()
    yPosition = 10
  }

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Summary", 10, yPosition)
  yPosition += 8

  const totalValue = inventory.reduce((sum, item) => sum + (item.warehouseQty + item.restaurantQty) * item.cost, 0)
  const lowStockCount = inventory.filter((item) => item.warehouseQty + item.restaurantQty <= item.reorderLevel).length

  const summaryData = [
    ["Total Items", inventory.length.toString()],
    ["Total Inventory Value", `$${totalValue.toFixed(2)}`],
    ["Low Stock Items", lowStockCount.toString()],
  ]
  ;(doc as any).autoTable({
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
    },
    margin: { left: 10, right: 10 },
  })

  doc.save("inventory_report.pdf")
}
