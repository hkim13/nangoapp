'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FreeDashboard() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Free Client Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Free client</p>
        </CardContent>
      </Card>
    </div>
  )
}
