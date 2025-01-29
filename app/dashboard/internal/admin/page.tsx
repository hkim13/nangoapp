'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ManageClientIntegrations from "../components/ManageClientIntegrations"

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState('')
  const [showIntegrations, setShowIntegrations] = useState(false)

  const handleManageIntegrations = (e: React.FormEvent) => {
    e.preventDefault()
    setShowIntegrations(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManageIntegrations} className="space-y-4">
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                Client Email
              </label>
              <div className="mt-1 flex space-x-2">
                <Input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter client email"
                  required
                />
                <Button type="submit">
                  Manage Integrations
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {showIntegrations && userEmail && (
        <ManageClientIntegrations userEmail={userEmail} />
      )}
    </div>
  )
}
