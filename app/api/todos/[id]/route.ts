import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// UPDATE todo
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const todoId = Number(id)

  // ❗ FIX: validate id properly
  if (isNaN(todoId)) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 })
  }

  const body = await req.json()

  try {
    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        tags: Array.isArray(body.tags)
          ? body.tags.join(',')
          : typeof body.tags === 'string'
          ? body.tags
          : undefined,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 })
  }
}

// DELETE todo
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const todoId = Number(id)

  if (isNaN(todoId)) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 })
  }

  try {
    await prisma.todo.delete({
      where: { id: todoId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 })
  }
}