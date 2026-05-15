<template>
  <div class="portafolio-page">

    <!-- NAVBAR PÚBLICA -->
    <nav class="nav" :class="{ clara: navClara }">
      <div class="nav__inner">
        <router-link to="/" class="nav__logo">ArteGest</router-link>
        <button onclick="history.back()" title="Volver" style="margin-left:1rem;width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div class="nav__der">
          <a href="#" onclick="history.back(); return false;" class="nav__link">← Volver</a>
          <a href="#obras" class="nav__link">Ver obras</a>
          <router-link to="/login" class="nav__btn-out">Iniciar sesión</router-link>
          <router-link to="/login" class="nav__btn-terra">Registrarse</router-link>
        </div>
      </div>
    </nav>

    <!-- HERO ARTISTA -->
    <section class="hero-artista">
      <div class="hero-artista__foto" :style="artista.bannerUrl ? { backgroundImage: `url(${artista.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"></div>
      <div class="hero-artista__inner">
        <div class="artista-avatar" v-if="!artista.fotoUrl">{{ artista.iniciales }}</div>
        <img v-else :src="artista.fotoUrl" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);" alt="Foto"/>
        <div class="artista-info">
          <span class="artista-info__tag">Artista visual · {{ artista.region }}</span>
          <h1 class="artista-info__nombre">{{ artista.nombre }}</h1>
          <div class="artista-info__disciplinas">
            <span class="disciplina-chip" v-for="d in artista.disciplinas" :key="d">{{ d }}</span>
          </div>
          <p class="artista-info__bio">{{ artista.bio }}</p>
        </div>
        <div class="artista-stats">
          <div class="astat" v-for="s in artista.stats" :key="s.label">
            <p class="astat__num">{{ s.num }}</p>
            <p class="astat__label">{{ s.label }}</p>
          </div>
        </div>
      </div>
      <div class="artista-meta">
        <div class="meta-item" v-if="artista.region">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ artista.region }}
        </div>
        <div class="meta-item" v-if="artista.instagram">
          <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <a :href="'https://instagram.com/' + artista.instagram" target="_blank">@{{ artista.instagram }}</a>
        </div>
        <div class="meta-item" v-if="artista.web">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
          <a :href="artista.web" target="_blank">{{ artista.web.replace('https://','') }}</a>
        </div>
        <div class="meta-sep"></div>
        <button class="btn-favorito" :class="{ guardado: favorito }" @click="toggleFav">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          {{ favorito ? 'Artista guardada' : 'Guardar artista' }}
        </button>
        <button class="btn-contactar" @click="contactar">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Contactar
        </button>
      </div>
    </section>

    <!-- CONTENIDO -->
    <div class="portafolio-contenido" id="obras">

      <!-- FILTROS -->
      <div class="filtros">
        <button
          class="filtro-pill"
          v-for="f in filtrosPills"
          :key="f.val"
          :class="{ activo: filtroActivo === f.val }"
          @click="filtroActivo = f.val"
        >{{ f.label }}</button>
        <div class="filtros__sep"></div>
        <span class="filtros__count">{{ obrasFiltradas.length }} obra{{ obrasFiltradas.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- GRID -->
      <div class="obras-grid" v-if="obrasFiltradas.length">
        <div class="obra-card" v-for="o in obrasFiltradas" :key="o.id" @click="abrirObra(o)">
          <div class="obra-card__img">
            <div class="obra-card__thumb" :style="{ background: o.color }"></div>
            <div class="obra-card__badge">
              <span class="badge" :class="badgeClass(o.disp)">{{ dispLabel(o.disp) }}</span>
            </div>
            <div class="obra-card__overlay">
              <p class="obra-card__titulo-h">{{ o.titulo }}</p>
              <p class="obra-card__precio-h">{{ precioFmt(o.precio) }}</p>
              <span class="obra-card__ver">Ver detalle →</span>
            </div>
          </div>
          <div class="obra-card__info">
            <p class="obra-card__nombre">{{ o.titulo }}</p>
            <p class="obra-card__tec">{{ o.tecnica }}{{ o.dims ? ' · ' + o.dims : '' }}</p>
            <div class="obra-card__pie">
              <p class="obra-card__precio-txt">{{ precioFmt(o.precio) }}</p>
              <p class="obra-card__anio">{{ o.anio }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <p>No hay obras con ese filtro.</p>
      </div>

    </div>

    <!-- MODAL DETALLE -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalObra" @click="cerrarModal">
        <div class="modal" @click.stop>
          <div class="modal__img" :style="{ background: obraActual?.color }">
            <img v-if="obraActual?.imagenUrl" :src="obraActual.imagenUrl" :alt="obraActual.titulo" style="width:100%;height:100%;object-fit:contain;background:#f5f0eb;"/>
            <button class="modal__cerrar" @click="modalObra = false; document.body.style.overflow = ''">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal__cuerpo" v-if="obraActual">
            <div>
              <p class="modal__tag">{{ obraActual.serie || 'Obra individual' }}</p>
              <h2 class="modal__titulo">{{ obraActual.titulo }}</h2>
            </div>
            <p class="modal__precio">{{ precioFmt(obraActual.precio) }}</p>
            <span class="badge" :class="badgeClass(obraActual.disp)">{{ dispLabel(obraActual.disp) }}</span>
            <div class="modal__divider"></div>
            <div class="ficha-grid">
              <div><p class="ficha-label">Técnica</p><p class="ficha-val">{{ obraActual.tecnica }}</p></div>
              <div><p class="ficha-label">Año</p><p class="ficha-val">{{ obraActual.anio }}</p></div>
              <div><p class="ficha-label">Dimensiones</p><p class="ficha-val">{{ obraActual.dims || '—' }}</p></div>
              <div><p class="ficha-label">Disponibilidad</p><p class="ficha-val">{{ dispLabel(obraActual.disp) }}</p></div>
            </div>
            <div class="modal__divider"></div>
            <p class="modal__desc">{{ obraActual.desc }}</p>
            <div class="modal__acciones">
              <button v-if="obraActual.disp === 'disponible'" class="btn-contactar-modal" @click="contactar">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Consultar por esta obra
              </button>
              <div v-else-if="obraActual.disp === 'reservada'" class="estado-box">Esta obra está actualmente reservada.</div>
              <div v-else class="estado-box">Esta obra ya fue vendida.</div>
              <button class="btn-compartir" @click="compartir">
                <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Compartir obra
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usuariosAPI, obrasAPI } from '@/services/api'
import '@/assets/css/portafolio-publico.css'

const router = useRouter()
const route  = useRoute()
const navClara = ref(false)
const favorito = ref(false)
const modalObra = ref(false)
const obraActual = ref(null)
const filtroActivo = ref('')

function onScroll() { navClara.value = window.scrollY > 100 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const artista = ref({
  nombre: 'Cargando…',
  iniciales: '...',
  fotoUrl: '',
  bannerUrl: '',
  region: '',
  bio: '',
  disciplinas: [],
  instagram: '',
  web: '',
  stats: [
    { num: '0', label: 'Obras' },
    { num: '0', label: 'Disponibles' },
    { num: '0', label: 'Ventas' },
  ]
})

const obras = ref([])

const filtrosPills = computed(() => {
  const base = [{ val: '', label: 'Todas' }, { val: 'disponible', label: 'Disponibles' }]
  const series = [...new Set(obras.value.map(o => o.serie).filter(Boolean))]
  const tecnicas = [...new Set(obras.value.map(o => o.tecnica))]
  series.forEach(s => base.push({ val: s, label: s }))
  tecnicas.slice(0, 4).forEach(t => base.push({ val: t, label: t }))
  return base
})

onMounted(async () => {
  const artistaId = route.params.id
  if (!artistaId) return

  try {
    const data = await usuariosAPI.perfilPublico(artistaId)
    const a = data.artista
    artista.value = {
      nombre: a.nombre,
      iniciales: a.nombre ? a.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??',
      fotoUrl: a.fotoUrl || '',
      bannerUrl: a.bannerUrl || '',
      region: a.region || '',
      bio: a.bio || '',
      disciplinas: a.disciplinas || [],
      instagram: a.instagram || '',
      web: a.sitioWeb || '',
      stats: [
        { num: String(data.stats.totalObras), label: 'Obras' },
        { num: String(data.stats.obrasDisponibles), label: 'Disponibles' },
        { num: '—', label: 'Ventas' },
      ]
    }
  } catch (err) {
    console.error('Error cargando perfil público:', err)
  }

  try {
    const obrasData = await obrasAPI.portafolioPublico(artistaId)
    obras.value = obrasData.map(o => ({
      id: o._id,
      titulo: o.titulo,
      tecnica: o.tecnica,
      dims: o.dimensiones || '',
      anio: o.anio || '',
      precio: o.precio || 0,
      disp: o.estado,
      serie: o.serie || '',
      desc: o.descripcion || '',
      imagenUrl: o.imagenUrl || '',
      color: o.imagenUrl
        ? `url(${o.imagenUrl}) center/cover`
        : 'linear-gradient(135deg,#888,#444)'
    }))
  } catch (err) {
    console.error('Error cargando obras:', err)
  }
})

const obrasFiltradas = computed(() => {
  if (!filtroActivo.value) return obras.value
  return obras.value.filter(o =>
    o.disp === filtroActivo.value ||
    o.tecnica === filtroActivo.value ||
    o.serie === filtroActivo.value
  )
})

function abrirObra(o) { obraActual.value = o; modalObra.value = true; document.body.style.overflow = 'hidden' }
function cerrarModal(e) { if (e.target.classList.contains('modal-overlay')) { modalObra.value = false; document.body.style.overflow = '' } }

function badgeClass(disp) {
  return { disponible: 'b-disponible', reservada: 'b-reservada', vendida: 'b-vendida' }[disp] || ''
}
function dispLabel(disp) {
  return { disponible: 'Disponible', reservada: 'Reservada', vendida: 'Vendida' }[disp] || disp
}
function precioFmt(p) { return p > 0 ? '$' + p.toLocaleString('es-CL') : 'Precio a consultar' }

function toggleFav() { favorito.value = !favorito.value }
function contactar() {
  modalObra.value = false
  document.body.style.overflow = ''
  router.push('/login')
}
function compartir() {
  navigator.clipboard.writeText(window.location.href).then(() => alert('Enlace copiado al portapapeles'))
}
</script>