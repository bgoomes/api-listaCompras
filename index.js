const express = require('express')
const bodyParser = require('body-parser')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany()
  res.json(products)
})

app.post('/products', async (req, res) => {
  const { name, price } = req.body
  if (!name || !price) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios.' })
  }

  try {
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price) },
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto.' })
  }
})

// PUT - Editar um produto existente
app.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const { name, price } = req.body

  if (!name || !price) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios.' })
  }

  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price: parseFloat(price) },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto.' })
  }
})

// DELETE - Deletar um produto
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto.' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})