<template>
  <div class="layout v-convocatorias-gal">
    <SidebarGalerista ruta-activa="convocatorias" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Mis convocatorias</h1>
          <p>Gestiona tus convocatorias publicadas</p>
        </div>
        <div class="topbar__der">
          <button class="btn-primary" @click="modalConv = true">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva convocatoria
          </button>
        </div>
      </header>

      <div class="contenido">
        <div class="stats-row">
          <div class="stat-mini" v-for="s in statsConv" :key="s.label">
            <p class="stat-mini__val">{{ s.valor }}</p>
            <p class="stat-mini__lbl">{{ s.label }}</p>
          </div>
        </div>

        <div class="filtros-bar">
          <div class="tabs-estado">
            <button class="tab" :class="{ 'tab--activo': filtroEstado === '' }" @click="filtroEstado = ''">Todas</button>
            <button class="tab" :class="{ 'tab--activo': filtroEstado === 'activa' }" @click="filtroEstado = 'activa'">Activas</button>
            <button class="tab" :class="{ 'tab--activo': filtroEstado === 'cerrada' }" @click="filtroEstado = 'cerrada'">Cerradas</button>
          </div>
          <div class="busqueda-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="buscar" placeholder="Buscar convocatoria…" />
          </div>
        </div>

        <div class="conv-lista" v-if="convocatoriasFiltradas.length > 0">
          <div class="conv-card" v-for="c in convocatoriasFiltradas" :key="c.id" :class="{ 'conv-card--expandida': expandida === c.id }" @click="toggleExpand(c)">
            <div class="conv-card__main">
              <div class="conv-card__izq">
                <div class="conv-card__icono" :class="c.estadoClass">
                  <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <div>
                  <h3 class="conv-card__titulo">{{ c.titulo }}</h3>
                  <p class="conv-card__meta"><span class="conv-tipo">{{ c.tipo }}</span> · {{ c.disciplina }}<span v-if="c.region"> · {{ c.region }}</span></p>
                </div>
              </div>
              <div class="conv-card__der">
                <div class="conv-card__fechas">
                  <p class="conv-card__cierre">
                    <span v-if="c.diasRestantes > 0">Cierra en {{ c.diasRestantes }} día{{ c.diasRestantes !== 1 ? 's' : '' }}</span>
                    <span v-else-if="c.diasRestantes === 0">Cierra hoy</span>
                    <span v-else>Cerrada</span>
                  </p>
                  <p class="conv-card__rango">{{ c.fechaApertura }} — {{ c.fechaCierre }}</p>
                </div>
                <div class="conv-card__postulaciones">
                  <span class="post-pill">{{ c.totalPostulaciones }}</span>
                  <span class="post-pill-label">postulaciones</span>
                </div>
                <svg class="conv-card__chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="conv-card__detalle" v-if="expandida === c.id">
              <div class="detalle-desc"><h4>Descripción</h4><p>{{ c.descripcion || 'Sin descripción.' }}</p></div>
              <div class="detalle-req" v-if="c.requisitos"><h4>Requisitos</h4><p>{{ c.requisitos }}</p></div>
              <div class="detalle-postulaciones">
                <h4>Postulaciones recibidas ({{ c.postulaciones.length }})</h4>
                <div class="post-tabla" v-if="c.postulaciones.length > 0">
                  <div class="post-fila post-fila--head"><span>Artista</span><span>Fecha</span><span>Estado</span><span>Acciones</span></div>
                  <div class="post-fila" v-for="p in c.postulaciones" :key="p.id">
                    <div class="post-fila__artista">
                      <div class="post-fila__av" :style="{ background: p.color }">{{ p.ini }}</div>
                      <span>{{ p.nombre }}</span>
                    </div>
                    <span class="post-fila__fecha">{{ p.fecha }}</span>
                    <span class="badge" :class="badgeClass(p.estado)">{{ p.estado }}</span>
                    <div class="post-fila__acciones">
                      <select :value="p.estado" @click.stop @change="cambiarEstadoPost(p, $event.target.value)">
                        <option value="Enviada">Enviada</option>
                        <option value="En revisión">En revisión</option>
                        <option value="Aceptada">Aceptada</option>
                        <option value="Rechazada">Rechazada</option>
                      </select>
                      <button class="btn-sec btn-xs" @click.stop="verDetallePost(p)" title="Ver postulación completa">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </button>
                      <button class="btn-sec btn-xs" @click.stop="verPortafolio(p)" title="Ver portafolio">
                        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="sin-post" v-else>Aún no hay postulaciones para esta convocatoria.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="estado-vacio" v-else-if="!cargando">
          <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <h3 v-if="convocatorias.length === 0">Aún no has publicado convocatorias</h3>
          <h3 v-else>No se encontraron resultados</h3>
          <p v-if="convocatorias.length === 0">Publica tu primera convocatoria para empezar a recibir postulaciones de artistas.</p>
          <button class="btn-primary" v-if="convocatorias.length === 0" @click="modalConv = true">+ Publicar convocatoria</button>
        </div>
        <div class="estado-vacio" v-if="cargando"><div class="spinner"></div><p>Cargando convocatorias…</p></div>
      </div>
    </div>

    <!-- MODAL DETALLE POSTULACIÓN -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalDetalle" @click.self="modalDetalle = false">
        <div class="modal" style="max-width:700px;">
          <div class="modal__head">
            <div>
              <h2 class="modal__titulo">Detalle de postulación</h2>
              <p class="modal__sub">{{ postDetalle?.nombre }} — {{ postDetalle?.convTitulo }}</p>
            </div>
            <button class="modal__cerrar" @click="modalDetalle = false"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          <div class="modal__body" v-if="postDetalle">
            <div class="det-sec">
              <p class="det-sec__t">Información general</p>
              <div class="det-grid">
                <div><p class="det-l">Artista</p><p class="det-v">{{ postDetalle.nombre }}</p></div>
                <div><p class="det-l">Fecha de envío</p><p class="det-v">{{ postDetalle.fecha }}</p></div>
                <div><p class="det-l">Estado</p><span class="badge" :class="badgeClass(postDetalle.estado)">{{ postDetalle.estado }}</span></div>
              </div>
            </div>
            <div class="det-sec" v-if="postDetalle.declaracion">
              <p class="det-sec__t">Título del proyecto y carta de motivación</p>
              <div class="det-texto">{{ postDetalle.declaracion }}</div>
            </div>
            <div class="det-sec" v-if="postDetalle.linkPortafolio">
              <p class="det-sec__t">Link de portafolio web</p>
              <a :href="postDetalle.linkPortafolio" target="_blank" class="det-link">{{ postDetalle.linkPortafolio }}</a>
            </div>
            <div class="det-sec" v-if="postDetalle.pdfUrl">
              <p class="det-sec__t">Portafolio PDF adjunto</p>
              <a :href="postDetalle.pdfUrl" target="_blank" class="det-archivo">📄 Abrir PDF en nueva pestaña</a>
            </div>
            <div class="det-sec" v-if="postDetalle.obras && postDetalle.obras.length > 0">
              <p class="det-sec__t">Obras de referencia ({{ postDetalle.obras.length }})</p>
              <div class="det-obras">
                <div class="det-obra" v-for="o in postDetalle.obras" :key="o._id || o.id">
                  <div class="det-obra__img" :style="o.imagenUrl ? { backgroundImage: 'url(' + o.imagenUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg,#888,#444)' }"></div>
                  <p class="det-obra__t">{{ o.titulo || 'Sin título' }}</p>
                  <p class="det-obra__s">{{ o.tecnica || '' }}</p>
                </div>
              </div>
            </div>
            <div class="det-sec" v-if="!postDetalle.declaracion && !postDetalle.linkPortafolio && !postDetalle.pdfUrl && (!postDetalle.obras || postDetalle.obras.length === 0)">
              <p style="font-size:0.85rem;color:var(--gris);font-style:italic;">El artista no incluyó información adicional.</p>
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn-sec" @click="verPortafolio(postDetalle)">Ver portafolio</button>
            <button class="btn-primary" @click="contactarArtista(postDetalle)">Contactar artista</button>
          </div>
        </div>
      </div>
    </Teleport>

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
            <button class="btn-primary" @click="publicarConv" :disabled="publicando">{{ publicando ? 'Publicando…' : 'Publicar convocatoria' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarGalerista from '@/components/SidebarGalerista.vue'
import { convocatoriasAPI, postulacionesAPI } from '@/services/api'
import '@/assets/css/convocatorias-galerista.css'

const router = useRouter()
const convocatorias = ref([])
const buscar = ref('')
const filtroEstado = ref('')
const cargando = ref(true)
const expandida = ref(null)
const modalDetalle = ref(false)
const postDetalle = ref(null)
const coloresPost = ['#C1440E', '#2A4A6A', '#3A6A2A', '#6A2A2A', '#6A4A2A', '#2A5A6A']

const statsConv = computed(() => [
  { valor: convocatorias.value.length, label: 'Total publicadas' },
  { valor: convocatorias.value.filter(c => c.diasRestantes > 0).length, label: 'Activas' },
  { valor: convocatorias.value.filter(c => c.diasRestantes <= 0).length, label: 'Cerradas' },
  { valor: convocatorias.value.reduce((s, c) => s + c.totalPostulaciones, 0), label: 'Postulaciones totales' },
])

const convocatoriasFiltradas = computed(() => {
  let lista = convocatorias.value
  if (filtroEstado.value === 'activa') lista = lista.filter(c => c.diasRestantes > 0)
  if (filtroEstado.value === 'cerrada') lista = lista.filter(c => c.diasRestantes <= 0)
  const q = buscar.value.toLowerCase().trim()
  if (q) lista = lista.filter(c => c.titulo.toLowerCase().includes(q) || c.tipo.toLowerCase().includes(q))
  return lista
})

onMounted(async () => {
  try {
    const convs = await convocatoriasAPI.listar()
    convocatorias.value = await Promise.all(convs.map(async (c) => {
      let posts = []
      try {
        const allPosts = await postulacionesAPI.listar()
        posts = allPosts
          .filter(p => p.convocatoriaId?._id === c._id || p.convocatoriaId === c._id)
          .map((p, i) => ({
            id: p._id, _id: p._id,
            ini: p.artistaId?.nombre ? p.artistaId.nombre.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??',
            color: coloresPost[i % coloresPost.length],
            nombre: p.artistaId?.nombre || 'Artista',
            artistaId: p.artistaId?._id,
            fecha: new Date(p.createdAt).toLocaleDateString('es-CL', { day:'numeric', month:'short', year:'numeric' }),
            estado: p.estado === 'en revisión' ? 'En revisión' : p.estado === 'enviada' ? 'Enviada' : p.estado === 'aceptada' ? 'Aceptada' : 'Rechazada',
            pdfUrl: p.pdfUrl || null,
            declaracion: p.declaracionArtista || '',
            linkPortafolio: p.linkPortafolio || '',
            obras: p.obrasAdjuntas || [],
            convTitulo: c.titulo
          }))
      } catch (e) {}

      const diasRestantes = Math.ceil((new Date(c.fechaCierre) - new Date()) / (1000*60*60*24))
      return {
        id: c._id, titulo: c.titulo, tipo: c.tipo || 'general', disciplina: c.disciplina || '—',
        region: c.region || '', descripcion: c.descripcion || '', requisitos: c.requisitos || '',
        fechaApertura: new Date(c.fechaApertura).toLocaleDateString('es-CL', { day:'numeric', month:'short', year:'numeric' }),
        fechaCierre: new Date(c.fechaCierre).toLocaleDateString('es-CL', { day:'numeric', month:'short', year:'numeric' }),
        diasRestantes,
        estadoClass: diasRestantes <= 0 ? 'icono-cerrada' : diasRestantes <= 10 ? 'icono-urgente' : 'icono-activa',
        totalPostulaciones: posts.length, postulaciones: posts
      }
    }))
  } catch (err) { console.error('Error cargando convocatorias:', err) }
  finally { cargando.value = false }
})

function toggleExpand(c) { expandida.value = expandida.value === c.id ? null : c.id }
const estadosApi = { 'Enviada':'enviada', 'En revisión':'en revisión', 'Aceptada':'aceptada', 'Rechazada':'rechazada' }
async function cambiarEstadoPost(p, nuevoEstado) {
  try { await postulacionesAPI.cambiarEstado(p._id || p.id, estadosApi[nuevoEstado]); p.estado = nuevoEstado }
  catch (err) { alert(err.response?.data?.mensaje || 'Error al cambiar estado') }
}
function verDetallePost(p) { postDetalle.value = p; modalDetalle.value = true }
function verPortafolio(p) { if (p?.artistaId) router.push(`/portafolio/${p.artistaId}`) }
function contactarArtista(p) { if (p?.artistaId) { modalDetalle.value = false; router.push({ path: '/galerista/mensajes', query: { nuevo: p.artistaId } }) } }
function abrirPDF(p) { if (p.pdfUrl) window.open(p.pdfUrl, '_blank') }
function badgeClass(e) { return { 'Enviada':'badge-enviada','En revisión':'badge-revision','Aceptada':'badge-aceptada','Rechazada':'badge-rechazada' }[e] || '' }

const modalConv = ref(false)
const tiposConv = ['concurso','residencia','galeria','feria','fondart','otro']
const disciplinasConv = ['Multidisciplinar','Pintura','Fotografía','Grabado','Escultura','Arte digital','Cerámica','Artes Visuales']
const regionesConv = ['Región Metropolitana','Región de Valparaíso','Región del Biobío','Región de La Araucanía','Nacional','Internacional']
const fc = ref({ titulo:'', tipo:'', disciplina:'', apertura:'', cierre:'', region:'', desc:'', req:'' })
const errFc = ref({ titulo:false, tipo:false, disciplina:false, apertura:false, cierre:false, desc:false })
const publicando = ref(false)
async function publicarConv() {
  errFc.value.titulo = !fc.value.titulo.trim(); errFc.value.tipo = !fc.value.tipo; errFc.value.disciplina = !fc.value.disciplina
  errFc.value.apertura = !fc.value.apertura; errFc.value.cierre = !fc.value.cierre || fc.value.cierre <= fc.value.apertura
  errFc.value.desc = fc.value.desc.trim().length < 50
  if (Object.values(errFc.value).some(Boolean)) return
  publicando.value = true
  try {
    await convocatoriasAPI.crear({ titulo: fc.value.titulo.trim(), tipo: fc.value.tipo, disciplina: fc.value.disciplina, fechaApertura: fc.value.apertura, fechaCierre: fc.value.cierre, region: fc.value.region, descripcion: fc.value.desc.trim(), requisitos: fc.value.req.trim() })
    modalConv.value = false; alert('✓ Convocatoria publicada.'); location.reload()
  } catch (err) { alert(err.response?.data?.mensaje || 'Error al publicar') }
  finally { publicando.value = false }
}
</script>