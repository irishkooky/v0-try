"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BalanceEntry } from "../types"

interface BalanceFormProps {
  onAddBalance: (entry: BalanceEntry) => void
}

export default function BalanceForm({ onAddBalance }: BalanceFormProps) {
  const [date, setDate] = useState("")
  const [balance, setBalance] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && balance) {
      onAddBalance({ date, balance: Number.parseFloat(balance) })
      setDate("")
      setBalance("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">日付</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="balance">残高</Label>
        <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} required />
      </div>
      <Button type="submit">追加</Button>
    </form>
  )
}

