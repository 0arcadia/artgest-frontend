// router/index.js
// ArtGest · Proyecto de Título 2026
// Vue Router — rutas públicas, artista y galerista

import { createRouter, createWebHistory } from 'vue-router'

// ── VISTAS PÚBLICAS ──────────────────────────────────
import HomeView            from '@/views/HomeView.vue'
import LoginView           from '@/views/LoginView.vue'
import PortafolioPublicoView from '@/views/PortafolioPublicoView.vue'

// ── VISTAS ARTISTA ───────────────────────────────────
import DashboardArtistaView from '@/views/artista/DashboardArtistaView.vue'
import InventarioView       from '@/views/artista/InventarioView.vue'
import ConvocatoriasView    from '@/views/artista/ConvocatoriasView.vue'
import PostulacionView      from '@/views/artista/PostulacionView.vue'
import CertificadosView     from '@/views/artista/CertificadosView.vue'
import MensajeriaView       from '@/views/MensajeriaView.vue'
import PerfilView           from '@/views/artista/PerfilView.vue'

// ── VISTAS GALERISTA ─────────────────────────────────
import DashboardGaleristaView       from '@/views/galerista/DashboardGaleristaView.vue'
import ExplorarArtistasView         from '@/views/galerista/ExplorarArtistasView.vue'
import MisConvocatoriasGaleristaView from '@/views/galerista/MisConvocatoriasGaleristaView.vue'
import PerfilGaleristaView          from '@/views/galerista/PerfilGaleristaView.vue'

const routes = [
  // ── PÚBLICAS ──
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { publica: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { publica: true }
  },
  {
    path: '/portafolio/:id',
    name: 'portafolio-publico',
    component: PortafolioPublicoView,
    meta: { publica: true }
  },

  // ── ARTISTA ──
  {
    path: '/artista',
    redirect: '/artista/dashboard'
  },
  {
    path: '/artista/dashboard',
    name: 'artista-dashboard',
    component: DashboardArtistaView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/inventario',
    name: 'artista-inventario',
    component: InventarioView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/convocatorias',
    name: 'artista-convocatorias',
    component: ConvocatoriasView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/postulacion',
    name: 'artista-postulacion',
    component: PostulacionView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/certificados',
    name: 'artista-certificados',
    component: CertificadosView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/mensajes',
    name: 'artista-mensajes',
    component: MensajeriaView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },
  {
    path: '/artista/perfil',
    name: 'artista-perfil',
    component: PerfilView,
    meta: { requiereAuth: true, perfil: 'artista' }
  },

  // ── GALERISTA ──
  {
    path: '/galerista',
    redirect: '/galerista/dashboard'
  },
  {
    path: '/galerista/dashboard',
    name: 'galerista-dashboard',
    component: DashboardGaleristaView,
    meta: { requiereAuth: true, perfil: 'galerista' }
  },
  {
    path: '/galerista/explorar',
    name: 'galerista-explorar',
    component: ExplorarArtistasView,
    meta: { requiereAuth: true, perfil: 'galerista' }
  },
  {
    path: '/galerista/convocatorias',
    name: 'galerista-convocatorias',
    component: MisConvocatoriasGaleristaView,
    meta: { requiereAuth: true, perfil: 'galerista' }
  },
  {
    path: '/galerista/mensajes',
    name: 'galerista-mensajes',
    component: MensajeriaView,
    meta: { requiereAuth: true, perfil: 'galerista' }
  },
  {
    path: '/galerista/perfil',
    name: 'galerista-perfil',
    component: PerfilGaleristaView,
    meta: { requiereAuth: true, perfil: 'galerista' }
  },

  // ── REDIRECCIÓN LEGACY ──
  {
    path: '/dashboard',
    redirect: () => {
      const perfil = localStorage.getItem('perfil') || 'artista'
      return perfil === 'galerista' ? '/galerista/dashboard' : '/artista/dashboard'
    }
  },

  // ── 404 ──
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// ── GUARD DE NAVEGACIÓN ──────────────────────────────
router.beforeEach((to, from, next) => {
  const token  = localStorage.getItem('token')
  const perfil = localStorage.getItem('perfil')

  // Ruta pública: siempre permite
  if (to.meta.publica) return next()

  // Sin token: redirige a login
  if (!token) return next('/login')

  // Ruta con perfil especifico
  if (to.meta.perfil && to.meta.perfil !== perfil) {
    return next(perfil === 'galerista' ? '/galerista/dashboard' : '/artista/dashboard')
  }

  next()
})

export default router