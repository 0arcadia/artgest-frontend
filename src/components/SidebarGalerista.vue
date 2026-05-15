<template>
  <aside class="sidebar" :class="{ 'sidebar--abierto': menuAbierto }">
    <div class="sidebar__logo">
      <router-link to="/">ArtGest</router-link>
      <p>Panel galerista</p>
    </div>

    <nav class="sidebar__nav">
      <div class="nav-group">
        <p class="nav-group__label">Principal</p>
        <router-link class="nav-item" to="/galerista/dashboard" :class="{ activo: rutaActiva === 'dashboard' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link class="nav-item" to="/galerista/explorar" :class="{ activo: rutaActiva === 'explorar' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explorar artistas
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Convocatorias</p>
        <router-link class="nav-item" to="/galerista/convocatorias" :class="{ activo: rutaActiva === 'convocatorias' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Mis convocatorias
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Herramientas</p>
        <router-link class="nav-item" to="/galerista/mensajes" :class="{ activo: rutaActiva === 'mensajes' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Mensajes
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Cuenta</p>
        <router-link class="nav-item" to="/galerista/perfil" :class="{ activo: rutaActiva === 'perfil' }" @click="cerrarMenu">
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
      <div class="s-av" style="background:#2A4A6A;">{{ iniciales }}</div>
      <div class="sidebar__perfil-info">
        <p>{{ nombreUsuario }}</p>
        <p>Galerista / Curador</p>
      </div>
    </div>
  </aside>

  <!-- Overlay para cerrar en móvil -->
  <div class="sidebar-overlay" v-if="menuAbierto" @click="cerrarMenu"></div>

  <!-- Botón hamburguesa (solo móvil) -->
  <button class="hamburguesa" @click="menuAbierto = !menuAbierto" :class="{ 'hamburguesa--abierto': menuAbierto }">
    <span></span><span></span><span></span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import '@/assets/css/sidebar.css'

defineProps({ rutaActiva: { type: String, default: '' } })

const router = useRouter()
const menuAbierto = ref(false)
const nombreUsuario = ref('Galerista')
const iniciales = ref('GA')

onMounted(() => {
  const u = authAPI.getUsuario()
  if (u) {
    nombreUsuario.value = u.nombreGaleria || u.nombre || 'Galerista'
    const name = u.nombre || 'GA'
    iniciales.value = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
  }
})

function cerrarMenu() { menuAbierto.value = false }
function cerrarSesion() {
  authAPI.logout()
}
</script>