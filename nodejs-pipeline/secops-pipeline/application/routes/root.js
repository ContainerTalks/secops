'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  fastify.get('/health', async function (request, reply) {
    return "healthy"
  })
}
