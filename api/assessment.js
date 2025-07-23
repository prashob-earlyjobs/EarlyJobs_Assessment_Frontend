import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Function to inject meta tags for assessment pages
const injectMetaTags = (html, assessmentId) => {
  const metaTags = `
    <title>Assessment ${assessmentId} - EarlyJobs</title>
    <meta name="description" content="Take this professional assessment on EarlyJobs to boost your career prospects" />
    <meta property="og:title" content="Assessment ${assessmentId} - EarlyJobs" />
    <meta property="og:description" content="Take this professional assessment on EarlyJobs to boost your career prospects" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://earlyjobs.in/assessment/${assessmentId}" />
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

export default async function handler(req, res) {
  try {
    // Extract assessment ID from the URL
    const { url } = req
    const assessmentMatch = url.match(/\/assessment\/([^\/\?]+)/)
    
    if (!assessmentMatch) {
      return res.status(404).json({ error: 'Assessment not found' })
    }
    
    const assessmentId = assessmentMatch[1]
    
    // Read the base HTML template (this will be your built index.html)
    const htmlPath = path.resolve(process.cwd(), 'dist/index.html')
    let html
    
    try {
      html = fs.readFileSync(htmlPath, 'utf-8')
    } catch (error) {
      // Fallback to a basic HTML structure if built file doesn't exist
      html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EarlyJobs - Assessment Platform</title>
    <meta name="description" content="Take professional assessments and boost your career with EarlyJobs" />
    <meta property="og:title" content="EarlyJobs - Assessment Platform" />
    <meta property="og:description" content="Take professional assessments and boost your career with EarlyJobs" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/assets/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
  </body>
</html>`
    }
    
    // Inject meta tags for the assessment
    const enhancedHtml = injectMetaTags(html, assessmentId)
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate')
    
    return res.status(200).send(enhancedHtml)
    
  } catch (error) {
    console.error('Error in assessment handler:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 