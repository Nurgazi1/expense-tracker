import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { z } from "zod";

const expenseSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
});

const updateExpenseSchema = expenseSchema.partial();

const app = new Hono();

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

const expenses = [
  {
    id: crypto.randomUUID(),
    description: "Cheezburger",
    amount: 15.99,
    date: "2023-06-01",
  },
  {
    id: crypto.randomUUID(),
    description: "Burger",
    amount: 13.99,
    date: "2023-05-03",
  },
  {
    id: crypto.randomUUID(),
    description: "Hotdog",
    amount: 10.99,
    date: "2023-08-02",
  },
  {
    id: crypto.randomUUID(),
    description: "French Fries",
    amount: 6.99,
    date: "2024-01-01",
  },
] satisfies Expense[];

app.get("/expenses", (c) => {
  return c.json(expenses);
});

app.get("/expenses/:id", (c) => {
  const id = c.req.param("id");
  const expense = expenses.find((expense) => expense.id === id);

  if (!expense) {
    return c.json({ error: "Expense not found" }, 404);
  }

  return c.json(expense);
});

app.post("/expenses", async (c) => {
  try {
    const body = await c.req.json();

    const data = expenseSchema.parse(body);

    const expense = {
      id: crypto.randomUUID(),
      ...data,
      date: new Date().toISOString().split("T")[0],
    };

    expenses.push(expense);

    return c.json(expense);
  } catch (error) {
    return c.json({ error: "Invalid expense data" }, 400);
  }
});

app.delete("/expenses/:id", (c) => {
  const id = c.req.param("id");

  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return c.json({ error: "Expense not found" }, 404);
  }

  const deletedExpense = expenses.splice(index, 1);

  return c.json(deletedExpense[0]);
});

app.patch("/expenses/:id", async (c) => {
  const id = c.req.param("id");

  const expense = expenses.find((expense) => expense.id === id);

  if (!expense) {
    return c.json({ error: "Expense not found" }, 404);
  }

  try {
    const body = await c.req.json();

    const data = updateExpenseSchema.parse(body);

    Object.assign(expense, data);

    return c.json(expense);
  } catch (error) {
    return c.json({ error: "Invalid expense data" }, 400);
  }
});

serve(app);
