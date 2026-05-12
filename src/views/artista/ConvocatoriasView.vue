<template>
  <div class="layout v-convocatorias">
    <SidebarArtista ruta-activa="convocatorias" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Convocatorias</h1>
          <p>Encuentra fondos, residencias y oportunidades para tu obra</p>
        </div>
      </header>

      <div class="conv-layout">

        <!-- PANEL FILTROS -->
        <aside class="filtros-panel">
          <p class="filtros-panel__titulo">Filtrar resultados</p>

          <div class="filtro-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="filtros.buscar" placeholder="Buscar convocatoria…"/>
          </div>

          <div class="filtro-grupo">
            <p class="filtro-grupo__label">Tipo</p>
            <label class="check-item" v-for="t in tipos" :key="t">
              <div class="check-item__izq">
                <input type="checkbox" :value="t" v-model="filtros.tipos"/>
                <span class="check-item__lbl">{{ tiposLabel[t] || t }}</span>
              </div>
            </label>
          </div>

          <div class="filtro-divider"></div>

          <div class="filtro-grupo">
            <p class="filtro-grupo__label">Disciplina</p>
            <select class="filtro-select" v-model="filtros.disciplina">
              <option value="">Todas las disciplinas</option>
              <option v-for="d in disciplinas" :key="d">{{ d }}</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <p class="filtro-grupo__label">Región</p>
            <select class="filtro-select" v-model="filtros.region">
              <option value="">Todas las regiones</option>
              <option v-for="r in regiones" :key="r">{{ r }}</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <p class="filtro-grupo__label">Fecha de cierre</p>
            <select class="filtro-select" v-model="filtros.plazo">
              <option value="">Cualquier plazo</option>
              <option value="7">Próximos 7 días</option>
              <option value="30">Próximos 30 días</option>
              <option value="60">Próximos 60 días</option>
            </select>
          </div>

          <div class="filtro-divider"></div>
          <button class="btn-limpiar" @click="limpiarFiltros">Limpiar filtros</button>
        </aside>

        <!-- LISTA -->
        <div class="lista-wrap">

          <!-- ALERTA URGENCIA -->
          <div class="alerta-strip" v-if="urgentes > 0">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p><strong>{{ urgentes }} convocatoria{{ urgentes > 1 ? 's cierran' : ' cierra' }} en menos de 10 días.</strong> No pierdas el plazo.</p>
          </div>

          <div class="lista-head">
            <p class="lista-head__info"><strong>{{ convFiltradas.length }}</strong> convocatorias activas</p>
            <select class="orden-select" v-model="orden">
              <option value="cierre">Ordenar por cierre más próximo</option>
              <option value="reciente">Más recientes primero</option>
              <option value="az">A → Z</option>
            </select>
          </div>

          <!-- TABS TIPO RÁPIDO -->
          <div class="tabs-tipo">
            <button class="tab-tipo" v-for="t in tabsTipo" :key="t.val"
              :class="{ activo: tabActivo === t.val }"
              @click="tabActivo = t.val">{{ t.label }}</button>
          </div>

          <!-- TARJETAS -->
          <div class="conv-lista">
            <div
              class="conv-card"
              v-for="c in convFiltradas"
              :key="c.id"
              :class="{ urgente: diasRestantes(c.cierre) <= 10 }"
              @click="abrirModal(c)"
            >
              <div class="conv-card__izq">
                <div class="conv-card__head">
                  <span class="tipo-badge" :class="tipoClass(c.tipo)">{{ tipoIcon(c.tipo) }} {{ tiposLabel[c.tipo] || c.tipo }}</span>
                  <span class="urgencia-tag" v-if="diasRestantes(c.cierre) <= 10 && diasRestantes(c.cierre) > 0">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Cierra pronto
                  </span>
                  <span class="ya-postulo" v-if="c.postulado">
                    <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                    Ya postulaste
                  </span>
                </div>
                <p class="conv-card__titulo">{{ c.titulo }}</p>
                <p class="conv-card__entidad">{{ c.entidad }}</p>
                <p class="conv-card__desc">{{ c.desc }}</p>
                <div class="conv-card__meta">
                  <span class="meta-dato" :class="{ urgente: diasRestantes(c.cierre) <= 10 }">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Cierra {{ fechaFmt(c.cierre) }}
                  </span>
                  <span class="meta-dato">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ c.region }}
                  </span>
                  <span class="meta-dato">
                    <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    {{ c.monto }}
                  </span>
                </div>
              </div>
              <div class="conv-card__der">
                <div class="dias-badge" :class="{ urgente: diasRestantes(c.cierre) <= 10, cerrada: diasRestantes(c.cierre) <= 0 }">
                  <p class="dias-badge__num" v-if="diasRestantes(c.cierre) > 0">{{ diasRestantes(c.cierre) }}</p>
                  <p class="dias-badge__num" v-else style="font-size:0.8rem;">Cerrada</p>
                  <p class="dias-badge__txt" v-if="diasRestantes(c.cierre) > 0">días</p>
                </div>
                <button v-if="diasRestantes(c.cierre) > 0 && !c.postulado" class="btn-postular" @click.stop="postular(c)">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Postular
                </button>
                <button class="btn-ver-mas" @click.stop="abrirModal(c)">Ver más</button>
              </div>
            </div>
            <p v-if="!convFiltradas.length" class="empty-txt">Sin resultados. Intenta con otros filtros.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLE -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalConv" @click.self="modalConv = false">
        <div class="modal-conv">
          <div class="modal__head">
            <div class="modal__head-izq">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;">
                <span class="tipo-badge" :class="tipoClass(convActual?.tipo)">{{ tipoIcon(convActual?.tipo) }} {{ tiposLabel[convActual?.tipo] || convActual?.tipo }}</span>
                <span class="ya-postulo" v-if="convActual?.postulado"><svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>Ya postulaste</span>
              </div>
              <h2 class="modal__titulo">{{ convActual?.titulo }}</h2>
              <p class="modal__entidad">{{ convActual?.entidad }}</p>
            </div>
            <button class="modal__cerrar" @click="modalConv = false">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal__body" v-if="convActual">
            <div class="modal__grid-meta">
              <div><p class="modal__meta-label">Región</p><p class="modal__meta-val">{{ convActual.region }}</p></div>
              <div><p class="modal__meta-label">Disciplina</p><p class="modal__meta-val">{{ convActual.disciplina }}</p></div>
              <div><p class="modal__meta-label">Apertura</p><p class="modal__meta-val">{{ fechaFmt(convActual.apertura) }}</p></div>
              <div><p class="modal__meta-label">Cierre</p><p class="modal__meta-val" :style="{ color: diasRestantes(convActual.cierre) <= 10 ? 'var(--terra)' : '' }">{{ fechaFmt(convActual.cierre) }}</p></div>
              <div><p class="modal__meta-label">Monto / Beneficio</p><p class="modal__meta-val">{{ convActual.monto }}</p></div>
              <div><p class="modal__meta-label">Días restantes</p><p class="modal__meta-val" :style="{ color: diasRestantes(convActual.cierre) <= 10 ? 'var(--terra)' : '' }">{{ diasRestantes(convActual.cierre) > 0 ? diasRestantes(convActual.cierre) + ' días' : 'Cerrada' }}</p></div>
            </div>
            <div class="modal__divider"></div>
            <p class="modal__seccion">Descripción</p>
            <p class="modal__texto">{{ convActual.desc }}</p>
            <div class="modal__divider"></div>
            <p class="modal__seccion">Requisitos</p>
            <div class="modal__req">{{ convActual.req }}</div>
          </div>
          <div class="modal__footer">
            <p class="modal__plazo">Cierra el <strong>{{ convActual ? fechaFmt(convActual.cierre) : '' }}</strong></p>
            <div style="display:flex;gap:0.75rem;">
              <button class="btn-ver-mas" @click="modalConv = false">Cerrar</button>
              <button v-if="convActual && diasRestantes(convActual.cierre) > 0 && !convActual.postulado" class="btn-postular" @click="postular(convActual)">Postular ahora</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { convocatoriasAPI } from '@/services/api'
