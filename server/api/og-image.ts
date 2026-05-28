export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
    throw createError({ statusCode: 400, message: 'Invalid URL' })
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: 502, message: 'Failed to fetch image' })
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return sendStream(event, response.body as ReadableStream)
})
