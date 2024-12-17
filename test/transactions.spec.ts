import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest' 
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {


  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('the user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
     const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      })

      const cookies = createTransactionResponse.get('set-cookie') as string;

      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000,
        })
      ])
  })

  it('should be able to get list a specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
       type: 'credit'
       })    

      const cookies = createTransactionResponse.get('set-cookie') as string;

      const listTransactionsResponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

      const transactionId = listTransactionsResponse.body.transactions[0].id  

      const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

      expect(getTransactionResponse.body.transactions).toEqual(
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000,
        })
      )

  })

})
