import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

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
    } catch (err) {
      toast.error('Failed to send. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-16 md:py-20">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            Get in <span style={{ color: '#39ff14' }}>Touch</span>
          </h1>
          <p className="text-[#9ca3af] max-w-lg mx-auto">
            Got a question? Spotted a bug? Want to collab? Drop us a line — we read every message.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Mail, color: '#39ff14', title: 'Email', value: 'hello@neechbakra.com', href: 'mailto:hello@neechbakra.com' },
            { icon: MessageSquare, color: '#8b5cf6', title: 'Support', value: 'support@neechbakra.com', href: 'mailto:support@neechbakra.com' },
            { icon: MapPin, color: '#007cf0', title: 'Location', value: 'Mumbai, India' },
          ].map(({ icon: Icon, color, title, value, href }) => {
            const Wrap = href ? 'a' : 'div'
            return (
              <Wrap
                key={title}
                {...(href ? { href } : {})}
                className="glass rounded-2xl p-7 flex items-start gap-5 transition-all hover:scale-[1.02]"
                style={{ border: `1px solid ${color}33` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}1a` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-1">{title}</p>
                  <p className="text-sm font-bold" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>{value}</p>
                </div>
              </Wrap>
            )
          })}
        </div>

        <div className="glass-strong rounded-3xl p-8 md:p-12" style={{ border: '1px solid rgba(57,255,20,0.2)' }}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(57,255,20,0.1)' }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: '#39ff14' }} />
              </div>
              <h2 className="text-3xl font-black uppercase mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                Message sent!
              </h2>
              <p className="text-[#9ca3af] mb-6">We'll get back to you within 24-48 hours.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline-neon">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-5">
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
                <button type="submit" disabled={submitting} className="btn-neon disabled:opacity-50">
                  <Send className="w-4 h-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-xs text-[#6b7280] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Typical response time: 24-48 hours
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8e8e8;
          font-size: 14px;
          transition: all 0.2s;
        }
        .contact-input:focus { outline: none; border-color: #39ff14; }
        .contact-input::placeholder { color: #6b7280; }
      `}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-2 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
