<template>
  <div class="layout v-dash-artista">
    <SidebarArtista ruta-activa="dashboard" />

    <div class="main">
      <!-- TOPBAR -->
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Dashboard</h1>
          <p>{{ fechaHoy }}</p>
        </div>
        <div class="topbar__der">
          <router-link to="/artista/mensajes" class="topbar__notif">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span class="notif-dot" v-if="mensajes.some(m => m.noLeido)"></span>
          </router-link>
          <router-link to="/artista/inventario" class="btn-nuevo">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva obra
          </router-link>
        </div>
      </header>

      <div class="contenido">

        <!-- SALUDO -->
        <div class="saludo">
          <h2 class="saludo__titulo">Hola, <em>{{ usuario.nombre }}</em> 👋</h2>
          <p class="saludo__sub">Aquí tienes el resumen de tu actividad en ArteGest.</p>
        </div>

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card" v-for="s in stats" :key="s.label">
            <div class="stat-card__top">
              <div class="stat-card__icon" :class="s.iconClass">
                <svg viewBox="0 0 24 24" v-html="s.iconPath"></svg>
              </div>
              <span class="stat-card__delta" :class="s.deltaClass">{{ s.delta }}</span>
            </div>
            <p class="stat-card__valor">{{ s.valor }}</p>
            <p class="stat-card__label">{{ s.label }}</p>
          </div>
        </div>

        <!-- PROGRESO PERFIL -->
        <div class="panel-card progreso-wrap">
          <div class="perfil-progreso">
            <div class="progreso-circle">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#EDE6DC" stroke-width="4"/>
                <circle cx="26" cy="26" r="22" fill="none" stroke="#C1440E" stroke-width="4"
                  stroke-dasharray="138.2" :stroke-dashoffset="strokeOffset" stroke-linecap="round"/>
              </svg>
              <span class="progreso-circle__num">{{ progresoPerfil }}%</span>
            </div>
            <div class="perfil-progreso__info">
              <p>Completa tu perfil para aparecer en más búsquedas</p>
              <p>Falta: foto de perfil y sitio web.
                <router-link to="/artista/perfil" style="color:var(--terra);font-weight:500;">Completar ahora →</router-link>
              </p>
            </div>
          </div>
        </div>

        <!-- GRID PRINCIPAL -->
        <div class="grid-2">

          <!-- POSTULACIONES -->
          <div class="panel-card">
            <div class="panel-card__head">
              <p class="panel-card__titulo">Mis postulaciones</p>
              <router-link to="/artista/postulaciones" class="panel-card__ver">Ver todas →</router-link>
            </div>
            <div class="panel-card__body" style="padding:0;">
              <table class="tabla-post">
                <thead>
                  <tr>
                    <th style="padding:1rem 1.5rem 0.75rem;">Convocatoria</th>
                    <th style="padding:1rem 1.5rem 0.75rem;">Entidad</th>
                    <th style="padding:1rem 1.5rem 0.75rem;">Cierre</th>
                    <th style="padding:1rem 1.5rem 0.75rem;">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in postulaciones" :key="p.id">
                    <td style="padding:0.9rem 1.5rem;">{{ p.titulo }}</td>
                    <td style="padding:0.9rem 1.5rem;">{{ p.entidad }}</td>
                    <td style="padding:0.9rem 1.5rem;">{{ p.cierre }}</td>
                    <td style="padding:0.9rem 1.5rem;">
                      <span class="badge" :class="badgeClass(p.estado)">{{ p.estado }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- COLUMNA DERECHA -->
          <div style="display:flex;flex-direction:column;gap:1.5rem;">

            <!-- ACCESOS RÁPIDOS -->
            <div class="panel-card">
              <div class="panel-card__head">
                <p class="panel-card__titulo">Accesos rápidos</p>
              </div>
              <div class="panel-card__body">
                <div class="accesos">
                  <router-link class="acceso-btn" v-for="a in accesos" :key="a.titulo" :to="a.ruta">
                    <div class="acceso-btn__icon">{{ a.icon }}</div>
                    <div>
                      <p class="acceso-btn__titulo">{{ a.titulo }}</p>
                      <p class="acceso-btn__sub">{{ a.sub }}</p>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- MENSAJES -->
            <div class="panel-card">
              <div class="panel-card__head">
                <p class="panel-card__titulo">Mensajes recientes</p>
                <router-link to="/artista/mensajes" class="panel-card__ver">Ver todos →</router-link>
              </div>
              <div class="msgs">
                <div class="msg-item" :class="{ 'no-leido': m.noLeido }" v-for="m in mensajes" :key="m.id">
                  <div class="msg-avatar" :style="{ background: m.fotoUrl ? `url(${m.fotoUrl}) center/cover` : m.color }">
                    <span v-if="!m.fotoUrl">{{ m.ini }}</span>
                  </div>
                  <div class="msg-info">
                    <p class="msg-titulo">{{ m.nombre }}</p>
                    <p class="msg-preview">{{ m.preview }}</p>
                  </div>
                  <div class="msg-meta">
                    <p class="msg-hora">{{ m.hora }}</p>
                    <div v-if="m.noLeido" class="msg-dot"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- OBRAS RECIENTES -->
        <div class="panel-card" style="margin-top:1.5rem;">
          <div class="panel-card__head">
            <p class="panel-card__titulo">Obras recientes</p>
            <router-link to="/artista/inventario" class="panel-card__ver">Ver inventario completo →</router-link>
          </div>
          <div class="panel-card__body">
            <div class="obras-mini">
              <div class="obra-mini" v-for="o in obrasRecientes" :key="o.id">
                <div class="obra-mini__thumb" :style="{ background: o.color }"></div>
                <div class="obra-mini__info">
                  <p class="obra-mini__titulo">{{ o.titulo }}</p>
                  <p class="obra-mini__tecnica">{{ o.tecnica }}</p>
                </div>
                <span class="badge" :class="badgeClass(o.disp)" style="margin-right:0.5rem;">{{ o.disp }}</span>
                <p class="obra-mini__precio">{{ o.precio }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { authAPI, obrasAPI, postulacionesAPI, mensajesAPI } from '@/services/api'
import '@/assets/css/dashboard-artista.css'

// ── DATOS DEL USUARIO ──
const usuarioLocal = authAPI.getUsuario()
const usuario = ref({ nombre: usuarioLocal?.nombre || 'Artista' })

const fechaHoy = new Date().toLocaleDateString('es-CL', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

// ── ESTADO ──
const progresoPerfil = ref(0)
const strokeOffset = computed(() => 138.2 - (138.2 * progresoPerfil.value) / 100)
const camposFaltantes = ref([])

const stats = ref([
  { label:'Obras en portafolio',    valor:'0', delta:'—', iconClass:'icon-terra', deltaClass:'delta-pos', iconPath:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  { label:'Obras disponibles',      valor:'0', delta:'—', iconClass:'icon-azul',  deltaClass:'delta-pos', iconPath:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
  { label:'Postulaciones activas',  valor:'0', delta:'—', iconClass:'icon-ambar', deltaClass:'delta-pos', iconPath:'<path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  { label:'Obras vendidas',         valor:'0', delta:'—', iconClass:'icon-verde', deltaClass:'delta-pos', iconPath:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
])

const postulaciones = ref([])
const mensajes = ref([])
const obrasRecientes = ref([])

const accesos = ref([
  { icon:'🖼️', titulo:'Agregar obra',    sub:'Subir al inventario',  ruta:'/artista/inventario' },
  { icon:'📣', titulo:'Convocatorias',   sub:'Ver abiertas',          ruta:'/artista/convocatorias' },
  { icon:'📄', titulo:'Certificados',    sub:'Mis documentos',        ruta:'/artista/certificados' },
  { icon:'👤', titulo:'Mi perfil',       sub:'Ver portafolio',        ruta:'/artista/perfil' },
])

// ── CARGAR DATOS REALES ──
onMounted(async () => {
  try {
    const me = await authAPI.me()
    usuario.value.nombre = me.nombre

    const campos = ['nombre', 'email', 'bio', 'fotoUrl', 'region', 'sitioWeb', 'instagram']
    const completados = campos.filter(c => me[c] && me[c].length > 0).length
    const disciplinasOk = me.disciplinas && me.disciplinas.length > 0 ? 1 : 0
    progresoPerfil.value = Math.round(((completados + disciplinasOk) / (campos.length + 1)) * 100)
    camposFaltantes.value = campos.filter(c => !me[c] || me[c].length === 0)

    const obrasData = await obrasAPI.listar()
    stats.value[0].valor = String(obrasData.stats.total)
    stats.value[0].delta = obrasData.stats.total > 0 ? `${obrasData.stats.total} obras` : 'Sin obras aún'
    stats.value[1].valor = String(obrasData.stats.disponibles)
    stats.value[1].delta = obrasData.stats.disponibles > 0 ? `${obrasData.stats.disponibles} disponibles` : '—'
    stats.value[3].valor = String(obrasData.stats.vendidas)
    stats.value[3].delta = obrasData.stats.vendidas > 0 ? `${obrasData.stats.vendidas} vendidas` : '—'

    obrasRecientes.value = obrasData.obras.slice(0, 4).map(o => ({
      id: o._id,
      titulo: o.titulo,
      tecnica: `${o.tecnica}${o.dimensiones ? ' · ' + o.dimensiones : ''}${o.anio ? ' · ' + o.anio : ''}`,
      color: o.imagenUrl
        ? `url(${o.imagenUrl}) center/cover`
        : 'linear-gradient(135deg,#C8874A,#7A4A20)',
      disp: o.estado === 'disponible' ? 'Disponible' : o.estado === 'vendida' ? 'Vendida' : o.estado === 'reservada' ? 'Reservada' : 'No disponible',
      precio: o.precio ? `$${o.precio.toLocaleString('es-CL')}` : '—'
    }))
  } catch (err) {
    console.error('Error cargando obras:', err)
  }

  try {
    const posts = await postulacionesAPI.listar()
    stats.value[2].valor = String(posts.length)
    stats.value[2].delta = posts.length > 0 ? `${posts.length} postulaciones` : '—'

    postulaciones.value = posts.slice(0, 5).map(p => ({
      id: p._id,
      titulo: p.convocatoriaId?.titulo || 'Convocatoria',
      entidad: p.convocatoriaId?.entidad || '—',
      cierre: p.convocatoriaId?.fechaCierre
        ? new Date(p.convocatoriaId.fechaCierre).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
        : '—',
      estado: p.estado === 'en revisión' ? 'En revisión'
            : p.estado === 'enviada' ? 'Enviada'
            : p.estado === 'aceptada' ? 'Aceptada'
            : 'Rechazada'
    }))
  } catch (err) {
    console.error('Error cargando postulaciones:', err)
  }

  try {
    const convs = await mensajesAPI.conversaciones()
    const colores = ['#2A4A6A', '#3A6A2A', '#6A2A3A', '#4A3A6A', '#6A4A2A']

    mensajes.value = convs.slice(0, 3).map((c, i) => ({
      id: c.conversacionId,
      ini: c.otroUsuario?.nombre ? c.otroUsuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??',
      color: colores[i % colores.length],
      fotoUrl: c.otroUsuario?.fotoUrl || '',
      nombre: c.otroUsuario?.nombre || 'Usuario',
      preview: c.ultimoMensaje ? (c.ultimoMensaje.length > 40 ? c.ultimoMensaje.slice(0, 40) + '…' : c.ultimoMensaje) : '',
      hora: new Date(c.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
      noLeido: c.noLeidos > 0
    }))
  } catch (err) {
    console.error('Error cargando mensajes:', err)
  }
})

function badgeClass(estado) {
  const map = {
    'Enviada':'badge-enviada','En revisión':'badge-revision',
    'Aceptada':'badge-aceptada','Rechazada':'badge-rechazada',
    'Disponible':'badge-enviada','Vendida':'badge-aceptada','Reservada':'badge-revision'
  }
  return map[estado] || ''
}
</script>