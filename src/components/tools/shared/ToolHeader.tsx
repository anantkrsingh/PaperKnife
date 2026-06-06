import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Box, IconButton, Typography } from '@mui/material'

interface ToolHeaderProps {
  title: string
  highlight?: string
  description: string
}

export default function ToolHeader({ title, highlight, description }: ToolHeaderProps) {
  const navigate = useNavigate()
  const isNative = Capacitor.isNativePlatform()

  return (
    <Box sx={{ position: 'relative', textAlign: 'center', mb: { xs: 3, md: 6 } }}>
      {isNative && (
        <IconButton onClick={() => navigate('/')} sx={{ position: 'absolute', left: 0, top: 0, bgcolor: 'rgba(255,255,255,0.9)', color: 'text.secondary', display: { md: 'none' }, '&:hover': { color: 'primary.main', bgcolor: 'rgba(239, 71, 111, 0.08)' } }}>
          <ArrowLeft size={20} />
        </IconButton>
      )}
      <Typography variant="h3" sx={{ px: 6, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.05, fontSize: { xs: '2rem', md: '3.75rem' }, color: 'text.primary', mb: 1.5 }}>
        {title} <Box component="span" sx={{ color: 'primary.main' }}>{highlight ? `${highlight}.` : ''}</Box>
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 640, mx: 'auto', color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
        {description}
      </Typography>
    </Box>
  )
}
