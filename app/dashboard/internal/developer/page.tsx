'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeveloperDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Developer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Developer</p>
        </CardContent>
      </Card>
    </div>
  )
}
