const request = require('supertest')
const app = require('../src/server/index')

describe('API Health Check', () => {
  test('GET /api/health should return OK status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200)
    
    expect(response.body).toHaveProperty('status', 'OK')
    expect(response.body).toHaveProperty('service', 'gTek SaaS Global Enterprise Templates')
    expect(response.body).toHaveProperty('timestamp')
  })
})

describe('Templates API', () => {
  test('GET /api/templates/categories should return template categories', async () => {
    const response = await request(app)
      .get('/api/templates/categories')
      .expect(200)
    
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('categories')
    expect(response.body).toHaveProperty('data')
    expect(response.body.categories).toContain('business')
    expect(response.body.categories).toContain('technical')
    expect(response.body.categories).toContain('compliance')
    expect(response.body.categories).toContain('cosmic')
  })

  test('GET /api/templates/category/business should return business templates', async () => {
    const response = await request(app)
      .get('/api/templates/category/business')
      .expect(200)
    
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('category', 'business')
    expect(response.body).toHaveProperty('templates')
    expect(Array.isArray(response.body.templates)).toBe(true)
  })

  test('POST /api/templates/generate should generate a template', async () => {
    const templateRequest = {
      category: 'business',
      templateType: 'Strategic Planning Template',
      customization: { company: 'Test Corp' }
    }

    const response = await request(app)
      .post('/api/templates/generate')
      .send(templateRequest)
      .expect(200)
    
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('template')
    expect(response.body.template).toHaveProperty('category', 'business')
    expect(response.body.template).toHaveProperty('type', 'Strategic Planning Template')
  })
})

describe('IDE API', () => {
  test('GET /api/ide/config should return IDE configuration', async () => {
    const response = await request(app)
      .get('/api/ide/config')
      .expect(200)
    
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('ide')
    expect(response.body).toHaveProperty('version', '4.0.0')
    expect(response.body).toHaveProperty('type', 'Quadrinary IDE')
  })

  test('POST /api/ide/project/create should create a new project', async () => {
    const projectRequest = {
      name: 'Test Project',
      type: 'web-app',
      framework: 'react'
    }

    const response = await request(app)
      .post('/api/ide/project/create')
      .send(projectRequest)
      .expect(200)
    
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('project')
    expect(response.body.project).toHaveProperty('name', 'Test Project')
    expect(response.body.project).toHaveProperty('type', 'web-app')
  })
})