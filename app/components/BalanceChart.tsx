"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { BankAccount } from "../types"

interface BalanceChartProps {
  accounts: BankAccount[]
}

export default function BalanceChart({ accounts }: BalanceChartProps) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"]

  const getData = () => {
    const allDates = accounts.flatMap((account) =>
      [{ date: account.transactions[0]?.date || "", balance: account.initialBalance }, ...account.transactions].map(
        (t) => t.date,
      ),
    )
    const uniqueDates = Array.from(new Set(allDates)).sort()

    return uniqueDates.map((date) => {
      const dataPoint: { [key: string]: any } = { date }
      accounts.forEach((account) => {
        const balance = getBalanceAtDate(account, date)
        dataPoint[account.name] = balance
      })
      return dataPoint
    })
  }

  const getBalanceAtDate = (account: BankAccount, date: string) => {
    let balance = account.initialBalance
    for (const transaction of account.transactions) {
      if (transaction.date <= date) {
        balance += transaction.type === "income" ? transaction.amount : -transaction.amount
      } else {
        break
      }
    }
    return balance
  }

  const data = getData()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {accounts.map((account, index) => (
          <Line key={account.id} type="monotone" dataKey={account.name} stroke={colors[index % colors.length]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

