import { Helmet } from 'react-helmet'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  path?: string
}

const SEO = ({ 
  title = 'PDFMachine — Private & Offline PDF Tools',
  description = '100% Client-Side PDF utilities. Merge, Split, Compress, Sign, and Protect PDFs without uploading them to any server. Absolute privacy for your documents.',
  keywords = 'pdf tools, private pdf, offline pdf merge, split pdf locally, compress pdf browser, electronic signature, pdf to image, no upload pdf, pdf editor, free pdf tools, secure pdf, pdf converter',
  path = ''
}: SEOProps) => {
  const baseUrl = 'https://potatameister.github.io/PaperKnife/'
  const fullUrl = `${baseUrl}${path}`
  const fullTitle = title === 'PDFMachine — Private & Offline PDF Tools' ? title : `${title} | PDFMachine`

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
      <meta property="og:image" content={`${baseUrl}icons/logo.svg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${baseUrl}icons/logo.svg`} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}

export default SEO
