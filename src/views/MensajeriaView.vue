<template>
  <div class="layout layout--full v-mensajeria">
    <component :is="sidebarComponent" ruta-activa="mensajes" />

    <div class="msgs-layout">

      <!-- COL 1: LISTA CONVERSACIONES -->
      <div class="conv-panel">
        <div class="conv-panel__head">
          <p class="conv-panel__titulo">Mensajes</p>
          <button class="btn-nueva-conv" @click="mostrarNuevaConv" title="Nueva conversación">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div class="conv-search">
          <div class="conv-search__wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="busqueda" placeholder="Buscar conversación…"/>
          </div>
        </div>
        <div class="conv-tabs">
          <div class="conv-tab" v-for="t in tabs" :key="t.val"
            :class="{ activo: tabActivo === t.val }"
            @click="tabActivo = t.val">
            {{ t.label }}
            <span v-if="t.badge" class="tab-badge">{{ t.badge }}</span>
          </div>
        </div>
        <div class="conv-lista">
          <div
            class="conv-item"
            v-for="c in convsFiltradas"
            :key="c.id"
            :class="{ activo: convActivaId === c.id, noleido: c.noleido > 0 }"
            @click="abrirConv(c.id)"
          >
            <img v-if="c.fotoUrl" :src="c.fotoUrl" class="c-av-img" />
            <div v-else class="c-av" :style="{ background: c.color }">
              {{ c.ini }}
              <span v-if="c.online" class="c-av__online"></span>
            </div>
            <div class="conv-info">
              <p class="conv-nombre">{{ c.nombre }}</p>
              <p class="conv-preview">{{ c.preview }}</p>
            </div>
            <div class="conv-meta">
              <p class="conv-hora">{{ c.fechaStr }}</p>
              <div v-if="c.noleido > 0" class="conv-badge">{{ c.noleido }}</div>
            </div>
          </div>
          <div v-if="convs.length === 0 && !cargando" style="padding:2rem;text-align:center;">
            <p style="font-size:0.85rem;color:var(--gris);">No tienes conversaciones aún.</p>
          </div>
        </div>
      </div>

      <!-- COL 2: CHAT -->
      <div class="chat-panel">
        <div class="chat-header" v-if="convActiva">
          <div class="chat-header__izq">
            <div class="chat-av-wrap">
              <img v-if="convActiva.fotoUrl" :src="convActiva.fotoUrl" class="chat-av-img" />
              <div v-else class="chat-av" :style="{ background: convActiva.color }">{{ convActiva.ini }}</div>
              <span v-if="convActiva.online" class="chat-av-online"></span>
            </div>
            <div>
              <p class="chat-nombre">{{ convActiva.nombre }}</p>
              <p class="chat-rol">{{ convActiva.rol }}</p>
            </div>
          </div>
          <div class="chat-header__der">
            <div class="icon-btn" title="Ver portafolio" @click="verPerfilOtro" v-if="convActiva.rol === 'Artista'">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
          </div>
        </div>
        <div class="chat-header" v-else>
          <div class="chat-header__izq">
            <p class="chat-nombre" style="color:var(--gris);">Selecciona una conversación</p>
          </div>
        </div>

        <div class="chat-mensajes" ref="chatEl">
          <div class="fecha-sep" v-if="mensajesChat.length > 0"><span>Inicio de la conversación</span></div>
          <div
            v-for="m in mensajesChat"
            :key="m.id"
            class="msg-burbuja"
            :class="m.de === 'yo' ? 'mio' : 'otro'"
          >
            <div class="burbuja">{{ m.txt }}</div>
            <div class="msg-hora-txt">
              {{ m.hora }}
              <svg v-if="m.de === 'yo'" viewBox="0 0 24 24" :style="{ stroke: m.visto ? '#1A5FAD' : 'var(--gris)' }">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
          <div v-if="!convActiva && mensajesChat.length === 0" style="flex:1;display:flex;align-items:center;justify-content:center;">
            <p style="font-size:0.9rem;color:var(--gris);">Selecciona o inicia una conversación</p>
          </div>
        </div>

        <div class="chat-input-area" v-if="convActiva">
          <div class="chat-input-wrap">
            <textarea
              ref="inputEl"
              v-model="msgTexto"
              placeholder="Escribe un mensaje…"
              rows="1"
              @input="autoResize"
              @keydown.enter.exact.prevent="enviar"
            ></textarea>
            <div class="chat-actions">
              <button class="send-btn" :class="{ off: !msgTexto.trim() }" @click="enviar">
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
          <div class="chat-pie">
            <p>Enter para enviar · Shift+Enter para nueva línea</p>
            <p>{{ msgTexto.length > 0 ? msgTexto.length + ' car.' : '' }}</p>
          </div>
        </div>
      </div>

      <!-- COL 3: DETALLE -->
      <div class="detail-panel" v-if="convActiva">
        <div class="detail__head">
          <img v-if="convActiva.fotoUrl" :src="convActiva.fotoUrl" class="detail-av-img" />
          <div v-else class="detail-av" :style="{ background: convActiva.color }">{{ convActiva.ini }}</div>
          <p class="detail-nombre">{{ convActiva.nombre }}</p>
          <p class="detail-rol">{{ convActiva.rol }}</p>
          <div class="detail-btns">
            <div class="d-btn d-btn-terra" @click="verPerfilOtro" v-if="convActiva.rol === 'Artista'">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              Portafolio
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI, mensajesAPI, usuariosAPI } from '@/services/api'
import '@/assets/css/mensajeria.css'

