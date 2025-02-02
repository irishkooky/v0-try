"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BankAccount } from "../types"

interface AccountManagerProps {
  onAddAccount: (account: BankAccount) => void
}

export default function AccountManager({ onAddAccount }: AccountManagerProps) {
  const [name, setName] = useState("")
  const [initialBalance, setInitialBalance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && initialBalance) {
      onAddAccount({
        id: Date.now().toString(),
        name,
        initialBalance: Number.parseFloat(initialBalance),
        transactions: [],
        recurringTransactions: [], // Initialize as an empty array
      })
      setName("")
      setInitialBalance("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">口座名</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="initialBalance">初期残高</Label>
        <Input
          id="initialBalance"
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          required
        />
      </div>
      <Button type="submit">口座を追加</Button>
    </form>
  )
}

