import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Download as DownloadIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  Plus as PlusIcon,
  Trash2 as Trash2Icon,
  CheckCircle2 as CheckCircleIcon,
  Home as HomeIcon,
  ArrowLeft as ArrowLeftIcon,
  LayoutGrid as LayoutGridIcon,
  Settings as SettingsIcon,
  Github as GHIcon,
  Heart as HeartIcon,
  Download,
  Search as SearchIcon,
} from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { AppBar, Box, Button, IconButton, Paper, Toolbar, Tooltip } from '@mui/material'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Theme, Tool, ToolCategory, ViewMode } from '../types'
import { PDFMachineLogo } from './Logo'
import { ActivityEntry, getRecentActivity, clearActivity } from '../utils/recentActivity'
import { hapticImpact } from '../utils/haptics'

interface LayoutProps {
  children: React.ReactNode
  theme: Theme
  toggleTheme: () => void
  tools: Tool[]
  onFileDrop?: (files: FileList) => void
  viewMode: ViewMode
  homeSearchQuery: string
  setHomeSearchQuery: (value: string) => void
}

const categoryColors: Record<ToolCategory, { bg: string, text: string, hover: string, iconBg: string }> = {
  Edit: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-500', hover: 'hover:bg-rose-50 dark:hover:bg-rose-900/10', iconBg: 'bg-rose-100 dark:bg-rose-900/30' },
  Secure: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-500', hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  Convert: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-500', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  Optimize: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500', hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/10', iconBg: 'bg-amber-100 dark:bg-amber-900/30' }
}
export default function Layout({ children, theme: _theme, toggleTheme: _toggleTheme, tools, onFileDrop, viewMode, homeSearchQuery, setHomeSearchQuery }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isNative = Capacitor.isNativePlatform()
  const showMobileNav = isNative || viewMode === 'android'
  const isMobileBrowser = !isNative && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  useEffect(() => {
    if (showHistory) {
      getRecentActivity().then(setActivity)
    }
  }, [showHistory])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (onFileDrop) setIsDragging(true)
    }
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDragging(false)
      }
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (onFileDrop && e.dataTransfer?.files) {
        onFileDrop(e.dataTransfer.files)
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [onFileDrop])

  const activeTool = tools.find(t => {
    const pathPart = t.title.split(' ')[0].toLowerCase()
    return location.pathname.includes(`/${pathPart}`)
  })

  const isHome = location.pathname === '/'
  const isMainView = isHome || location.pathname.endsWith('/android-tools') || location.pathname.endsWith('/android-history') || location.pathname.endsWith('/settings')
  const shouldShowNav = showMobileNav && isMainView && !activeTool

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'transparent', color: 'text.primary' }}>
      {isDragging && (
        <div className="fixed inset-0 z-[200] bg-rose-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] shadow-2xl border-4 border-dashed border-rose-500 animate-in zoom-in duration-300">
            <UploadIcon size={64} className="text-rose-500 animate-bounce" />
            <p className="mt-4 font-black uppercase tracking-widest text-rose-500 text-center text-sm">Drop PDF to start</p>
          </div>
        </div>
      )}

      {!showMobileNav && (
        <AppBar position="sticky" elevation={0} color="transparent" sx={{ top: 0, zIndex: 100, backdropFilter: 'blur(18px)', background: 'rgba(247, 249, 255, 0.82)', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar disableGutters sx={{ px: { xs: 1.5, md: 4 }, minHeight: { xs: 64, md: 80 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flexShrink: 0 }}>
              {!isHome && (
                <IconButton onClick={() => navigate('/')} sx={{ color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(239, 71, 111, 0.08)', color: 'primary.main' } }}>
                  <ArrowLeftIcon size={20} />
                </IconButton>
              )}
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                <PDFMachineLogo size={Capacitor.isNativePlatform() ? 24 : 28} iconColor="#F43F5E" />
                <span className="font-black tracking-tighter text-lg md:text-xl text-gray-900 hidden xs:block">PDF Proxy</span>
              </Link>
              <div className="relative min-w-0" ref={dropdownRef}>
                <Button onClick={() => setIsDropdownOpen(!isDropdownOpen)} variant={isDropdownOpen ? 'contained' : 'outlined'} size="small" sx={{ minWidth: 0, px: { xs: 1.5, md: 2 }, py: 1, borderRadius: 1, fontSize: { xs: 10, md: 12 }, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: isDropdownOpen ? 'white' : 'text.secondary', borderColor: 'divider', bgcolor: isDropdownOpen ? 'primary.main' : 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: isDropdownOpen ? 'primary.dark' : 'rgba(239, 71, 111, 0.08)', borderColor: 'primary.main' } }} endIcon={<ChevronDownIcon size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />}>
                  <span className="truncate">{isHome ? 'All Tools' : activeTool?.title || 'Tool'}</span>
                </Button>
                {isDropdownOpen && (
                  <Paper elevation={12} className="scrollbar-hide absolute top-full left-0 mt-3 w-72 md:w-80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto" sx={{ borderRadius: 2, py: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    {Object.entries(tools.filter(t => t.implemented).reduce((acc, tool) => { if (!acc[tool.category]) acc[tool.category] = []; acc[tool.category].push(tool); return acc }, {} as Record<string, Tool[]>)).map(([category, categoryTools]) => {
                      const colors = categoryColors[category as ToolCategory]
                      return (
                        <div key={category} className="mb-4">
                          <div className="px-6 py-2"><span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.text} opacity-60`}>{category}</span></div>
                          <div className="grid grid-cols-1 gap-1 px-2">
                            {categoryTools.map((tool, i) => {
                              const Icon = tool.icon
                              const isActive = activeTool?.title === tool.title && !isHome
                              return (
                                <button key={i} onClick={() => { navigate(tool.path || '/'); setIsDropdownOpen(false); }} className={`flex items-center gap-4 p-3 rounded-lg transition-all text-left group ${isActive ? `${colors.bg} ${colors.text}` : `hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400`}`}>
                                  <div className={`p-2 rounded-md transition-colors ${isActive ? 'bg-white dark:bg-zinc-800' : `${colors.iconBg} ${colors.text} opacity-70 group-hover:opacity-100`}`}><Icon size={18} /></div>
                                  <div className="flex-1 min-w-0"><p className="text-xs font-black uppercase tracking-tight">{tool.title}</p><p className="text-[10px] opacity-60 truncate">{tool.desc}</p></div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </Paper>
                )}
              </div>
            </Box>

            <Box sx={{ flex: 1, maxWidth: 560, mx: { xs: 0, md: 3 }, display: isHome ? 'block' : 'none' }}>
              <TextField
                fullWidth
                placeholder="Search tools"
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon size={18} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 1.5,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                    height: 44,
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  '& .MuiInputBase-input': { py: 0, fontWeight: 600 },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              {isMobileBrowser && (
                <Button href="https://github.com/potatameister/PaperKnife/releases/latest" target="_blank" variant="contained" color="primary" size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', px: 2, py: 1 }}>
                  <Download size={14} strokeWidth={3} />
                  Get APK
                </Button>
              )}
              <Tooltip title="Activity">
                <IconButton onClick={() => setShowHistory(true)} sx={{ color: showHistory ? 'primary.main' : 'text.secondary', bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(239, 71, 111, 0.08)' }, position: 'relative' }}>
                  <HistoryIcon size={20} />
                  {activity.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>

        </AppBar>
      )}

      <Box component="main" sx={{ flex: 1, minWidth: 0, pb: shouldShowNav ? 32 : 0 }}>
        {children}
      </Box>

      {!showMobileNav && (
        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 10, bgcolor: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 10 }}>
          <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 4 }, py: { xs: 5, md: 6 } }}>
            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
              <div className="col-span-2 md:col-span-6 space-y-4">
                <Link to="/" className="flex items-center gap-2.5 text-gray-900 dark:text-white group w-fit">
                  <PDFMachineLogo size={22} iconColor="#F43F5E" partColor="currentColor" />
                  <span className="font-bold tracking-tight text-lg group-hover:text-rose-500 transition-colors">PDF Proxy</span>
                </Link>
                <p className="text-gray-500 dark:text-zinc-500 text-xs leading-relaxed max-w-sm">
                  The privacy-first PDF toolkit. 100% client-side logic. <br />
                  Zero servers. Open source and forever free.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wide border border-emerald-100 dark:border-emerald-900/20">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Live Engine
                  </div>
                  <a href="https://github.com/potatameister/PaperKnife" target="_blank" className="p-2 bg-gray-50 dark:bg-zinc-900 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-gray-500 dark:text-zinc-500">
                    <GHIcon size={14} />
                  </a>
                </div>
              </div>

              <div className="col-span-1 md:col-span-3">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-900 dark:text-white mb-4">Protocol</h4>
                <ul className="space-y-2.5 text-xs text-gray-500 dark:text-zinc-500">
                  <li><Link to="/about" className="hover:text-rose-500 transition-colors">About</Link></li>
                  <li><Link to="/privacy" className="hover:text-rose-500 transition-colors">Privacy Spec</Link></li>
                  <li><a href="https://github.com/potatameister/PaperKnife/blob/main/LICENSE" target="_blank" className="hover:text-rose-500 transition-colors">License</a></li>
                </ul>
              </div>

              <div className="col-span-1 md:col-span-3">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-900 dark:text-white mb-4">Ecosystem</h4>
                <ul className="space-y-2.5 text-xs text-gray-500 dark:text-zinc-500">
                  <li><a href="https://github.com/sponsors/potatameister" target="_blank" className="flex items-center gap-2 hover:text-rose-500 transition-colors">Sponsor <HeartIcon size={10} className="text-rose-500" /></a></li>
                  <li><a href="https://github.com/potatameister/PaperKnife/issues" target="_blank" className="hover:text-rose-500 transition-colors">Report Bug</a></li>
                  <li><Link to="/thanks" className="hover:text-rose-500 transition-colors">Hall of Fame</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 dark:text-zinc-600 font-medium">
              <p>© 2026 PDF Proxy Project. No cookies used.</p>
              <div className="flex gap-6 items-center">
                <a href="https://github.com/potatameister" target="_blank" className="hover:text-gray-900 dark:hover:text-white transition-colors">@potatameister</a>
              </div>
            </div>
          </Box>
        </Box>
      )}

      {shouldShowNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800 flex items-end justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${location.pathname === '/' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}>
            <HomeIcon size={24} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button onClick={() => navigate('/android-tools')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${location.pathname === '/android-tools' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}>
            <LayoutGridIcon size={24} strokeWidth={location.pathname === '/android-tools' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Tools</span>
          </button>

          <div className="relative -top-8">
            <button 
              onClick={() => {
                hapticImpact()
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) onFileDrop?.([file] as any)
                }
                input.click()
              }}
              className="w-14 h-14 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/40 flex items-center justify-center active:scale-90 transition-transform ring-4 ring-white dark:ring-black"
            >
              <PlusIcon size={32} strokeWidth={3} />
            </button>
          </div>

          <button onClick={() => navigate('/android-history')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${location.pathname === '/android-history' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}>
            <HistoryIcon size={24} strokeWidth={location.pathname === '/android-history' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">History</span>
          </button>

          <Link to="/settings" className={`flex flex-col items-center gap-1.5 flex-1 transition-all no-underline ${location.pathname.includes('settings') ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}>
            <SettingsIcon size={24} strokeWidth={location.pathname.includes('settings') ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Settings</span>
          </Link>
        </nav>
      )}

      <aside className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-white dark:bg-zinc-950 border-l border-gray-100 dark:border-zinc-800 z-[150] shadow-2xl transition-transform duration-500 ease-out transform ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <HistoryIcon className="text-rose-500" size={24} />
              <h2 className="text-xl font-black dark:text-white">Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              {activity.length > 0 && (
                <button onClick={async () => { await clearActivity(); setActivity([]); }} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 rounded-xl transition-colors">
                  <Trash2Icon size={18} />
                </button>
              )}
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <ChevronRightIcon size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {activity.length === 0 ? (
              <div className="text-center py-20 opacity-40"><p className="text-xs font-bold uppercase tracking_widest text-gray-400">No recent files</p></div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 group relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg flex items-center justify-center"><CheckCircleIcon size={16} /></div>
                    <div className="flex-1 min-w-0"><p className="text-xs font-bold truncate dark:text-white">{item.name}</p><p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{item.tool}</p></div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    {item.resultUrl && (<a href={item.resultUrl} download={item.name} className="text-rose-500 hover:underline flex items-center gap-1"><DownloadIcon size={10} /> Redownload</a>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
      {showHistory && (<div onClick={() => setShowHistory(false)} className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[140] animate-in fade-in duration-300" />)}
    </Box>
  )
}