const SidebarArtista = defineAsyncComponent(() => import('@/components/SidebarArtista.vue'))
const SidebarGalerista = defineAsyncComponent(() => import('@/components/SidebarGalerista.vue'))

const router = useRouter()
const route = useRoute()

const perfil = authAPI.getPerfil()
const sidebarComponent = computed(() => perfil === 'galerista' ? SidebarGalerista : SidebarArtista)

const busqueda   = ref('')
const tabActivo  = ref('todas')
const msgTexto   = ref('')
const chatEl     = ref(null)
const inputEl    = ref(null)
const enviando   = ref(false)
const cargando   = ref(true)
const miId       = ref('')

const tabs = [
  { val:'todas',     label:'Todas' },
  { val:'noleidas',  label:'No leídas', badge: 0 },
]

const convs = ref([])
const convActivaId = ref(null)
const convActiva   = computed(() => convs.value.find(c => c.id === convActivaId.value))
const mensajesChat = ref([])

const colores = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A2A3A', '#6A5A2A', '#4A3A6A', '#2A5A6A']

onMounted(async () => {
  const usuario = authAPI.getUsuario()
  miId.value = usuario?._id || usuario?.id || ''

  try {
    const data = await mensajesAPI.conversaciones()
    convs.value = data.map((c, i) => ({
      id: c.otroUsuario?._id || c.conversacionId,
      receptorId: c.otroUsuarioId || c.otroUsuario?._id,
      nombre: c.otroUsuario?.nombre || 'Usuario',
      ini: c.otroUsuario?.nombre ? c.otroUsuario.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
      color: colores[i % colores.length],
      fotoUrl: c.otroUsuario?.fotoUrl || '',
      rol: c.otroUsuario?.tipoUsuario === 'galerista' ? 'Galerista' : 'Artista',
      online: false,
      noleido: c.noLeidos || 0,
      preview: c.ultimoMensaje || '',
      fecha: c.fecha,
      fechaStr: c.fecha ? new Date(c.fecha).toLocaleDateString('es-CL', { day:'numeric', month:'short' }) : ''
    }))

    tabs[1].badge = convs.value.reduce((s, c) => s + c.noleido, 0)

    // Manejar ?nuevo=ID para iniciar conversación nueva
    const nuevoId = route.query.nuevo
    if (nuevoId) {
      await iniciarConversacionNueva(nuevoId)
    } else if (convs.value.length > 0) {
      abrirConv(convs.value[0].id)
    }
  } catch (err) {
    console.error('Error cargando conversaciones:', err)
  } finally {
    cargando.value = false
  }
})

