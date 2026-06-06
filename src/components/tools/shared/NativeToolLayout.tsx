import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import ToolHeader from './ToolHeader'
import { AppBar, Box, IconButton, Paper, Toolbar } from '@mui/material'

interface NativeToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  actions?: React.ReactNode
  onBack?: () => void
}

export const NativeToolLayout = ({ 
  title, 
  description, 
  children, 
  actions,
  onBack 
}: NativeToolLayoutProps) => {
  const navigate = useNavigate()
  
  // Determine if we should show the native-style header
  // It should only show if we are in Android/APK mode
  const isNative = Capacitor.isNativePlatform()
  const isAndroidView = isNative || document.body.classList.contains('android-mode') || window.location.pathname.includes('android')
  
  // A more reliable way is to check the layout context or simply use media queries 
  // but since we want to avoid double headers with the main Layout.tsx:
  const showNativeHeader = isAndroidView

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'transparent' }}>
      {showNativeHeader && (
        <AppBar position="sticky" elevation={0} color="transparent" sx={{ display: { md: 'none' }, backdropFilter: 'blur(18px)', background: 'rgba(247, 249, 255, 0.88)', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ minHeight: 64, px: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={onBack || (() => navigate(-1))} sx={{ color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.85)' }}>
                <ArrowLeft size={24} />
              </IconButton>
              <Box component="h1" sx={{ m: 0, fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'text.primary' }}>{title}</Box>
            </Box>
            <Box sx={{ width: 40 }} />
          </Toolbar>
        </AppBar>
      )}

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 }, maxWidth: 1080, width: '100%', mx: 'auto', pb: actions ? { xs: 18, md: 4 } : { xs: 2, md: 4 } }}>
        <Box sx={{ display: showNativeHeader ? { xs: 'none', md: 'block' } : 'block', mb: { xs: 3, md: 5 } }}>
          <ToolHeader title={title} description={description} />
        </Box>

        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>

      {actions && (
        <Paper elevation={10} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, backdropFilter: 'blur(18px)', background: 'rgba(255,255,255,0.92)', borderTop: '1px solid', borderColor: 'divider', pb: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
          <Box sx={{ p: 2, maxWidth: 480, mx: 'auto' }}>
            {actions}
          </Box>
        </Paper>
      )}
    </Box>
  )
}