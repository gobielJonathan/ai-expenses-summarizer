import fs from 'fs/promises'
import path from 'path'
import dayjs from 'dayjs'
import { env } from '../../config/env'
import { findStatements, findStatementById, createStatement } from './statements.repository'
import { enqueuePdfParsing } from '../../infrastructure/queue'
import { NotFoundError } from '../../shared/errors'
import type { UploadStatementDto, ListStatementsQuery } from './statements.schema'

export async function listStatements(query: ListStatementsQuery) {
  return findStatements(query)
}

export async function getStatement(id: string) {
  const stmt = await findStatementById(id)
  if (!stmt) throw new NotFoundError('Statement')
  return stmt
}

export async function serveStatementFile(id: string): Promise<{ filePath: string; fileName: string }> {
  const stmt = await findStatementById(id)
  if (!stmt) throw new NotFoundError('Statement')

  await fs.access(stmt.pdfPath)
  const fileName = path.basename(stmt.pdfPath)
  return { filePath: stmt.pdfPath, fileName }
}

export async function uploadStatement(dto: UploadStatementDto, fileBuffer: Buffer, originalName: string) {
  const dir = path.resolve(env.STATEMENTS_DIR)
  await fs.mkdir(dir, { recursive: true })

  const fileName = `${dto.bankType}_${dto.statementMonth}_${Date.now()}${path.extname(originalName)}`
  const filePath = path.join(dir, fileName)
  await fs.writeFile(filePath, fileBuffer)

  const statementMonth = dayjs(`${dto.statementMonth}-01`).toDate()
  const statement = await createStatement({ bankType: dto.bankType, statementMonth, pdfPath: filePath })

  await enqueuePdfParsing({ statementId: statement.id, pdfPath: filePath, bankType: dto.bankType })

  return statement
}