async function iniciarConversacionNueva(artistaId) {
  // Verificar si ya existe una conversación con este usuario
  const existente = convs.value.find(c => c.receptorId === artistaId || c.id === artistaId)
  if (existente) {
    abrirConv(existente.id)
    return
  }

  // Crear una nueva conversación (obtener datos del usuario)
  try {
    const { artista } = await usuariosAPI.perfilPublico(artistaId)
    const nombre = artista.nombre || 'Artista'
    const nuevaConv = {
      id: artistaId,
      receptorId: artistaId,
      nombre,
      ini: nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(),
      color: colores[convs.value.length % colores.length],
      fotoUrl: artista.fotoUrl || '',
      rol: 'Artista',
      online: false,
      noleido: 0,
      preview: '',
      fecha: null,
      fechaStr: 'Nuevo'
    }
    convs.value.unshift(nuevaConv)
    convActivaId.value = artistaId
    mensajesChat.value = []
  } catch (err) {
    console.error('Error iniciando conversación:', err)
    // Fallback: abrir conversación de todos modos
    const nuevaConv = {
      id: artistaId,
      receptorId: artistaId,
      nombre: 'Artista',
      ini: '??',
      color: colores[0],
      rol: 'Artista',
      online: false,
      noleido: 0,
      preview: '',
      fecha: null,
      fechaStr: 'Nuevo'
    }
    convs.value.unshift(nuevaConv)
    convActivaId.value = artistaId
    mensajesChat.value = []
  }
}

const convsFiltradas = computed(() => {
  return convs.value.filter(c => {
    const q  = busqueda.value.toLowerCase()
    const mb = !q || c.nombre.toLowerCase().includes(q)
    const mt = tabActivo.value === 'todas' ||
      (tabActivo.value === 'noleidas' && c.noleido > 0)
    return mb && mt
  })
})

async function abrirConv(id) {
  convActivaId.value = id
  const c = convs.value.find(x => x.id === id)
  if (c) {
    c.noleido = 0
    try {
      const data = await mensajesAPI.obtenerMensajes(c.receptorId || id)
      mensajesChat.value = data.mensajes.map(m => ({
        id: m._id,
        de: m.emisorId?._id === miId.value || m.emisorId === miId.value ? 'yo' : 'otro',
        txt: m.contenido,
        hora: new Date(m.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        visto: m.leido
      }))
      nextTick(() => { if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight })
    } catch (err) {
      // Si falla es porque no hay mensajes aún (conversación nueva)
      mensajesChat.value = []
    }
  }
}

async function enviar() {
  const txt = msgTexto.value.trim()
  if (!txt || enviando.value) return
  const c = convActiva.value
  if (!c) return

  enviando.value = true
  try {
    const receptorId = c.receptorId || c.id
    const msgNuevo = await mensajesAPI.enviar(receptorId, txt)

    const hora = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    mensajesChat.value.push({ id: msgNuevo._id || Date.now(), de: 'yo', txt, hora, visto: false })
    msgTexto.value = ''
    c.preview = txt
    c.fechaStr = hora
    if (inputEl.value) { inputEl.value.style.height = 'auto' }
    await nextTick()
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  } catch (err) {
    console.error('Error al enviar mensaje:', err)
    alert(err.response?.data?.mensaje || 'Error al enviar el mensaje')
  } finally {
    enviando.value = false
  }
}

function verPerfilOtro() {
  if (convActiva.value) {
    router.push(`/portafolio/${convActiva.value.receptorId || convActiva.value.id}`)
  }
}

function mostrarNuevaConv() {
  if (perfil === 'galerista') {
    router.push('/galerista/explorar')
  } else {
    alert('Inicia una conversación desde el perfil de un galerista o desde convocatorias.')
  }
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}
</script>