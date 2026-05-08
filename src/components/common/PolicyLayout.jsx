import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen py-12" style={{ background: '#080808' }}>
      <div className="container max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8" style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }} aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-[#F0EBE3]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#F0EBE3' }}>{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '12px' }}>
            Legal
          </span>
          <h1
            className="uppercase font-black leading-none mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0EBE3' }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p style={{ color: '#555', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Content */}
        <div
          className="p-8 md:p-12 prose prose-sm max-w-none"
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '4px',
            '--tw-prose-body': '#888',
            '--tw-prose-headings': '#F0EBE3',
            '--tw-prose-bold': '#F0EBE3',
            '--tw-prose-links': '#FF3500',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
