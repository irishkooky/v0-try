"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RecurringTransaction } from "../types"

interface RecurringTransactionFormProps {
  accountId: string
  onAddRecurringTransaction: (accountId: string, transaction: RecurringTransaction) => void
}

export default function RecurringTransactionForm({
  accountId,
  onAddRecurringTransaction,
}: RecurringTransactionFormProps) {
  const [day, setDay] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (day && amount && type && description) {
      onAddRecurringTransaction(accountId, {
        id: Date.now().toString(),
        day: Number.parseInt(day),
        amount: Number.parseFloat(amount),
        type,
        description,
      })
      setDay("")
      setAmount("")
      setType("expense")
      setDescription("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="day">毎月の日付</Label>
        <Input id="day" type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="amount">金額</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="type">種類</Label>
        <Select value={type} onValueChange={(value: "expense" | "income") => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="種類を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">引き落とし</SelectItem>
            <SelectItem value="income">入金</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">説明</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <Button type="submit">定期取引を追加</Button>
    </form>
  )
}

