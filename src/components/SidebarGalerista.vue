<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <router-link to="/">ArtGest</router-link>
      <p>Panel galerista</p>
    </div>

    <nav class="sidebar__nav">
      <div class="nav-group">
        <p class="nav-group__label">Principal</p>
        <router-link class="nav-item" to="/galerista/dashboard" :class="{ activo: rutaActiva === 'dashboard' }">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link class="nav-item" to="/galerista/explorar" :class="{ activo: rutaActiva === 'explorar' }">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explorar artistas
        </router-link>
        <router-link class="nav-item" to="/galerista/favoritos" :class="{ activo: rutaActiva === 'favoritos' }">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Artistas favoritos
          <span class="nav-badge">6</span>
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Convocatorias</p>
        <router-link class="nav-item" to="/galerista/convocatorias" :class="{ activo: rutaActiva === 'convocatorias' }">
          <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Mis convocatorias
        </router-link>
        <router-link class="nav-item" to="/galerista/postulaciones" :class="{ activo: rutaActiva === 'postulaciones' }">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          Postulaciones recibidas
          <span class="nav-badge">8</span>
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Herramientas</p>
        <router-link class="nav-item" to="/galerista/mensajes" :class="{ activo: rutaActiva === 'mensajes' }">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Mensajes
          <span class="nav-badge">4</span>
        </router-link>
        <router-link class="nav-item" to="/galerista/verificar" :class="{ activo: rutaActiva === 'verificar' }">
          <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          Verificar certificados
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Cuenta</p>
        <router-link class="nav-item" to="/galerista/perfil" :class="{ activo: rutaActiva === 'perfil' }">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi perfil de galería
        </router-link>
        <div class="nav-item" @click="cerrarSesion">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </div>
      </div>
    </nav>

    <div class="sidebar__perfil">
      <div class="s-av" style="background:#2A4A6A;">GC</div>
      <div class="sidebar__perfil-info">
        <p>Galería Centro</p>
        <p>Galerista / Curador</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import '@/assets/css/sidebar.css'

defineProps({ rutaActiva: { type: String, default: '' } })

const router = useRouter()
function cerrarSesion() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>