import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const OVERLINE = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px', display: 'block' }

export default function Contact() {
  const submit = useMutation(api.contact.submitContactMessage)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await submit({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      })
      toast.success('Message sent! We\'ll reply within 24-48h.')
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Failed to send. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Hero */}
      <section style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container py-20 md:py-24">
          <span style={OVERLINE}>Contact</span>
          <h1 className="uppercase font-black leading-none mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', color: '#F0EBE3' }}>
            Get in <span style={{ color: '#FF3500' }}>Touch</span>
          </h1>
          <p className="max-w-lg" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: 1.7 }}>
            Got a question? Spotted a bug? Want to collab? Drop us a line — we read every message.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-5xl">

          {/* Info cards */}
          <div className="grid md:grid-cols-3 gap-px mb-14" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
            {[
              { icon: Mail,         title: 'Email',    value: 'hello@neechbakra.com',   href: 'mailto:hello@neechbakra.com' },
              { icon: MessageSquare,title: 'Support',  value: 'support@neechbakra.com', href: 'mailto:support@neechbakra.com' },
              { icon: MapPin,       title: 'Location', value: 'Mumbai, India' },
            ].map(({ icon: Icon, title, value, href }, i) => {
              const Wrap = href ? 'a' : 'div'
              return (
                <Wrap
                  key={title}
                  {...(href ? { href } : {})}
                  className="flex items-start gap-6 transition-colors"
                  style={{ padding: '36px 32px' }}
                  style={{
                    background: '#111',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                  onMouseLeave={e => e.currentTarget.style.background = '#111'}
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,53,0,0.08)', border: '1px solid rgba(255,53,0,0.2)', borderRadius: '3px' }}>
                    <Icon className="w-4 h-4" style={{ color: '#FF3500' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '6px' }}>{title}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>{value}</p>
                  </div>
                </Wrap>
              )
            })}
          </div>

          {/* Form */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '56px' }}>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6" style={{ background: 'rgba(255,53,0,0.08)', border: '1px solid rgba(255,53,0,0.2)', borderRadius: '4px' }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#FF3500' }} />
                </div>
                <h2 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F0EBE3' }}>
                  Message Sent
                </h2>
                <p className="mb-8" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' }}>
                  We'll get back to you within 24-48 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline-neon">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                <Field label="Your Name" error={errors.name?.message}>
                  <input
                    type="text"
                    {...register('name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
                    placeholder="Your name"
                    className="contact-input"
                  />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    placeholder="you@example.com"
                    className="contact-input"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Subject" error={errors.subject?.message}>
                    <input
                      type="text"
                      {...register('subject', { required: 'Required' })}
                      placeholder="What's this about?"
                      className="contact-input"
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Message" error={errors.message?.message}>
                    <textarea
                      rows={5}
                      {...register('message', { required: 'Required', minLength: { value: 10, message: 'At least 10 characters' } })}
                      placeholder="Tell us what's on your mind..."
                      className="contact-input resize-none"
                    />
                  </Field>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button type="submit" disabled={submitting} className="btn-neon gap-2 disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="flex items-center gap-1.5" style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Clock className="w-3 h-3" /> Typical response: 24-48 hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .contact-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 3px;
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.1);
          color: #F0EBE3;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .contact-input:focus { outline: none; border-color: #FF3500; }
        .contact-input::placeholder { color: #444; }
      `}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>{label}</label>
      {children}
      {error && <p className="mt-1" style={{ fontSize: '12px', color: '#ef4444', fontFamily: 'Space Grotesk, sans-serif' }}>{error}</p>}
    </div>
  )
}
