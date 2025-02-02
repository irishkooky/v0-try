"use client"

import { useState, useEffect, useCallback } from "react"
import AccountManager from "./components/AccountManager"
import TransactionForm from "./components/TransactionForm"
import RecurringTransactionForm from "./components/RecurringTransactionForm"
import BalanceChart from "./components/BalanceChart"
import type { BankAccount, Transaction, RecurringTransaction } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const createNewTransaction = (rt: RecurringTransaction, date: Date): Transaction => ({
  id: Date.now().toString(),
  date: date.toISOString().split("T")[0],
  amount: rt.amount,
  type: rt.type,
  description: rt.description,
})

export default function Home() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const savedAccounts = localStorage.getItem("bankAccounts")
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }
  }, [])

  // アカウントが更新されるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("bankAccounts", JSON.stringify(accounts))
  }, [accounts])

  const addAccount = (account: BankAccount) => {
    setAccounts((prevAccounts) => [
      ...prevAccounts,
      {
        ...account,
        transactions: [],
        recurringTransactions: [],
      },
    ])
  }

  const addTransaction = (accountId: string, transaction: Transaction) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            transactions: [...account.transactions, transaction].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
          }
        }
        return account
      }),
    )
  }

  const addRecurringTransaction = (accountId: string, recurringTransaction: RecurringTransaction) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            recurringTransactions: [...(account.recurringTransactions || []), recurringTransaction],
          }
        }
        return account
      }),
    )
  }

  const processRecurringTransactions = useCallback(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => {
        const recurringTransactions = account.recurringTransactions || []
        const newTransactions = recurringTransactions.flatMap((rt) => {
          const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
          const transactionDay = Math.min(rt.day, lastDayOfMonth)
          const transactionDate = new Date(currentYear, currentMonth, transactionDay)

          if (
            transactionDate <= today &&
            !account.transactions.some(
              (t) =>
                t.date === transactionDate.toISOString().split("T")[0] &&
                t.amount === rt.amount &&
                t.type === rt.type &&
                t.description === rt.description,
            )
          ) {
            return [createNewTransaction(rt, transactionDate)]
          }
          return []
        })

        if (newTransactions.length === 0) return account

        return {
          ...account,
          transactions: [...account.transactions, ...newTransactions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        }
      }),
    )
  }, [])

  useEffect(() => {
    processRecurringTransactions()
    const interval = setInterval(processRecurringTransactions, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [processRecurringTransactions])

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">銀行口座管理アプリ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>口座管理</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountManager onAddAccount={addAccount} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>残高推移グラフ</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceChart accounts={accounts} />
          </CardContent>
        </Card>
      </div>
      <Tabs className="mt-4">
        <TabsList>
          {accounts.map((account) => (
            <TabsTrigger key={account.id} value={account.id}>
              {account.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account) => (
          <TabsContent key={account.id} value={account.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{account.name} - 取引登録</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm accountId={account.id} onAddTransaction={addTransaction} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{account.name} - 定期取引登録</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecurringTransactionForm
                    accountId={account.id}
                    onAddRecurringTransaction={addRecurringTransaction}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}

