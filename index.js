// const chalk = require("chalk")
const c = require("ansi-colors")
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response(c.blue('!Hello worker!\n'))
}

