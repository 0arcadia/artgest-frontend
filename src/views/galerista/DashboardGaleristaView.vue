<template>
  <div class="layout v-dash-galerista">
    <SidebarGalerista ruta-activa="dashboard" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Dashboard</h1>
          <p>{{ fechaHoy }}</p>
        </div>
        <div class="topbar__der">
          <div class="topbar__notif" @click="notifAbierta = !notifAbierta" style="position:relative;cursor:pointer;">
            <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span class="notif-dot" v-if="tieneNotif"></span>
            <!-- Dropdown notificaciones -->
            <div class="notif-dropdown" v-if="notifAbierta" @click.stop>
              <p class="notif-dropdown__titulo">Notificaciones</p>
              <div class="notif-dropdown__lista">
                <p class="notif-dropdown__vacia" v-if="notificaciones.length === 0">No tienes notificaciones nuevas.</p>
                <div class="notif-item" v-for="n in notificaciones" :key="n.id">
                  <div class="notif-item__dot" :style="{ background: n.color }"></div>
                  <div>
                    <p class="notif-item__txt" v-html="n.txt"></p>
                    <p class="notif-item__hora">{{ n.hora }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="btn-sec" @click="$router.push('/galerista/explorar')">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Explorar artistas
          </button>
          <button class="btn-primary" @click="modalConv = true">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva convocatoria
          </button>
        </div>
      </header>

      <div class="contenido">

        <!-- SALUDO -->
        <div class="saludo">
          <div class="saludo__txt">
            <h2>Hola, <em>{{ nombreGaleria }}</em> 👋</h2>
            <p>Aquí tienes el resumen de tu actividad como galerista en ArtGest.</p>
          </div>
          <span class="galeria-chip">
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            {{ regionGaleria || 'Chile' }}
          </span>
        </div>

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card" v-for="s in stats" :key="s.label">
            <div class="stat-card__top">
              <div class="stat-card__icon" :class="s.iconClass">
                <svg viewBox="0 0 24 24" v-html="s.path"></svg>
              </div>
              <span class="stat-card__delta" :class="s.deltaClass">{{ s.delta }}</span>
            </div>
            <p class="stat-card__val">{{ s.valor }}</p>
            <p class="stat-card__lbl">{{ s.label }}</p>
          </div>
        </div>

        <!-- GRID PRINCIPAL -->
        <div class="grid-main">

          <!-- POSTULACIONES -->
          <div class="panel">
            <div class="panel__head">
              <p class="panel__titulo">Postulaciones recibidas</p>
              <span class="panel__ver" @click="$router.push('/galerista/convocatorias')">Ver todas →</span>
            </div>
            <div class="post-lista">
              <div class="post-item" v-for="p in postulaciones" :key="p.id" @click="cambiarEstado(p)">
                <div class="post-avatar" :style="{ background: p.color }">{{ p.ini }}</div>
                <div class="post-info">
                  <p class="post-artista">{{ p.artista }}</p>
                  <p class="post-conv">{{ p.conv }}</p>
                </div>
                <div class="post-meta">
                  <p class="post-fecha">{{ p.fecha }}</p>
                  <span class="badge" :class="badgeClass(p.estado)">{{ p.estado }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- MIS CONVOCATORIAS -->
          <div class="panel">
            <div class="panel__head">
              <p class="panel__titulo">Mis convocatorias</p>
              <span class="panel__ver" @click="$router.push('/galerista/convocatorias')">Ver todas →</span>
            </div>
            <div class="conv-lista-panel">
              <div class="conv-item-panel" v-for="c in convocatorias" :key="c.id">
                <div class="conv-item__izq">
                  <p class="conv-item__titulo">{{ c.titulo }}</p>
                  <p class="conv-item__sub">Cierra {{ c.cierre }} · {{ c.galeria }}</p>
                </div>
                <div class="conv-item__der">
                  <span class="dias-pill" :class="c.pillClass">{{ c.dias }}</span>
                  <span class="post-count">{{ c.postulaciones }} postulaciones</span>
                </div>
              </div>
              <div style="padding:1rem 1.5rem;">
                <button class="btn-primary" style="width:100%;justify-content:center;" @click="modalConv = true">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Publicar nueva convocatoria
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID INFERIOR -->
        <div class="grid-inf">

          <!-- FAVORITOS -->
          <div class="panel">
            <div class="panel__head"><p class="panel__titulo">Artistas favoritos</p><span class="panel__ver" @click="$router.push('/galerista/explorar')">Ver todos →</span></div>
            <div class="favs-lista">
              <div class="fav-item" v-for="f in favoritos" :key="f.nombre">
                <img v-if="f.fotoUrl" :src="f.fotoUrl" class="fav-avatar-img" />
                <div v-else class="fav-avatar" :style="{ background: f.color }">{{ f.ini }}</div>
                <div class="fav-info">
                  <p class="fav-nombre">{{ f.nombre }}</p>
                  <p class="fav-disc">{{ f.disc }}</p>
                </div>
                <span class="fav-obras">{{ f.obras }} obras</span>
                <div class="btn-msg" @click="$router.push({ path: '/galerista/mensajes', query: { nuevo: f.id } })">
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- MENSAJES -->
          <div class="panel">
            <div class="panel__head"><p class="panel__titulo">Mensajes recientes</p><span class="panel__ver" @click="$router.push('/galerista/mensajes')">Ver todos →</span></div>
            <div class="msgs">
              <div class="msg-item" :class="{ noleido: m.noLeido }" v-for="m in mensajes" :key="m.id" @click="$router.push('/galerista/mensajes')">
                <img v-if="m.fotoUrl" :src="m.fotoUrl" class="msg-av-img" />
                <div v-else class="msg-av" :style="{ background: m.color }">{{ m.ini }}</div>
                <div class="msg-body">
                  <p class="msg-titulo">{{ m.nombre }}</p>
                  <p class="msg-prev">{{ m.preview }}</p>
                </div>
                <div class="msg-right">
                  <p class="msg-hora">{{ m.hora }}</p>
                  <div v-if="m.noLeido" class="msg-dot"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- VERIFICADOR QR + ACTIVIDAD -->
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div class="panel">
              <div class="panel__head"><p class="panel__titulo">Verificar certificado</p></div>
              <div class="qr-widget">
                <p>Ingresa el código QR de una obra para verificar su autenticidad.</p>
                <div class="qr-input-wrap">
                  <input type="text" v-model="codigoQR" placeholder="Ej: ARTG-2026-00847" @keydown.enter="verificar"/>
                  <button class="btn-qr" @click="verificar">Verificar</button>
                </div>
                <div class="qr-result ok" v-if="qrResult === 'ok'">
                  <strong>✓ Certificado válido</strong><br>
                  <span v-if="qrData">Obra: <em>{{ qrData.obra?.titulo || '—' }}</em> · {{ qrData.artista?.nombre || '—' }}<br>Vendida el {{ qrData.fechaVenta ? new Date(qrData.fechaVenta).toLocaleDateString('es-CL') : '—' }}</span>
                </div>
                <div class="qr-result err" v-if="qrResult === 'err'">
                  <strong>✗ Código no encontrado</strong><br>
                  Este código no corresponde a ningún certificado registrado.
                </div>
              </div>
            </div>
            <div class="panel">
              <div class="panel__head"><p class="panel__titulo">Actividad reciente</p></div>
              <div class="actividad">
                <div class="act-item" v-for="a in actividad" :key="a.txt">
                  <div class="act-dot" :style="{ background: a.color }"></div>
                  <div><p class="act-txt" v-html="a.txt"></p><p class="act-hora">{{ a.hora }}</p></div>
                </div>
                <div v-if="actividad.length === 0" style="padding:1rem 1.5rem;">
                  <p style="font-size:0.82rem;color:var(--gris);font-style:italic;">Sin actividad reciente.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL NUEVA CONVOCATORIA -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalConv" @click.self="modalConv = false">
        <div class="modal">
          <div class="modal__head">
            <div><h2 class="modal__titulo">Nueva convocatoria</h2><p class="modal__sub">Completa los datos para publicar.</p></div>
            <button class="modal__cerrar" @click="modalConv = false"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          <div class="modal__body">
            <div class="form-grid">
              <div class="campo fg-full"><label>Título <span class="req">*</span></label><input type="text" v-model="fc.titulo" placeholder="Ej: Convocatoria Artistas Emergentes 2026" :class="{ err: errFc.titulo }"/><span class="campo__error" v-if="errFc.titulo">El título es obligatorio.</span></div>
              <div class="campo"><label>Tipo <span class="req">*</span></label><select v-model="fc.tipo" :class="{ err: errFc.tipo }"><option value="">Selecciona…</option><option v-for="t in tiposConv" :key="t">{{ t }}</option></select><span class="campo__error" v-if="errFc.tipo">Selecciona el tipo.</span></div>
              <div class="campo"><label>Disciplina <span class="req">*</span></label><select v-model="fc.disciplina" :class="{ err: errFc.disciplina }"><option value="">Selecciona…</option><option v-for="d in disciplinasConv" :key="d">{{ d }}</option></select><span class="campo__error" v-if="errFc.disciplina">Selecciona disciplina.</span></div>
              <div class="campo"><label>Fecha de apertura <span class="req">*</span></label><input type="date" v-model="fc.apertura" :class="{ err: errFc.apertura }"/><span class="campo__error" v-if="errFc.apertura">Fecha requerida.</span></div>
              <div class="campo"><label>Fecha de cierre <span class="req">*</span></label><input type="date" v-model="fc.cierre" :class="{ err: errFc.cierre }"/><span class="campo__error" v-if="errFc.cierre">Debe ser posterior a apertura.</span></div>
              <div class="campo"><label>Región</label><select v-model="fc.region"><option value="">Nacional</option><option v-for="r in regionesConv" :key="r">{{ r }}</option></select></div>
              <div class="campo fg-full"><label>Descripción <span class="req">*</span></label><textarea v-model="fc.desc" placeholder="Describe el objetivo y beneficios…" maxlength="2000" :class="{ err: errFc.desc }"></textarea><span class="campo__error" v-if="errFc.desc">Mínimo 50 caracteres.</span></div>
              <div class="campo fg-full"><label>Requisitos</label><textarea v-model="fc.req" placeholder="Requisitos de postulación…" maxlength="2000" style="min-height:60px;"></textarea></div>
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn-sec" @click="modalConv = false">Cancelar</button>
            <button class="btn-primary" @click="publicarConv">Publicar convocatoria</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SidebarGalerista from '@/components/SidebarGalerista.vue'
import { authAPI, convocatoriasAPI, postulacionesAPI, mensajesAPI, usuariosAPI, certificadosAPI } from '@/services/api'
import '@/assets/css/dashboard-galerista.css'

const fechaHoy = new Date().toLocaleDateString('es-CL',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })

const nombreGaleria = ref('Galería')
const regionGaleria = ref('')
const notifAbierta = ref(false)
const tieneNotif = ref(false)
const notificaciones = ref([])

const stats = ref([
  { label:'Convocatorias publicadas', valor:'0', delta:'—',  iconClass:'icon-terra', deltaClass:'delta-pos', path:'<path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  { label:'Postulaciones recibidas',  valor:'0', delta:'—',  iconClass:'icon-azul',  deltaClass:'delta-pos', path:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
  { label:'Artistas guardados',       valor:'0', delta:'—',  iconClass:'icon-verde', deltaClass:'delta-pos', path:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },
  { label:'Conversaciones activas',   valor:'0', delta:'—',  iconClass:'icon-ambar', deltaClass:'delta-neu', path:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },
])

const postulaciones = ref([])
const convocatorias = ref([])
const favoritos = ref([])
const mensajes = ref([])
const actividad = ref([])

onMounted(async () => {
  // Datos del galerista
  const u = authAPI.getUsuario()
  if (u) {
    nombreGaleria.value = u.nombreGaleria || u.nombre || 'Galería'
    regionGaleria.value = u.region || ''
  }

  // Convocatorias del galerista
  try {
    const convs = await convocatoriasAPI.listar()
    convocatorias.value = convs.map(c => ({
      id: c._id,
      titulo: c.titulo,
      cierre: new Date(c.fechaCierre).toLocaleDateString('es-CL', { day:'numeric', month:'short' }),
      galeria: c.entidad || '',
      dias: Math.ceil((new Date(c.fechaCierre) - new Date()) / (1000*60*60*24)),
      pillClass: Math.ceil((new Date(c.fechaCierre) - new Date()) / (1000*60*60*24)) <= 0 ? 'dp-cerrada' : Math.ceil((new Date(c.fechaCierre) - new Date()) / (1000*60*60*24)) <= 10 ? 'dp-urgente' : 'dp-activa',
      postulaciones: c.totalPostulaciones || 0
    }))
    stats.value[0].valor = String(convs.length)
    stats.value[0].delta = `${convs.filter(c => c.activa).length} activas`
  } catch (err) { console.error('Error convocatorias:', err) }

  // Postulaciones recibidas
  try {
    const posts = await postulacionesAPI.listar()
    const colores = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A2A2A', '#6A4A2A', '#2A5A6A']
    postulaciones.value = posts.slice(0, 6).map((p, i) => ({
      id: p._id,
      ini: p.artistaId?.nombre ? p.artistaId.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
      color: colores[i % colores.length],
      artista: p.artistaId?.nombre || 'Artista',
      conv: p.convocatoriaId?.titulo || 'Convocatoria',
      fecha: new Date(p.createdAt).toLocaleDateString('es-CL', { day:'numeric', month:'short' }),
      estado: p.estado === 'en revisión' ? 'En revisión' : p.estado === 'enviada' ? 'Enviada' : p.estado === 'aceptada' ? 'Aceptada' : 'Rechazada',
      _id: p._id
    }))
    stats.value[1].valor = String(posts.length)

    // Generar notificaciones de postulaciones nuevas
    const nuevas = posts.filter(p => p.estado === 'enviada')
    if (nuevas.length > 0) {
      tieneNotif.value = true
      notificaciones.value = nuevas.slice(0, 5).map(p => ({
        id: p._id,
        txt: `<strong>${p.artistaId?.nombre || 'Un artista'}</strong> postuló a <strong>${p.convocatoriaId?.titulo || 'una convocatoria'}</strong>`,
        hora: new Date(p.createdAt).toLocaleDateString('es-CL', { day:'numeric', month:'short' }),
        color: '#C1440E'
      }))
    }
  } catch (err) { console.error('Error postulaciones:', err) }

  // Favoritos (con foto)
  try {
    const favs = await usuariosAPI.listarFavoritos()
    const colores = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A2A5A']
    favoritos.value = favs.map((f, i) => ({
      id: f._id,
      ini: f.nombre ? f.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
      color: colores[i % colores.length],
      nombre: f.nombre,
      fotoUrl: f.fotoUrl || '',
      disc: (f.disciplinas?.join(', ') || '—') + (f.region ? ' · ' + f.region : ''),
      obras: '—'
    }))
    stats.value[2].valor = String(favs.length)
  } catch (err) { console.error('Error favoritos:', err) }

  // Mensajes (con foto)
  try {
    const convsMsgs = await mensajesAPI.conversaciones()
    const colores = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A4A2A']
    mensajes.value = convsMsgs.slice(0, 4).map((c, i) => ({
      id: c.conversacionId,
      ini: c.otroUsuario?.nombre ? c.otroUsuario.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
      color: colores[i % colores.length],
      nombre: c.otroUsuario?.nombre || 'Usuario',
      fotoUrl: c.otroUsuario?.fotoUrl || '',
      preview: c.ultimoMensaje ? (c.ultimoMensaje.length > 40 ? c.ultimoMensaje.slice(0,40) + '…' : c.ultimoMensaje) : '',
      hora: new Date(c.fecha).toLocaleDateString('es-CL', { day:'numeric', month:'short' }),
      noLeido: c.noLeidos > 0
    }))
    stats.value[3].valor = String(convsMsgs.length)
    const sinLeer = convsMsgs.reduce((s, c) => s + (c.noLeidos || 0), 0)
    stats.value[3].delta = sinLeer > 0 ? `${sinLeer} sin leer` : '—'
  } catch (err) { console.error('Error mensajes:', err) }
})

const estados = ['Enviada','En revisión','Aceptada','Rechazada']
const estadosApi = { 'Enviada':'enviada', 'En revisión':'en revisión', 'Aceptada':'aceptada', 'Rechazada':'rechazada' }

async function cambiarEstado(p) {
  const idx = estados.indexOf(p.estado)
  const nuevoEstado = estados[(idx + 1) % estados.length]
  try {
    await postulacionesAPI.cambiarEstado(p._id || p.id, estadosApi[nuevoEstado])
    p.estado = nuevoEstado
  } catch (err) {
    console.error('Error cambiando estado:', err)
    alert(err.response?.data?.mensaje || 'Error al cambiar estado')
  }
}

// QR
const codigoQR = ref('')
const qrResult = ref('')
const qrData = ref(null)

async function verificar() {
  if (!codigoQR.value.trim()) return
  try {
    const data = await certificadosAPI.verificar(codigoQR.value.trim())
    qrResult.value = data.verificado ? 'ok' : 'err'
    qrData.value = data.certificado || null
  } catch (err) {
    qrResult.value = 'err'
    qrData.value = null
  }
}

// MODAL CONV
const modalConv = ref(false)
const tiposConv       = ['concurso','residencia','galeria','feria','fondart','otro']
const disciplinasConv = ['Multidisciplinar','Pintura','Fotografía','Grabado','Escultura','Arte digital','Cerámica','Artes Visuales']
const regionesConv    = ['Región Metropolitana','Región de Valparaíso','Región del Biobío','Región de La Araucanía','Nacional','Internacional']
const fc    = ref({ titulo:'', tipo:'', disciplina:'', apertura:'', cierre:'', region:'', desc:'', req:'' })
const errFc = ref({ titulo:false, tipo:false, disciplina:false, apertura:false, cierre:false, desc:false })
const publicando = ref(false)

async function publicarConv() {
  errFc.value.titulo     = !fc.value.titulo.trim()
  errFc.value.tipo       = !fc.value.tipo
  errFc.value.disciplina = !fc.value.disciplina
  errFc.value.apertura   = !fc.value.apertura
  errFc.value.cierre     = !fc.value.cierre || fc.value.cierre <= fc.value.apertura
  errFc.value.desc       = fc.value.desc.trim().length < 50
  if (Object.values(errFc.value).some(Boolean)) return

  publicando.value = true
  try {
    await convocatoriasAPI.crear({
      titulo: fc.value.titulo.trim(),
      tipo: fc.value.tipo,
      disciplina: fc.value.disciplina,
      fechaApertura: fc.value.apertura,
      fechaCierre: fc.value.cierre,
      region: fc.value.region,
      descripcion: fc.value.desc.trim(),
      requisitos: fc.value.req.trim()
    })
    modalConv.value = false
    alert('✓ Convocatoria publicada con éxito.')
    location.reload()
  } catch (err) {
    console.error('Error al publicar:', err)
    alert(err.response?.data?.mensaje || 'Error al publicar convocatoria')
  } finally {
    publicando.value = false
  }
}

function badgeClass(e) {
  return { 'Enviada':'badge-enviada','En revisión':'badge-revision','Aceptada':'badge-aceptada','Rechazada':'badge-rechazada' }[e] || ''
}
</script>