export interface Transaction {
  id: string
  date: string
  amount: number
  type: "expense" | "income"
  description: string
}

export interface RecurringTransaction {
  id: string
  day: number
  amount: number
  type: "expense" | "income"
  description: string
}

export interface BankAccount {
  id: string
  name: string
  initialBalance: number
  transactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
}

