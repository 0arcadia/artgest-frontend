<template>
  <div class="layout v-explorar-gal">
    <SidebarGalerista ruta-activa="explorar" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Explorar artistas</h1>
          <p>{{ totalArtistas }} artistas registrados en ArtGest</p>
        </div>
        <div class="topbar__der">
          <button class="btn-sec" @click="$router.push('/galerista/dashboard')">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </button>
        </div>
      </header>

      <div class="contenido">

        <!-- BARRA BÚSQUEDA + FILTROS -->
        <div class="filtros-bar">
          <div class="busqueda-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="buscar" placeholder="Buscar por nombre, disciplina o ciudad…" @input="filtrar" />
          </div>
          <div class="filtros-selects">
            <select v-model="filtroDisciplina" @change="filtrar">
              <option value="">Todas las disciplinas</option>
              <option v-for="d in disciplinas" :key="d">{{ d }}</option>
            </select>
            <select v-model="filtroRegion" @change="filtrar">
              <option value="">Todas las regiones</option>
              <option v-for="r in regiones" :key="r">{{ r }}</option>
            </select>
            <button class="btn-limpiar" v-if="hayFiltros" @click="limpiarFiltros">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Limpiar
            </button>
          </div>
        </div>

        <!-- RESULTADOS -->
        <p class="resultados-txt" v-if="artistasFiltrados.length !== artistas.length">
          {{ artistasFiltrados.length }} resultado{{ artistasFiltrados.length !== 1 ? 's' : '' }}
        </p>

        <!-- GRID ARTISTAS -->
        <div class="artistas-grid" v-if="artistasFiltrados.length > 0">
          <div class="artista-card" v-for="a in artistasFiltrados" :key="a.id">
            <div class="artista-card__header">
              <div class="artista-card__avatar" :style="a.fotoUrl ? { backgroundImage: 'url(' + a.fotoUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center' } : { background: a.color }">
                <span v-if="!a.fotoUrl">{{ a.ini }}</span>
              </div>
              <button class="btn-fav" :class="{ 'btn-fav--activo': a.esFavorito }" @click.stop="toggleFav(a)" :title="a.esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
            <div class="artista-card__body">
              <h3 class="artista-card__nombre">{{ a.nombre }}</h3>
              <p class="artista-card__disc">{{ a.disciplinas }}</p>
              <p class="artista-card__ubicacion" v-if="a.region">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ a.region }}
              </p>
              <p class="artista-card__bio" v-if="a.bio">{{ a.bio }}</p>
            </div>
            <div class="artista-card__stats">
              <span><strong>{{ a.obras }}</strong> obras</span>
              <span><strong>{{ a.ventas }}</strong> ventas</span>
            </div>
            <div class="artista-card__acciones">
              <button class="btn-sec btn-sm" @click="verPortafolio(a)">
                <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Ver portafolio
              </button>
              <button class="btn-primary btn-sm" @click="contactar(a)">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                Contactar
              </button>
            </div>
          </div>
        </div>

        <!-- ESTADO VACÍO -->
        <div class="estado-vacio" v-else-if="!cargando">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3>No se encontraron artistas</h3>
          <p>Intenta con otros términos de búsqueda o cambia los filtros.</p>
          <button class="btn-sec" @click="limpiarFiltros">Limpiar filtros</button>
        </div>

        <!-- CARGANDO -->
        <div class="estado-vacio" v-if="cargando">
          <div class="spinner"></div>
          <p>Cargando artistas…</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarGalerista from '@/components/SidebarGalerista.vue'
import { usuariosAPI } from '@/services/api'
import '@/assets/css/explorar-artistas.css'

const router = useRouter()

const artistas = ref([])
const buscar = ref('')
const filtroDisciplina = ref('')
const filtroRegion = ref('')
const cargando = ref(true)
const favoritosIds = ref([])

const disciplinas = ['Pintura', 'Fotografía', 'Grabado', 'Escultura', 'Arte digital', 'Cerámica', 'Ilustración', 'Artes Visuales']
const regiones = ['Región Metropolitana', 'Región de Valparaíso', 'Región del Biobío', 'Región de La Araucanía', 'Región de Los Lagos']

const colores = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A2A2A', '#6A4A2A', '#2A5A6A', '#5A2A6A', '#6A6A2A']

const totalArtistas = computed(() => artistas.value.length)
const hayFiltros = computed(() => buscar.value || filtroDisciplina.value || filtroRegion.value)

const artistasFiltrados = computed(() => {
  let lista = artistas.value
  const q = buscar.value.toLowerCase().trim()

  if (q) {
    lista = lista.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.disciplinas.toLowerCase().includes(q) ||
      (a.region && a.region.toLowerCase().includes(q))
    )
  }
  if (filtroDisciplina.value) {
    lista = lista.filter(a => a.disciplinas.includes(filtroDisciplina.value))
  }
  if (filtroRegion.value) {
    lista = lista.filter(a => a.region === filtroRegion.value)
  }
  return lista
})

onMounted(async () => {
  try {
    // Cargar favoritos del galerista
    try {
      const favs = await usuariosAPI.listarFavoritos()
      favoritosIds.value = favs.map(f => f._id)
    } catch (e) { /* sin favoritos aún */ }

    // Cargar todos los artistas
    const data = await usuariosAPI.listarArtistas()
    artistas.value = data.map((a, i) => ({
      id: a._id,
      ini: a.nombre ? a.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??',
      color: colores[i % colores.length],
      nombre: a.nombre || 'Artista',
      disciplinas: a.disciplinas?.join(', ') || 'Sin especificar',
      region: a.region || '',
      bio: a.bio ? (a.bio.length > 120 ? a.bio.slice(0, 120) + '…' : a.bio) : '',
      obras: a.totalObras || 0,
      ventas: a.totalVentas || 0,
      esFavorito: favoritosIds.value.includes(a._id),
      fotoUrl: a.fotoUrl || null
    }))
  } catch (err) {
    console.error('Error cargando artistas:', err)
  } finally {
    cargando.value = false
  }
})

function filtrar() { /* reactivo con computed */ }

function limpiarFiltros() {
  buscar.value = ''
  filtroDisciplina.value = ''
  filtroRegion.value = ''
}

async function toggleFav(a) {
  try {
    const resp = await usuariosAPI.toggleFavorito(a.id)
    a.esFavorito = !a.esFavorito
    if (a.esFavorito) {
      favoritosIds.value.push(a.id)
    } else {
      favoritosIds.value = favoritosIds.value.filter(id => id !== a.id)
    }
  } catch (err) {
    console.error('Error toggle favorito:', err)
    alert('Error al actualizar favorito')
  }
}

function verPortafolio(a) {
  router.push(`/portafolio/${a.id}`)
}

function contactar(a) {
  router.push({ path: '/galerista/mensajes', query: { nuevo: a.id } })
}
</script>