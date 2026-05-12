<template>
  <div class="layout v-postulacion">
    <SidebarArtista ruta-activa="convocatorias" />

    <div class="main">
      <header class="topbar">
        <div style="display:flex;align-items:center;gap:1.5rem;">
          <router-link to="/artista/convocatorias" class="topbar__volver">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Volver a convocatorias
          </router-link>
          <div style="width:1px;height:20px;background:var(--borde);"></div>
          <p class="topbar__titulo">Postulación — {{ convocatoria.titulo }}</p>
        </div>
        <p class="topbar__estado">Paso {{ pasoActual }} de 3</p>
      </header>

      <!-- STEPPER -->
      <div class="stepper-wrap">
        <div class="stepper">
          <div class="step" v-for="s in pasos" :key="s.num"
            :class="{ activo: pasoActual === s.num, completo: pasoActual > s.num }">
            <div class="step__circle">
              <svg v-if="pasoActual > s.num" viewBox="0 0 24 24" style="width:14px;height:14px;stroke:#fff;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>{{ s.num }}</span>
            </div>
            <div class="step__info">
              <p class="step__num">Paso 0{{ s.num }}</p>
              <p class="step__label">{{ s.label }}</p>
            </div>
            <div v-if="s.num < 3" class="step__linea" :class="{ completo: pasoActual > s.num }"></div>
          </div>
        </div>
      </div>

      <div class="post-contenido">

        <!-- FORMULARIO -->
        <div>
          <!-- PASO 1 -->
          <div class="form-card" v-if="pasoActual === 1">
            <div class="form-card__head">
              <p class="form-card__step-tag">Paso 01 — Datos y motivación</p>
              <h2 class="form-card__titulo">Información de la postulación</h2>
              <p class="form-card__sub">Cuéntale al jurado quién eres y qué quieres lograr.</p>
            </div>
            <div class="form-card__body">
              <div class="campo">
                <label>Convocatoria seleccionada</label>
                <input type="text" :value="convocatoria.titulo" readonly/>
              </div>
              <div class="campo">
                <label>Nombre completo del postulante</label>
                <input type="text" :value="usuarioNombre" readonly/>
              </div>
              <div class="campo">
                <label>Título del proyecto <span class="req">*</span></label>
                <input type="text" v-model="form.tituloProy" placeholder="Ej: Serie Latencia — Investigación pictórica del paisaje de Atacama" maxlength="150" :class="{ err: err.tituloProy }"/>
                <span class="campo__error" v-if="err.tituloProy">El título es obligatorio.</span>
              </div>
              <div class="campo">
                <label>Carta de motivación <span class="req">*</span> <span class="opt">(mín. 100 · máx. 2000 caracteres)</span></label>
                <textarea v-model="form.motivacion" maxlength="2000" rows="6"
                  placeholder="Describe tu propuesta artística, su contexto, relevancia y objetivos…"
                  :class="{ err: err.motivacion }"
                  @input="cntMotiv = form.motivacion.length"></textarea>
                <p class="campo__cnt" :style="{ color: cntMotiv < 100 ? '#C0392B' : cntMotiv > 1800 ? 'var(--terra)' : 'var(--gris)' }">{{ cntMotiv }} / 2000 caracteres · mínimo 100</p>
                <span class="campo__error" v-if="err.motivacion">Mínimo 100 caracteres.</span>
              </div>
              <div class="campo">
                <label>URL de portafolio web <span class="opt">(opcional)</span></label>
                <input type="url" v-model="form.url" placeholder="https://tuportafolio.cl" :class="{ err: err.url }"/>
                <span class="campo__error" v-if="err.url">URL válida (https://…)</span>
              </div>
            </div>
            <div class="form-card__footer">
              <p style="font-size:0.8rem;color:var(--gris);">Campos con <span style="color:var(--terra)">*</span> son obligatorios</p>
              <button class="btn-primary" @click="irPaso(2)">Continuar <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
          </div>

          <!-- PASO 2 -->
          <div class="form-card" v-if="pasoActual === 2">
            <div class="form-card__head">
              <p class="form-card__step-tag">Paso 02 — Portafolio y archivos</p>
              <h2 class="form-card__titulo">Adjunta tus documentos</h2>
              <p class="form-card__sub">Sube los archivos requeridos y selecciona obras de referencia.</p>
            </div>
            <div class="form-card__body">

              <div class="campo">
                <label>Portafolio en PDF <span class="req">*</span></label>
                <div class="upload-area" :class="{ drag: dragging.portfolio }"
                  @dragover.prevent="dragging.portfolio = true"
                  @dragleave="dragging.portfolio = false"
                  @drop.prevent="dropFile($event, 'portfolio')"
                  @click="$refs.inpPort.click()">
                  <input ref="inpPort" type="file" accept=".pdf" style="display:none" @change="adjuntarArchivo($event,'portfolio')"/>
                  <div v-if="!archivos.portfolio">
                    <p class="upload-area__txt">Arrastra tu portafolio PDF o haz clic</p>
                    <p class="upload-area__sub">Solo PDF · Máximo 10 MB</p>
                  </div>
                  <div v-else class="file-attached-preview">
                    <span>📄 {{ archivos.portfolio }}</span>
                    <button @click.stop="archivos.portfolio = null" class="quitar-btn">✕</button>
                  </div>
                </div>
                <span class="campo__error" v-if="err.portfolio">El portafolio PDF es obligatorio.</span>
              </div>

              <div class="campo">
                <label>CV artístico en PDF <span class="opt">(opcional)</span></label>
                <div class="upload-area" @click="$refs.inpCV.click()">
                  <input ref="inpCV" type="file" accept=".pdf" style="display:none" @change="adjuntarArchivo($event,'cv')"/>
                  <div v-if="!archivos.cv">
                    <p class="upload-area__txt">Arrastra tu CV PDF o haz clic</p>
                    <p class="upload-area__sub">Solo PDF · Máximo 5 MB</p>
                  </div>
                  <div v-else class="file-attached-preview">
                    <span>📄 {{ archivos.cv }}</span>
                    <button @click.stop="archivos.cv = null" class="quitar-btn">✕</button>
                  </div>
                </div>
              </div>

              <!-- OBRAS DE REFERENCIA -->
              <div class="campo">
                <label>Obras destacadas <span class="opt">(opcional · máx. 5)</span></label>
                <p style="font-size:0.73rem;color:var(--gris);margin-bottom:0.6rem;">Selecciona obras de tu inventario para incluir como referencia visual.</p>
                <div class="obras-sel-grid">
                  <div class="obra-sel" v-for="o in obrasInventario" :key="o.id"
                    :class="{ sel: obrasSeleccionadas.has(o.id) }"
                    @click="toggleObra(o.id)">
                    <div class="obra-sel__check" v-if="obrasSeleccionadas.has(o.id)">
                      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div class="obra-sel__img" :style="{ background: o.color }"></div>
                    <div class="obra-sel__info">
                      <p class="obra-sel__titulo">{{ o.titulo }}</p>
                      <p class="obra-sel__tec">{{ o.tecnica }}</p>
                    </div>
                  </div>
                </div>
                <p style="font-size:0.73rem;color:var(--gris);margin-top:0.5rem;">{{ obrasSeleccionadas.size }} obras seleccionadas (máx. 5)</p>
              </div>
            </div>
            <div class="form-card__footer">
              <button class="btn-sec" @click="irPaso(1)"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Atrás</button>
              <button class="btn-primary" @click="irPaso(3)">Continuar <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
          </div>

          <!-- PASO 3 -->
          <div class="form-card" v-if="pasoActual === 3">
            <div class="form-card__head">
              <p class="form-card__step-tag">Paso 03 — Revisión y envío</p>
              <h2 class="form-card__titulo">Revisa tu postulación</h2>
              <p class="form-card__sub">Verifica que todo esté correcto antes de enviar.</p>
            </div>
            <div class="form-card__body">
              <div class="resumen-box">
                <p class="resumen-label">Datos ingresados</p>
                <div class="resumen-grid">
                  <div><p class="r-label">Convocatoria</p><p class="r-val">{{ convocatoria.titulo }}</p></div>
                  <div><p class="r-label">Postulante</p><p class="r-val">{{ usuarioNombre }}</p></div>
                  <div><p class="r-label">Título del proyecto</p><p class="r-val">{{ form.tituloProy || '—' }}</p></div>
                  <div><p class="r-label">Archivos</p><p class="r-val">{{ resumenArchivos }}</p></div>
                  <div style="grid-column:1/-1;"><p class="r-label">Carta de motivación</p><p class="r-val">{{ form.motivacion.substring(0,200) }}{{ form.motivacion.length > 200 ? '…' : '' }}</p></div>
                </div>
              </div>
              <div class="campo">
                <label>Declaración de veracidad <span class="req">*</span></label>
                <div class="check-decl" :class="{ marcado: form.declaro }" @click="form.declaro = !form.declaro">
                  <input type="checkbox" v-model="form.declaro" @click.stop/>
                  <p class="check-decl__texto"><strong>Declaro que toda la información proporcionada es verídica y de mi autoría.</strong> Entiendo que la falsedad puede resultar en descalificación inmediata según la legislación chilena vigente.</p>
                </div>
                <span class="campo__error" v-if="err.declaro">Debes aceptar la declaración.</span>
              </div>
            </div>
            <div class="form-card__footer">
              <button class="btn-sec" @click="irPaso(2)"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Atrás</button>
              <button class="btn-primary" @click="enviar">
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Enviar postulación
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL LATERAL -->
        <div class="post-panel-lateral">
          <div class="conv-resumen">
            <div class="conv-resumen__img">
              <span class="conv-resumen__tipo">🏛️ Fondo público</span>
            </div>
            <div class="conv-resumen__body">
              <p class="conv-resumen__entidad">Ministerio de las Culturas</p>
              <p class="conv-resumen__titulo">{{ convocatoria.titulo }}</p>
              <div class="conv-resumen__datos">
                <div class="dato-item urgente"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Cierra el 30 de mayo — 35 días</div>
                <div class="dato-item"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>Hasta $8.000.000 CLP</div>
                <div class="dato-item"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Nacional</div>
              </div>
              <div style="height:1px;background:var(--borde);margin:1rem 0;"></div>
              <div class="progreso-post">
                <p class="progreso-post__label">Progreso</p>
                <div class="progreso-bar-wrap"><div class="progreso-bar" :style="{ width: progresoBar + '%' }"></div></div>
                <p class="progreso-post__txt">Paso {{ pasoActual }} de 3</p>
              </div>
            </div>
          </div>
          <div class="tip-card">
            <div class="tip-head"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>Consejos para Fondart</p></div>
            <ul>
              <li>Sé específica en los objetivos del proyecto.</li>
              <li>El portafolio debe tener entre 8 y 12 obras con ficha técnica.</li>
              <li>Conecta tu trayectoria con los objetivos de la línea concursable.</li>
              <li>Revisa las bases oficiales en fondosdecultura.cl.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL ÉXITO -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="exitoModal">
        <div class="modal-exito">
          <div class="exito-icon"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></div>
          <h2 class="exito-titulo">¡Postulación enviada!</h2>
          <p class="exito-sub">Tu postulación fue enviada exitosamente. Puedes hacer seguimiento desde el panel de postulaciones.</p>
          <div class="exito-detalle">
            <p><strong>Convocatoria:</strong> {{ convocatoria.titulo }}</p>
            <p><strong>Estado:</strong> Enviada — en espera de revisión</p>
            <p><strong>Fecha:</strong> {{ new Date().toLocaleDateString('es-CL') }}</p>
            <p><strong>N° de referencia:</strong> POST-2026-{{ Math.floor(Math.random()*90000+10000) }}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            <router-link to="/artista/dashboard" class="btn-primary" style="justify-content:center;">Ver mis postulaciones</router-link>
            <router-link to="/artista/convocatorias" class="btn-sec" style="justify-content:center;">Volver a convocatorias</router-link>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { authAPI, obrasAPI, convocatoriasAPI, postulacionesAPI } from '@/services/api'
import '@/assets/css/postulacion.css'

const route = useRoute()
const pasoActual = ref(1)
const exitoModal = ref(false)
const cntMotiv   = ref(0)
const enviando   = ref(false)

const pasos = [
  { num:1, label:'Datos y motivación' },
  { num:2, label:'Portafolio y archivos' },
  { num:3, label:'Revisión y envío' },
]

const convocatoria = ref({ titulo: 'Cargando…', id: '' })
const usuarioNombre = ref('')

const form = ref({ tituloProy:'', motivacion:'', url:'', declaro:false })
const err  = ref({ tituloProy:false, motivacion:false, url:false, portfolio:false, declaro:false })
const archivos = ref({ portfolio:null, cv:null })
const archivoPdfFile = ref(null)
const dragging = ref({ portfolio:false })
const obrasSeleccionadas = ref(new Set())

const progresoBar = computed(() => [33,66,100][pasoActual.value - 1])

const resumenArchivos = computed(() => {
  const a = []
  if (archivos.value.portfolio) a.push('Portafolio PDF')
  if (archivos.value.cv) a.push('CV artístico')
  return a.length ? a.join(', ') : 'Sin archivos adjuntos'
})

const obrasInventario = ref([])

// Cargar datos reales
onMounted(async () => {
  // Nombre del usuario
  const usuario = authAPI.getUsuario()
  usuarioNombre.value = usuario?.nombre || 'Artista'

  // Cargar convocatoria desde query param
  const convId = route.query.id
  if (convId) {
    try {
      const conv = await convocatoriasAPI.detalle(convId)
      convocatoria.value = {
        id: conv._id,
        titulo: conv.titulo,
        entidad: conv.entidad || conv.galeristaId?.nombre || '',
        tipo: conv.tipo,
        region: conv.region || 'Nacional',
        cierre: conv.fechaCierre,
        apertura: conv.fechaApertura,
        requisitos: conv.requisitos || '',
        descripcion: conv.descripcion || ''
      }
    } catch (err) {
      console.error('Error cargando convocatoria:', err)
    }
  }

  // Cargar obras del inventario
  try {
    const data = await obrasAPI.listar()
    obrasInventario.value = data.obras.map(o => ({
      id: o._id,
      titulo: o.titulo,
      tecnica: o.tecnica,
      color: o.imagenUrl
        ? `url(${o.imagenUrl}) center/cover`
        : 'linear-gradient(135deg,#888,#444)'
    }))
  } catch (err) {
    console.error('Error cargando obras:', err)
  }
})

function toggleObra(id) {
  if (obrasSeleccionadas.value.has(id)) { obrasSeleccionadas.value.delete(id) }
  else if (obrasSeleccionadas.value.size < 5) { obrasSeleccionadas.value.add(id) }
  else { alert('Máximo 5 obras por postulación.') }
}

function adjuntarArchivo(e, tipo) {
  const file = e.target.files[0]
  if (!file) return
  const maxMB = tipo === 'portfolio' ? 10 : 5
  if (file.size > maxMB * 1024 * 1024) { alert(`El archivo supera los ${maxMB} MB.`); return }
  archivos.value[tipo] = file.name
  if (tipo === 'portfolio') archivoPdfFile.value = file
}

function dropFile(e, tipo) {
  dragging.value[tipo] = false
  const file = e.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    archivos.value[tipo] = file.name
    if (tipo === 'portfolio') archivoPdfFile.value = file
  }
}

function irPaso(n) {
  if (n > pasoActual.value && !validar(pasoActual.value)) return
  pasoActual.value = n
}

function validar(paso) {
  if (paso === 1) {
    err.value.tituloProy = !form.value.tituloProy.trim()
    err.value.motivacion = form.value.motivacion.length < 100
    err.value.url        = !!form.value.url && !form.value.url.startsWith('https://')
    return !err.value.tituloProy && !err.value.motivacion && !err.value.url
  }
  if (paso === 2) {
    // Portfolio ya no es obligatorio para la API
    return true
  }
  return true
}

async function enviar() {
  err.value.declaro = !form.value.declaro
  if (err.value.declaro) return

  enviando.value = true
  try {
    await postulacionesAPI.postular({
      convocatoriaId: convocatoria.value.id,
      declaracionArtista: `${form.value.tituloProy}\n\n${form.value.motivacion}`,
      linkPortafolio: form.value.url,
      obrasAdjuntas: Array.from(obrasSeleccionadas.value)
    }, archivoPdfFile.value)

    exitoModal.value = true
  } catch (error) {
    console.error('Error al postular:', error)
    alert(error.response?.data?.mensaje || 'Error al enviar la postulación')
  } finally {
    enviando.value = false
  }
}
</script>