<template>
  <aside class="sidebar" :class="{ 'sidebar--abierto': menuAbierto }">
    <div class="sidebar__logo">
      <router-link to="/">ArtGest</router-link>
      <p>Panel artista</p>
    </div>

    <nav class="sidebar__nav">
      <div class="nav-group">
        <p class="nav-group__label">Principal</p>
        <router-link class="nav-item" to="/artista/dashboard" :class="{ activo: rutaActiva === 'dashboard' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link class="nav-item" to="/artista/inventario" :class="{ activo: rutaActiva === 'inventario' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          Inventario de obras
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Oportunidades</p>
        <router-link class="nav-item" to="/artista/convocatorias" :class="{ activo: rutaActiva === 'convocatorias' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Convocatorias
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Gestión</p>
        <router-link class="nav-item" to="/artista/certificados" :class="{ activo: rutaActiva === 'certificados' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
          Certificados
        </router-link>
        <router-link class="nav-item" to="/artista/mensajes" :class="{ activo: rutaActiva === 'mensajes' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Mensajes
        </router-link>
      </div>

      <div class="nav-group">
        <p class="nav-group__label">Cuenta</p>
        <router-link class="nav-item" to="/artista/perfil" :class="{ activo: rutaActiva === 'perfil' }" @click="cerrarMenu">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi perfil
        </router-link>
        <div class="nav-item" @click="cerrarSesion">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </div>
      </div>
    </nav>

    <div class="sidebar__perfil">
      <div class="s-av" v-if="!fotoUrl">{{ iniciales }}</div>
      <img v-else :src="fotoUrl" class="s-av-img" alt="Foto de perfil"/>
      <div class="sidebar__perfil-info">
        <p>{{ nombreUsuario }}</p>
        <p>Artista visual</p>
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
const nombreUsuario = ref('Artista')
const iniciales = ref('AG')
const fotoUrl = ref('')

onMounted(() => {
  const u = authAPI.getUsuario()
  if (u) {
    nombreUsuario.value = u.nombre || 'Artista'
    iniciales.value = u.nombre ? u.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AG'
    fotoUrl.value = u.fotoUrl || ''
  }
})

function cerrarMenu() { menuAbierto.value = false }
function cerrarSesion() {
  authAPI.logout()
}
</script>