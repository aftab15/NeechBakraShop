import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { ProtectedRoute, AdminRoute } from '../components/common/ProtectedRoute'
import { PageLoader } from '../components/common/LoadingSpinner'

const Home = lazy(() => import('../pages/Home'))
const Shop = lazy(() => import('../pages/Shop'))
const ProductDetails = lazy(() => import('../pages/ProductDetails'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'))
const OrderFailed = lazy(() => import('../pages/OrderFailed'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const Terms = lazy(() => import('../pages/Terms'))
const Privacy = lazy(() => import('../pages/Privacy'))
const RefundPolicy = lazy(() => import('../pages/RefundPolicy'))
const ShippingPolicy = lazy(() => import('../pages/ShippingPolicy'))
const Login = lazy(() => import('../pages/Login'))
const Profile = lazy(() => import('../pages/Profile'))
const Orders = lazy(() => import('../pages/Orders'))
const Wishlist = lazy(() => import('../pages/Wishlist'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'))
const AdminProducts = lazy(() => import('../pages/AdminProducts'))
const AdminOrders = lazy(() => import('../pages/AdminOrders'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="refund-policy" element={<RefundPolicy />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="auth" element={<Login />} />
          <Route path="wishlist" element={<Wishlist />} />

          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="order/failed" element={<ProtectedRoute><OrderFailed /></ProtectedRoute>} />
          <Route path="order/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
