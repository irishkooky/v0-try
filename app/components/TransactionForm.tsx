"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "../types"

interface TransactionFormProps {
  accountId: string
  onAddTransaction: (accountId: string, transaction: Transaction) => void
}

export default function TransactionForm({ accountId, onAddTransaction }: TransactionFormProps) {
  const [date, setDate] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"expense" | "income">("expense")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && amount && type && description) {
      onAddTransaction(accountId, {
        id: Date.now().toString(),
        date,
        amount: Number.parseFloat(amount),
        type,
        description,
      })
      setDate("")
      setAmount("")
      setType("expense")
      setDescription("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">日付</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
      <Button type="submit">取引を追加</Button>
    </form>
  )
}

