import { it, beforeAll, afterAll } from 'vitest'
import { app } from '../src/app'
import request from 'supertest' 

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
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