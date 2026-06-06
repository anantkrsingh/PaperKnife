/**
 * PDF Proxy - Professional Web Dashboard
 * A desktop-optimized, sidebar-driven interface.
 */

import { useState, useMemo } from 'react'
import { 
  ChevronRight as ChevronRightIcon, 
  SearchIcon, 
  Sparkles as SparklesIcon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Tool, ToolCategory } from '../types'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Button,
  Typography,
} from '@mui/material'

const categoryColors: Record<ToolCategory, { bg: string, text: string, border: string, hover: string, glow: string }> = {
  Edit: { 
    bg: 'bg-rose-50 dark:bg-rose-900/20', 
    text: 'text-rose-500', 
    border: 'border-rose-100 dark:border-rose-900/30',
    hover: 'group-hover:bg-rose-500',
    glow: 'dark:hover:shadow-rose-900/20'
  },
  Secure: { 
    bg: 'bg-indigo-50 dark:bg-indigo-900/20', 
    text: 'text-indigo-500', 
    border: 'border-indigo-100 dark:border-indigo-900/30',
    hover: 'group-hover:bg-indigo-500',
    glow: 'dark:hover:shadow-indigo-900/20'
  },
  Convert: { 
    bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
    text: 'text-emerald-500', 
    border: 'border-emerald-100 dark:border-emerald-900/30',
    hover: 'group-hover:bg-emerald-500',
    glow: 'dark:hover:shadow-emerald-900/20'
  },
  Optimize: { 
    bg: 'bg-amber-50 dark:bg-amber-900/20', 
    text: 'text-amber-500', 
    border: 'border-amber-100 dark:border-amber-900/30',
    hover: 'group-hover:bg-amber-500',
    glow: 'dark:hover:shadow-amber-900/20'
  }
}

const ToolCard = ({ title, desc, icon: Icon, onClick, category }: Tool & { onClick?: () => void }) => {
  const colors = categoryColors[category]
  
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 50px rgba(239, 71, 111, 0.08)', borderColor: 'rgba(239, 71, 111, 0.35)' } }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'stretch' }}>
        <CardContent sx={{ p: 3, position: 'relative', minHeight: 208 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, color: colors.text, bgcolor: colors.bg, transition: 'all 180ms ease', '.MuiCardActionArea-root:hover &': { bgcolor: '#ef476f', color: '#fff' } }}>
            <Icon size={24} strokeWidth={2} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-0.03em' }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{desc}</Typography>
          <Box sx={{ position: 'absolute', top: 24, right: 24, color: 'primary.main', opacity: 0.55 }}>
            <ChevronRightIcon size={20} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default function WebView({ tools, searchQuery, setSearchQuery }: { tools: Tool[], searchQuery: string, setSearchQuery: (value: string) => void }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All')

  const categories: (ToolCategory | 'All')[] = ['All', 'Edit', 'Secure', 'Convert', 'Optimize']

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [tools, searchQuery, activeCategory])

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', bgcolor: 'transparent', transition: 'background-color 500ms ease' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(239,71,111,0.12), transparent 36%), radial-gradient(circle at 80% 18%, rgba(6,182,212,0.12), transparent 28%), radial-gradient(circle at 20% 42%, rgba(168,85,247,0.10), transparent 30%)', pointerEvents: 'none' }} />
      {/* Hero Section */}
      <Box component="section" sx={{ position: 'relative', pt: { xs: 10, md: 14 }, pb: { xs: 6, md: 8 }, px: 3, overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Chip icon={<SparklesIcon size={14} />} label="Professional PDF Engine" sx={{ mb: 3, px: 1, py: 2.5, borderRadius: 2, bgcolor: 'rgba(239, 71, 111, 0.10)', color: 'primary.main', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', '& .MuiChip-icon': { color: 'primary.main' } }} />
          <Typography variant="h1" sx={{ fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.98, mb: 2.5, fontSize: { xs: '2.25rem', md: '4rem' }, color: 'text.primary' }}>
            Stop Uploading <br />
            <Box component="span" sx={{ color: 'primary.main' }}>Your Privacy.</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: 'auto', fontSize: { xs: '0.92rem', md: '1rem' }, lineHeight: 1.7, mb: 2.5 }}>
            Work with PDFs locally in a bright, modern dashboard. Filter and open tools without sacrificing the privacy-first engine underneath.
          </Typography>
        </Container>
      </Box>
      <div id="container-d018bbbbb7b42929a0d963525149aa26"></div>



      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pb: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                clickable
                onClick={() => setActiveCategory(cat)}
                label={cat}
                sx={{
                  px: 1.5,
                  py: 2.25,
                  borderRadius: 2,
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  bgcolor: activeCategory === cat ? 'primary.main' : 'rgba(255,255,255,0.9)',
                  color: activeCategory === cat ? 'white' : 'text.secondary',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'transparent' : 'divider',
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 900, color: 'text.secondary', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{filteredTools.length} Modules Active</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} onClick={() => navigate(tool.path || '/')} />
          ))}
        </Box>

        {filteredTools.length === 0 && (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Box sx={{ width: 88, height: 88, bgcolor: 'rgba(239, 71, 111, 0.08)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color: 'primary.main' }}>
              <SearchIcon size={32} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>No tools matched.</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Try searching for a different keyword or clear your filters.</Typography>
            <Button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} sx={{ mt: 3, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Reset Dashboard</Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}