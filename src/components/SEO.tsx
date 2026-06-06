import { Helmet } from 'react-helmet'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  path?: string
}

const SEO = ({ 
  title = 'PDF Proxy — Private & Offline PDF Tools',
  description = '100% Client-Side PDF utilities. Merge, Split, Compress, Sign, and Protect PDFs without uploading them to any server. Absolute privacy for your documents.',
  keywords = 'pdf tools, private pdf, offline pdf merge, split pdf locally, compress pdf browser, electronic signature, pdf to image, no upload pdf, pdf editor, free pdf tools, secure pdf, pdf converter',
  path = ''
}: SEOProps) => {
  const siteUrl = 'https://pdfmachine.in'
  const normalizedPath = path.replace(/^#\/?/, '/')
  const canonicalPath = normalizedPath
    ? normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
    : ''
  const fullUrl = `${siteUrl}${canonicalPath}`
  const fullTitle = title === 'PDF Proxy — Private & Offline PDF Tools' ? title : `${title} | PDF Proxy`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}/icons/logo.svg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}/icons/logo.svg`} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}

export default SEO
