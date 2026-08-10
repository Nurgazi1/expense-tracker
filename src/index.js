import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

const expenses = []

const expense = {
    id: 1,
    description: 'Lunch',
    amount: 15.99,
    date: '2023-06-01',
}

expenses.push(expense)


app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.get('/expenses', (c) => {
    return c.json(expenses)
})


serve(app)





