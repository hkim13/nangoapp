'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PremiumDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Premium Client Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Premium client</p>
        </CardContent>
      </Card>
    </div>
  )
}
