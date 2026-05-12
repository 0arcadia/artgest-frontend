<template>
  <div class="layout layout--full v-mensajeria">
    <SidebarArtista ruta-activa="mensajes" />

    <div class="msgs-layout">

      <!-- COL 1: LISTA CONVERSACIONES -->
      <div class="conv-panel">
        <div class="conv-panel__head">
          <p class="conv-panel__titulo">Mensajes</p>
          <button class="btn-nueva-conv" @click="alert('Inicia desde el perfil de un galerista o desde favoritos.')" title="Nueva conversación">
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
            <div class="c-av" :style="{ background: c.color }">
              {{ c.ini }}
              <span v-if="c.online" class="c-av__online"></span>
            </div>
            <div class="conv-info">
              <p class="conv-nombre">{{ c.nombre }}</p>
              <p class="conv-preview">{{ c.preview }}</p>
            </div>
            <div class="conv-meta">
              <p class="conv-hora">{{ c.fecha ? new Date(c.fecha).toLocaleDateString('es-CL', { day:'numeric', month:'short' }) : '' }}</p>
              <div v-if="c.noleido > 0" class="conv-badge">{{ c.noleido }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- COL 2: CHAT -->
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-header__izq">
            <div class="chat-av-wrap">
              <div class="chat-av" :style="{ background: convActiva?.color }">{{ convActiva?.ini }}</div>
              <span v-if="convActiva?.online" class="chat-av-online"></span>
            </div>
            <div>
              <p class="chat-nombre">{{ convActiva?.nombre }}</p>
              <p class="chat-rol">{{ convActiva?.rol }} · {{ convActiva?.online ? 'En línea ahora' : 'Última vez ayer' }}</p>
            </div>
          </div>
          <div class="chat-header__der">
            <div class="icon-btn" title="Ver portafolio"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
            <div class="icon-btn" title="Archivar"><svg viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/></svg></div>
            <div class="icon-btn" title="Más opciones"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></div>
          </div>
        </div>

        <div class="chat-mensajes" ref="chatEl">
          <div class="fecha-sep"><span>Inicio de la conversación</span></div>
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
                <polyline v-if="m.visto" points="23 6 12 17 7 12"/>
              </svg>
            </div>
          </div>
          <div class="escribiendo" :class="{ vis: escribiendo }">
            <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
          </div>
        </div>

        <div class="chat-input-area">
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
              <div class="attach-btn" title="Adjuntar archivo"><svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></div>
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
      <div class="detail-panel">
        <div class="detail__head">
          <div class="detail-av" :style="{ background: convActiva?.color }">{{ convActiva?.ini }}</div>
          <p class="detail-nombre">{{ convActiva?.nombre }}</p>
          <p class="detail-rol">{{ convActiva?.rol }}</p>
          <div class="detail-online" v-if="convActiva?.online"><span></span>En línea ahora</div>
          <div class="detail-btns">
            <div class="d-btn d-btn-terra"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>Mensaje</div>
            <div class="d-btn d-btn-out"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>Perfil</div>
          </div>
        </div>
        <div class="detail__sec">
          <p class="detail__sec-titulo">Información</p>
          <div class="detail-dato"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Santiago, RM</div>
          <div class="detail-dato"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/></svg>@galeriacentro.cl</div>
          <div class="detail-dato"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>galeriacentro.cl</div>
        </div>
        <div class="detail__sec">
          <p class="detail__sec-titulo">Obras consultadas</p>
          <div class="detail-obra">
            <div class="d-obra-thumb" style="background:linear-gradient(135deg,#C8874A,#3D2010);"></div>
            <div><p class="d-obra-titulo">Latencia III</p><p class="d-obra-tec">Óleo · 80×60 cm</p><p class="d-obra-precio">$380.000</p></div>
          </div>
          <div class="detail-obra">
            <div class="d-obra-thumb" style="background:linear-gradient(135deg,#3D2B4A,#6A3A7A);"></div>
            <div><p class="d-obra-titulo">Raíz IV</p><p class="d-obra-tec">Acuarela · 45×60 cm</p><p class="d-obra-precio">$140.000</p></div>
          </div>
        </div>
        <div class="detail__sec">
          <p class="detail__sec-titulo">Archivos compartidos</p>
          <div class="archivos-lista">
            <div class="archivo-item">
              <div class="arch-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <span class="arch-nombre">portafolio_carrasco_2026.pdf</span>
              <span class="arch-size">4.2 MB</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { authAPI, mensajesAPI } from '@/services/api'
import '@/assets/css/mensajeria.css'

const busqueda   = ref('')
const tabActivo  = ref('todas')
const escribiendo = ref(false)
const msgTexto   = ref('')
const chatEl     = ref(null)
const inputEl    = ref(null)
const enviando   = ref(false)

const miId = ref('')

const tabs = [
  { val:'todas',     label:'Todas' },
  { val:'noleidas',  label:'No leídas', badge: 0 },
  { val:'galeristas', label:'Galeristas' },
]

const convs = ref([])
const convActivaId = ref(null)
const convActiva   = computed(() => convs.value.find(c => c.id === convActivaId.value))
const mensajesChat = ref([])

// Cargar conversaciones
onMounted(async () => {
  const usuario = authAPI.getUsuario()
  miId.value = usuario?.id || ''

  try {
    const data = await mensajesAPI.conversaciones()
    const colores = ['#2A4A6A', '#3A6A2A', '#6A2A3A', '#6A5A2A', '#4A3A6A']

    convs.value = data.map((c, i) => ({
      id: c.otroUsuario?._id || c.conversacionId,
      receptorId: c.otroUsuarioId || c.otroUsuario?._id,
      nombre: c.otroUsuario?.nombre || 'Usuario',
      ini: c.otroUsuario?.nombre ? c.otroUsuario.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
      color: colores[i % colores.length],
      rol: c.otroUsuario?.tipoUsuario === 'galerista' ? 'Galerista' : 'Artista',
      online: false,
      noleido: c.noLeidos || 0,
      preview: c.ultimoMensaje || '',
      fecha: c.fecha
    }))

    tabs[1].badge = convs.value.reduce((s, c) => s + c.noleido, 0)

    // Abrir primera conversación
    if (convs.value.length > 0) {
      abrirConv(convs.value[0].id)
    }
  } catch (err) {
    console.error('Error cargando conversaciones:', err)
  }
})

const convsFiltradas = computed(() => {
  return convs.value.filter(c => {
    const q  = busqueda.value.toLowerCase()
    const mb = !q || c.nombre.toLowerCase().includes(q)
    const mt = tabActivo.value === 'todas' ||
      (tabActivo.value === 'noleidas' && c.noleido > 0) ||
      (tabActivo.value === 'galeristas' && c.rol.toLowerCase().includes('galeri'))
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
      console.error('Error cargando mensajes:', err)
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

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}
</script>