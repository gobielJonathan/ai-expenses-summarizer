import { findTransactions, findTransactionById, createTransaction } from './transactions.repository'
import { enqueueAiCategorization } from '../../infrastructure/queue'
import { NotFoundError } from '../../shared/errors'
import type { ListTransactionsQuery, CreateTransactionDto } from './transactions.schema'

export async function listTransactions(query: ListTransactionsQuery) {
  return findTransactions(query)
}

export async function getTransaction(id: string) {
  const tx = await findTransactionById(id)
  if (!tx) throw new NotFoundError('Transaction')
  return tx
}

export async function ingestTransaction(dto: CreateTransactionDto) {
  const tx = await createTransaction(dto)
  await enqueueAiCategorization({
    transactionId: tx.id,
    merchant: tx.merchant,
    amount: Number(tx.amount),
    bankType: tx.bankType,
  })
  return tx
}
