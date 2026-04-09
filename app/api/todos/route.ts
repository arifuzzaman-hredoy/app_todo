import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all todos
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(todos)
}

// CREATE todo
export async function POST(req: Request) {
  const body = await req.json()

  if (!body.title) {
    return Response.json({ error: "Title is required" }, { status: 400 })
  }

  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      description: typeof body.description === 'string' ? body.description : "",
      priority: typeof body.priority === 'string' ? body.priority : "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      tags:
        typeof body.tags === 'string'
          ? body.tags
          : Array.isArray(body.tags)
          ? body.tags.join(',')
          : "",
      completed: false
    }
  })

  return Response.json(todo)
}