import '@/assets/css/convocatorias.css'

const router = useRouter()
const HOY = new Date()

function diasRestantes(fechaStr) { return Math.ceil((new Date(fechaStr) - HOY) / (1000*60*60*24)) }
function fechaFmt(f) { return new Date(f).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'}) }

const tipos       = ['fondart','residencia','concurso','galeria','feria','otro']
const tiposLabel  = { fondart:'Fondo público', residencia:'Residencia', concurso:'Concurso', galeria:'Galería', feria:'Feria', otro:'Otro' }
const disciplinas = ['Pintura','Fotografía','Grabado','Escultura','Arte digital','Cerámica','Multidisciplinar','Artes Visuales']
const regiones    = ['Región Metropolitana','Región de Valparaíso','Región del Biobío','Región de La Araucanía','Región de Magallanes','Nacional','Internacional']
const tabsTipo    = [
  { val:'', label:'Todas' },{ val:'fondart', label:'Fondos' },{ val:'residencia', label:'Residencias' },
  { val:'concurso', label:'Concursos' },{ val:'galeria', label:'Galerías' },{ val:'feria', label:'Ferias' },
]

const filtros  = ref({ buscar:'', tipos:[...tipos], disciplina:'', region:'', plazo:'' })
const orden    = ref('cierre')
const tabActivo = ref('')
const modalConv = ref(false)
const convActual = ref(null)

const convocatorias = ref([])

// Cargar convocatorias desde la API
onMounted(async () => {
  try {
    const data = await convocatoriasAPI.listar()
    convocatorias.value = data.map(c => ({
      id: c._id,
      titulo: c.titulo,
      entidad: c.entidad || c.galeristaId?.nombreGaleria || c.galeristaId?.nombre || '—',
      tipo: c.tipo,
      disciplina: c.disciplina || 'Multidisciplinar',
      region: c.region || 'Nacional',
      cierre: c.fechaCierre,
      apertura: c.fechaApertura,
      monto: '',
      postulado: c.yaPostulo || false,
      req: c.requisitos || 'No especificados',
      desc: c.descripcion || ''
    }))
  } catch (err) {
    console.error('Error cargando convocatorias:', err)
  }
})

const urgentes = computed(() => convocatorias.value.filter(c => { const d = diasRestantes(c.cierre); return d <= 10 && d > 0 }).length)

const convFiltradas = computed(() => {
  let lista = convocatorias.value.filter(c => {
    const d   = diasRestantes(c.cierre)
    const q   = filtros.value.buscar.toLowerCase()
    return (d > -30) &&
      (!q || c.titulo.toLowerCase().includes(q) || c.entidad.toLowerCase().includes(q)) &&
      (filtros.value.tipos.includes(c.tipo)) &&
      (!filtros.value.disciplina || c.disciplina === filtros.value.disciplina || c.disciplina === 'Multidisciplinar') &&
      (!filtros.value.region  || c.region === filtros.value.region) &&
      (!filtros.value.plazo   || d <= parseInt(filtros.value.plazo)) &&
      (!tabActivo.value       || c.tipo === tabActivo.value)
  })
  if (orden.value === 'cierre')   lista.sort((a,b) => diasRestantes(a.cierre) - diasRestantes(b.cierre))
  if (orden.value === 'reciente') lista.sort((a,b) => new Date(b.apertura) - new Date(a.apertura))
  if (orden.value === 'az')       lista.sort((a,b) => a.titulo.localeCompare(b.titulo))
  return lista
})

function abrirModal(c) { convActual.value = c; modalConv.value = true }
function postular(c)   { modalConv.value = false; router.push({ path: '/artista/postulacion', query: { id: c.id } }) }
function limpiarFiltros() {
  filtros.value = { buscar:'', tipos:[...tipos], disciplina:'', region:'', plazo:'' }
  tabActivo.value = ''
}

function tipoClass(tipo) {
  return { fondart:'tb-fondart', residencia:'tb-residencia', concurso:'tb-concurso', feria:'tb-feria', galeria:'tb-galeria' }[tipo] || ''
}
function tipoIcon(tipo) {
  return { fondart:'🏛️', residencia:'🎨', concurso:'🏆', feria:'🖼️', galeria:'🏛' }[tipo] || '📋'
}
</script>