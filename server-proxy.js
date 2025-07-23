import fs from 'fs'
import path from 'path'
import http from 'http'
import httpProxy from 'http-proxy'
import { fileURLToPath } from 'url'
import { URL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create a proxy to forward requests to Vite dev server
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8081', // Vite dev server port (changed from default to avoid conflict)
  changeOrigin: true,
  ws: true // Enable WebSocket proxying for HMR
})

// Function to inject meta tags for assessment pages
const injectMetaTags = (html, pathname) => {
  if (pathname.startsWith('/assessment/')) {
    const assessmentId = pathname.split('/')[2]
    if (assessmentId && assessmentId !== '') {
      const metaTags = `
    <title>Assessment ${assessmentId} - EarlyJobs</title>
    <meta name="description" content="Take this professional assessment on EarlyJobs to boost your career prospects" />
    <meta property="og:title" content="Assessment ${assessmentId} - EarlyJobs" />
    <meta property="og:description" content="Take this professional assessment on EarlyJobs to boost your career prospects" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://earlyjobs.in${pathname}" />
    <meta property="og:image" content="https://earlyjobs.in/assets/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Assessment ${assessmentId} - EarlyJobs" />
    <meta name="twitter:description" content="Take this professional assessment on EarlyJobs to boost your career prospects" />
    <meta name="twitter:image" content="https://earlyjobs.in/assets/og-image.png" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Assessment ${assessmentId}",
      "description": "Professional assessment on EarlyJobs platform",
      "provider": {
        "@type": "Organization",
        "name": "EarlyJobs"
      },
      "courseMode": "online"
    }
    </script>`
      
      // Replace the default title and add meta tags
      return html
        .replace('<title>EarlyJobs - Assessment Platform</title>', `<title>Assessment ${assessmentId} - EarlyJobs</title>`)
        .replace('</head>', `${metaTags}\n</head>`)
    }
  }
  return html
}

// Create the proxy server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  // Check if this is an assessment page request for HTML
  const isAssessmentPage = pathname.startsWith('/assessment/') && 
                          (!pathname.includes('.')) // Not a file request (no extension)

  if (isAssessmentPage) {
    // For assessment pages, get the HTML from Vite and inject meta tags
    const proxyReq = http.request({
      hostname: 'localhost',
      port: 8081,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (proxyRes) => {
      let body = ''
      proxyRes.on('data', chunk => body += chunk)
      proxyRes.on('end', () => {
        const enhancedHtml = injectMetaTags(body, pathname)
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        res.end(enhancedHtml)
      })
    })

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err)
      res.writeHead(500)
      res.end('Proxy Error')
    })

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq)
    } else {
      proxyReq.end()
    }
  } else {
    // For all other requests, just proxy to Vite dev server
    proxy.web(req, res, (err) => {
      if (err) {
        console.error('Proxy error:', err)
        res.writeHead(500)
        res.end('Proxy Error - Make sure Vite dev server is running on port 5173')
      }
    })
  }
})

// Handle WebSocket connections for HMR
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head)
})

const PORT = 8080

server.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`)
  console.log(`📝 This server proxies to Vite dev server and injects meta tags for assessment pages`)
  console.log(`⚠️  Make sure to run 'npm run dev' in another terminal for the Vite dev server (port 8081)`)
  console.log(`📝 Try visiting: http://localhost:${PORT}/assessment/123`)
}) 