import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6b7280] mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#39ff14] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#e8e8e8]">{title}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
          >
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[#6b7280] text-sm">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Content */}
        <div
          className="glass rounded-2xl p-8 md:p-12 prose prose-sm max-w-none"
          style={{
            '--tw-prose-body': '#9ca3af',
            '--tw-prose-headings': '#e8e8e8',
            '--tw-prose-bold': '#e8e8e8',
            '--tw-prose-links': '#39ff14',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
