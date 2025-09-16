const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(compression())

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving
app.use(express.static(path.join(__dirname, '../client/build')))

// API Routes
app.use('/api/templates', require('./routes/templates'))
app.use('/api/ide', require('./routes/ide'))
app.use('/api/compliance', require('./routes/compliance'))
app.use('/api/smartcontracts', require('./routes/smartcontracts'))
app.use('/api/nft', require('./routes/nft'))
app.use('/api/boilerplates', require('./routes/boilerplates'))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'gTek SaaS Global Enterprise Templates'
  })
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 gTek SaaS Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🎯 API available at: http://localhost:${PORT}/api`)
})

module.exports = app