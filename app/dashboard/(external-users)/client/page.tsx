'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClientDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client</p>
        </CardContent>
      </Card>
    </div>
  )
}
