'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuperAdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Super Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Super Admin</p>
        </CardContent>
      </Card>
    </div>
  )
}
