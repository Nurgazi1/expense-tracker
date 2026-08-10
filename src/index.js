import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

const expenses = [
    {
    id: 1,
    description: 'Cheezburger',
    amount: 15.99,
    date: '2023-06-01',
    },
    {
    id: 2,
    description: 'Burger',
    amount: 13.99,
    date: '2023-05-03',
    },
    {
    id: 3,
    description: 'Hotdog',
    amount: 10.99,
    date: '2023-08-02',
    },
    {
    id: 4,
    description: 'French Fries',
    amount: 6.99,
    date: '2024-01-01',
    }

]

 

app.get('/expenses', (c) => {
    return c.json(expenses)
})

app.post('/expenses', async (c) => {
    const body = await c.req.json()

    const expense = {
        id: expenses.length + 1,
        description: body.description,
        amount: body.amount,
        date: body.date,
    }

    expenses.push(expense)

    return c.json(expenses)
})

app.delete('/expenses/:id', (c) => {
    const id = Number(c.req.param('id'))

    const index = expenses.findIndex(expense => expense.id === id)

    if (index === -1) {
        return c.json({ error: 'Expense not found' }, 404)
    }
    
    const deletedExpense = expenses.splice(index, 1)

    return c.json(deletedExpense[0])
})

app.patch('/expenses/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    const expense = expenses.find(expense => expense.id === id)

    if (!expense) {
        return c.json({ error: 'Expense not found' }, 404)
    }

    if (body.description !== undefined) {
        expense.description = body.description
    }

    if (body.amount !== undefined) {
        expense.amount = body.amount
    }

    if (body.date !== undefined) {
        expense.date = body.date
    }

    return c.json(expense)
})


serve(app)





