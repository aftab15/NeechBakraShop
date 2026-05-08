import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, X, Package, ChevronLeft, Save } from 'lucide-react'
import { formatPrice, slugify } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE']
const GRADIENTS = ['product-gradient-1', 'product-gradient-2', 'product-gradient-3', 'product-gradient-4', 'product-gradient-5']

export default function AdminProducts() {
  const products = useQuery(api.products.listAllProducts)
  const categories = useQuery(api.categories.listAllCategories)
  const createProduct = useMutation(api.products.createProduct)
  const updateProduct = useMutation(api.products.updateProduct)
  const deleteProduct = useMutation(api.products.deleteProduct)
  const toggleActive = useMutation(api.products.toggleProductActive)

  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  if (products === undefined || categories === undefined) return <PageLoader />

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await deleteProduct({ id })
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggleActive = async (id, current) => {
    try {
      await toggleActive({ id, isActive: !current })
      toast.success(`Product ${!current ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed')
    }
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#FF3500] transition-colors mb-2">
              <ChevronLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Products
            </h1>
            <p className="text-[#6b7280] text-sm mt-1">{products.length} total · {products.filter((p) => p.isActive).length} active</p>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-neon">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-[#6b7280] border-b border-white/10">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4 hidden md:table-cell">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4 hidden md:table-cell">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${product.gradientClass || 'product-gradient-1'}`}>
                          {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold line-clamp-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>{product.name}</p>
                          <p className="text-xs text-[#6b7280] line-clamp-1">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-[#9ca3af]">{product.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold" style={{ color: '#FF3500', fontFamily: 'Rajdhani, sans-serif' }}>{formatPrice(product.price)}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-sm ${product.stock > 0 ? 'text-[#9ca3af]' : 'text-red-400'}`}>{product.stock}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(product._id, product.isActive)}
                        className="relative w-10 h-5 rounded-full transition-all"
                        style={{ background: product.isActive ? '#FF3500' : 'rgba(255,255,255,0.1)' }}
                        aria-label="Toggle active"
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: product.isActive ? '22px' : '2px' }}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => { setEditing(product); setShowForm(true) }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#9ca3af] hover:text-[#FF3500]"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#9ca3af] hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#6b7280]">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      No products yet. Click "Add Product" to create your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null) }}
          createProduct={createProduct}
          updateProduct={updateProduct}
        />
      )}
    </div>
  )
}

function ProductFormModal({ product, categories, onClose, createProduct, updateProduct }) {
  const [saving, setSaving] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || [])
  const isEdit = !!product

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: product ? {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price / 100,
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : '',
      categoryId: product.categoryId,
      stock: product.stock,
      tags: product.tags?.join(', ') || '',
      images: product.images?.[0] || '',
      gradientClass: product.gradientClass || 'product-gradient-1',
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    } : {
      gradientClass: 'product-gradient-1',
      isFeatured: false,
      isActive: true,
      stock: 50,
    },
  })

  const name = watch('name')
  if (name && !isEdit && !watch('slug')) {
    setValue('slug', slugify(name))
  }

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const onSubmit = async (data) => {
    if (selectedSizes.length === 0) {
      toast.error('Select at least one size')
      return
    }
    setSaving(true)
    try {
      const cat = categories.find((c) => c._id === data.categoryId)
      const payload = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        price: Math.round(Number(data.price) * 100),
        compareAtPrice: data.compareAtPrice ? Math.round(Number(data.compareAtPrice) * 100) : undefined,
        images: data.images ? [data.images.trim()] : [],
        categoryId: data.categoryId,
        category: cat?.name || 'Uncategorized',
        sizes: selectedSizes,
        stock: Number(data.stock),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        isFeatured: !!data.isFeatured,
        isActive: !!data.isActive,
        gradientClass: data.gradientClass,
      }

      if (isEdit) {
        await updateProduct({ id: product._id, ...payload })
        toast.success('Product updated!')
      } else {
        await createProduct(payload)
        toast.success('Product created!')
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl p-6 md:p-8"
        style={{ border: '1px solid rgba(57,255,20,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            {isEdit ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#6b7280] hover:text-[#e8e8e8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" error={errors.name?.message}>
            <input type="text" {...register('name', { required: 'Required' })} className="admin-input" />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <input type="text" {...register('slug', { required: 'Required' })} className="admin-input" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description" error={errors.description?.message}>
              <textarea rows={3} {...register('description', { required: 'Required' })} className="admin-input resize-none" />
            </Field>
          </div>
          <Field label="Price (₹)" error={errors.price?.message}>
            <input type="number" step="0.01" {...register('price', { required: 'Required', min: 0 })} className="admin-input" />
          </Field>
          <Field label="Compare-at price (₹)">
            <input type="number" step="0.01" {...register('compareAtPrice', { min: 0 })} className="admin-input" />
          </Field>
          <Field label="Category" error={errors.categoryId?.message}>
            <select {...register('categoryId', { required: 'Required' })} className="admin-input">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Stock" error={errors.stock?.message}>
            <input type="number" {...register('stock', { required: 'Required', min: 0 })} className="admin-input" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Image URL">
              <input type="url" {...register('images')} placeholder="https://..." className="admin-input" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Tags (comma separated)">
              <input type="text" {...register('tags')} placeholder="hoodie, gaming, neon" className="admin-input" />
            </Field>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-2 block">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    background: selectedSizes.includes(s) ? '#FF3500' : 'rgba(255,255,255,0.05)',
                    color: selectedSizes.includes(s) ? '#0a0a0a' : '#9ca3af',
                    border: '1px solid',
                    borderColor: selectedSizes.includes(s) ? '#FF3500' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Field label="Gradient">
            <select {...register('gradientClass')} className="admin-input">
              {GRADIENTS.map((g) => <option key={g} value={g}>{g.replace('product-gradient-', 'Style ')}</option>)}
            </select>
          </Field>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="accent-[#FF3500] w-4 h-4" />
              <span className="text-sm text-[#9ca3af]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="accent-[#FF3500] w-4 h-4" />
              <span className="text-sm text-[#9ca3af]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Active</span>
            </label>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 mt-2">
            <button type="submit" disabled={saving} className="btn-neon disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline-neon">Cancel</button>
          </div>
        </form>

        <style>{`
          .admin-input {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #e8e8e8;
            font-size: 14px;
            transition: all 0.2s;
          }
          .admin-input:focus { outline: none; border-color: #FF3500; }
        `}</style>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
