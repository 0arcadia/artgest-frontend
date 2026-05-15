<template>
  <div class="layout v-perfil">
    <SidebarArtista ruta-activa="perfil" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <button class="btn-volver" onclick="history.back()" title="Volver">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h1>Mi perfil</h1>
          <p>Formulario 3 — Completa tu información para aparecer en más búsquedas</p>
        </div>
        <div class="topbar__der">
          <router-link :to="`/portafolio/${usuarioId}`" class="btn-sec">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver portafolio público
          </router-link>
          <button class="btn-primary" @click="guardar">
            <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar cambios
          </button>
        </div>
      </header>

      <div class="perfil-contenido">

        <!-- COLUMNA FORMULARIO -->
        <div>

          <!-- PROGRESO -->
          <div class="progreso-card">
            <div class="progreso-card__head">
              <p class="progreso-card__titulo">Completitud del perfil</p>
              <p class="progreso-card__pct">{{ progreso }}%</p>
            </div>
            <div class="progreso-bar-wrap"><div class="progreso-bar" :style="{ width: progreso + '%' }"></div></div>
            <div class="progreso-items">
              <div class="prog-item" :class="checks.nombre ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24">
                  <path v-if="checks.nombre" d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
                </svg>
                <span>Nombre completo</span>
              </div>
              <div class="prog-item" :class="checks.bio ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.bio" d="M9 12l2 2 4-4"/></svg>
                <span>Biografía</span>
              </div>
              <div class="prog-item" :class="checks.region ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.region" d="M9 12l2 2 4-4"/></svg>
                <span>Región</span>
              </div>
              <div class="prog-item" :class="checks.foto ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.foto" d="M9 12l2 2 4-4"/></svg>
                <span>Foto de perfil{{ checks.foto ? '' : ' (falta)' }}</span>
              </div>
              <div class="prog-item" :class="checks.web ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.web" d="M9 12l2 2 4-4"/></svg>
                <span>Sitio web{{ checks.web ? '' : ' (falta)' }}</span>
              </div>
              <div class="prog-item" :class="checks.disciplinas ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.disciplinas" d="M9 12l2 2 4-4"/></svg>
                <span>Disciplinas seleccionadas</span>
              </div>
              <div class="prog-item" :class="checks.instagram ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.instagram" d="M9 12l2 2 4-4"/></svg>
                <span>Instagram</span>
              </div>
            </div>
          </div>

          <!-- SEC 1: IDENTIDAD -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">1</div>
              <p class="sec-titulo">Identidad y foto</p>
              <p class="sec-sub">Datos básicos de tu perfil público</p>
            </div>
            <div class="sec-body">
              <!-- FOTO -->
              <div class="campo" style="margin-bottom:1.5rem;">
                <label>Foto de perfil <span class="opt">(opcional · máx. 2 MB)</span></label>
                <div class="foto-upload">
                  <div class="foto-preview" :style="{ background: fotoUrl ? 'transparent' : 'var(--terra)' }" @click="$refs.inpFoto.click()">
                    <img v-if="fotoUrl" :src="fotoUrl" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>
                    <span v-else>PC</span>
                    <div class="foto-overlay">
                      <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                  </div>
                  <input ref="inpFoto" type="file" accept="image/png,image/jpeg" style="display:none" @change="cargarFoto"/>
                  <div class="foto-info">
                    <p>Sube una foto profesional tuya</p>
                    <p>PNG o JPG · Mínimo 200×200 px · Máximo 2 MB</p>
                    <div class="foto-btns">
                      <button class="fbtn fbtn-terra" @click="$refs.inpFoto.click()">Subir foto</button>
                      <button class="fbtn fbtn-out"   @click="fotoUrl = ''">Quitar foto</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-grid">
                <div class="campo fg-full">
                  <label>Nombre completo <span class="req">*</span></label>
                  <input type="text" v-model="form.nombre" maxlength="100" :class="{ err: errores.nombre }" @input="actualizarPreview"/>
                  <span class="campo__error" v-if="errores.nombre">El nombre es obligatorio (mín. 3 caracteres).</span>
                </div>
                <div class="campo">
                  <label>Región <span class="opt">(opcional)</span></label>
                  <select v-model="form.region" @change="actualizarPreview">
                    <option value="">Selecciona tu región…</option>
                    <option v-for="r in regiones" :key="r">{{ r }}</option>
                  </select>
                </div>
                <div class="campo">
                  <label>Año de inicio actividad <span class="opt">(opcional)</span></label>
                  <input type="number" v-model="form.inicio" min="1950" max="2026" placeholder="Ej: 2018"/>
                </div>
              </div>
            </div>
          </div>

          <!-- SEC 2: BIOGRAFÍA -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">2</div>
              <p class="sec-titulo">Biografía</p>
              <p class="sec-sub">Cuéntale a galeristas quién eres</p>
            </div>
            <div class="sec-body">
              <div class="campo">
                <label>Biografía <span class="opt">(opcional · máx. 1500 caracteres)</span></label>
                <textarea v-model="form.bio" maxlength="1500" rows="5" @input="actualizarPreview"
                  placeholder="Escribe una presentación de tu trabajo, formación, trayectoria y enfoque artístico…"></textarea>
                <p class="campo__cnt">{{ form.bio.length }} / 1500 caracteres</p>
              </div>
            </div>
          </div>

          <!-- SEC 3: DISCIPLINAS -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">3</div>
              <p class="sec-titulo">Disciplinas</p>
              <p class="sec-sub" id="disc-cnt">{{ selDisc.size }} seleccionada{{ selDisc.size !== 1 ? 's' : '' }}</p>
            </div>
            <div class="sec-body">
              <div class="disciplinas-grid">
                <button
                  class="disc-pill"
                  v-for="d in todasDisc"
                  :key="d"
                  :class="{ sel: selDisc.has(d) }"
                  @click="toggleDisc(d)"
                >{{ d }}</button>
              </div>
              <span class="campo__error" v-if="errores.disciplinas" style="display:block;margin-top:0.6rem;">Selecciona al menos una disciplina.</span>
            </div>
          </div>

          <!-- SEC 4: REDES Y CONTACTO -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">4</div>
              <p class="sec-titulo">Redes sociales y contacto</p>
              <p class="sec-sub">Visibles en tu portafolio público</p>
            </div>
            <div class="sec-body">
              <div class="form-grid">
                <div class="campo">
                  <label>Instagram <span class="opt">(opcional)</span></label>
                  <div class="input-prefix">
                    <span class="prefix">@</span>
                    <input type="text" v-model="form.instagram" placeholder="tu_usuario"/>
                  </div>
                </div>
                <div class="campo">
                  <label>Sitio web <span class="opt">(opcional)</span></label>
                  <input type="url" v-model="form.web" placeholder="https://tupagina.cl" :class="{ err: errores.web }" @input="actualizarProgreso"/>
                  <span class="campo__error" v-if="errores.web">URL válida (https://…)</span>
                </div>
                <div class="campo">
                  <label>Behance <span class="opt">(opcional)</span></label>
                  <div class="input-prefix">
                    <span class="prefix">behance.net/</span>
                    <input type="text" v-model="form.behance" placeholder="tu_perfil"/>
                  </div>
                </div>
                <div class="campo">
                  <label>LinkedIn <span class="opt">(opcional)</span></label>
                  <div class="input-prefix">
                    <span class="prefix">linkedin.com/in/</span>
                    <input type="text" v-model="form.linkedin" placeholder="tu_perfil"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SEC 5: VISIBILIDAD -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">5</div>
              <p class="sec-titulo">Configuración de visibilidad</p>
              <p class="sec-sub">Controla qué ven galeristas y público</p>
            </div>
            <div class="sec-body">
              <div class="toggles-lista">
                <div class="toggle-row" v-for="t in toggles" :key="t.key" @click="t.val = !t.val">
                  <div class="toggle-info">
                    <p class="toggle-titulo">{{ t.titulo }}</p>
                    <p class="toggle-sub">{{ t.sub }}</p>
                  </div>
                  <div class="toggle-sw" :class="{ on: t.val }">
                    <div class="toggle-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
            <button class="btn-sec" @click="resetForm">Descartar cambios</button>
            <button class="btn-primary" @click="guardar">
              <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar cambios
            </button>
          </div>
        </div>

        <!-- PANEL LATERAL -->
        <div class="panel-lateral">
          <!-- PREVIEW -->
          <div class="preview-card">
            <div class="preview-card__head">
              <div class="preview-av" :style="{ background: fotoUrl ? 'transparent' : 'var(--terra)' }">
                <img v-if="fotoUrl" :src="fotoUrl" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>
                <span v-else>PC</span>
              </div>
              <p class="preview-nombre">{{ form.nombre || 'Tu nombre' }}</p>
              <p class="preview-region">{{ form.region || 'Tu región' }} · Chile</p>
              <div class="preview-discs">
                <span class="preview-disc" v-for="d in [...selDisc].slice(0,4)" :key="d">{{ d }}</span>
              </div>
            </div>
            <div class="preview-card__body">
              <p class="preview-bio">{{ form.bio.length > 120 ? form.bio.substring(0,120) + '…' : form.bio || 'Tu biografía aparecerá aquí…' }}</p>
              <div class="preview-stats">
                <div class="pstat"><p class="pstat__num">23</p><p class="pstat__lbl">Obras</p></div>
                <div class="pstat"><p class="pstat__num">847</p><p class="pstat__lbl">Visitas</p></div>
                <div class="pstat"><p class="pstat__num">7</p><p class="pstat__lbl">Ventas</p></div>
              </div>
            </div>
            <div class="preview-card__footer">
              <p class="preview-ver">
                <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Así te verán los galeristas
              </p>
            </div>
          </div>

          <!-- TIPS -->
          <div class="tip-card">
            <div class="tip-head">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>Tips para un perfil poderoso</p>
            </div>
            <ul>
              <li>Una foto profesional aumenta en 3× las consultas de galeristas.</li>
              <li>La biografía debe conectar tu trayectoria con tu propuesta visual actual.</li>
              <li>Incluye tu sitio web para que los galeristas vean más de tu trabajo.</li>
              <li>Selecciona solo las disciplinas en que trabajas activamente.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <!-- TOAST -->
    <div class="toast" :class="{ show: toastVisible }">
      <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
      <span>{{ toastMsg }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { authAPI, usuariosAPI } from '@/services/api'
import '@/assets/css/perfil.css'

const inpFoto = ref(null)
const fotoUrl = ref('')
const fotoFile = ref(null)
const usuarioId = ref('')
const toastVisible = ref(false)
const toastMsg = ref('')
const guardando = ref(false)

const todasDisc = ['Pintura','Fotografía análoga','Fotografía digital','Grabado','Escultura','Cerámica','Arte digital','Instalación','Videoarte','Performance','Ilustración','Muralismo','Textil']
const selDisc   = ref(new Set())

const regiones = ['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Región Metropolitana','O\'Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']

const form = reactive({
  nombre: '',
  region: '',
  inicio: '',
  bio: '',
  instagram: '',
  web: '',
  behance: '',
  linkedin: '',
})

const errores = ref({ nombre:false, disciplinas:false, web:false })

const toggles = reactive([
  { key:'publico',  titulo:'Perfil público visible',       sub:'Tu portafolio aparece en el explorador de artistas.',                             val:true },
  { key:'mensajes', titulo:'Recibir mensajes de galeristas',sub:'Los galeristas registrados pueden enviarte mensajes.',                            val:true },
  { key:'precios',  titulo:'Mostrar precios de obras',     sub:'Los precios se muestran en tu portafolio. Desactívalo para "precio a consultar".', val:true },
  { key:'alertas',  titulo:'Alertas de nuevas convocatorias',sub:'Recibe notificaciones cuando abran convocatorias en tu disciplina.',             val:false },
])

// Cargar perfil real
onMounted(async () => {
  try {
    const me = await authAPI.me()
    usuarioId.value = me._id || me.id || ''
    form.nombre = me.nombre || ''
    form.region = me.region || ''
    form.bio = me.bio || ''
    form.instagram = me.instagram || ''
    form.web = me.sitioWeb || ''
    fotoUrl.value = me.fotoUrl || ''
    if (me.disciplinas && me.disciplinas.length) {
      selDisc.value = new Set(me.disciplinas)
    }
    if (me.portafolioPublico !== undefined) {
      toggles[0].val = me.portafolioPublico
    }
  } catch (err) {
    console.error('Error cargando perfil:', err)
  }
})

const checks = computed(() => ({
  nombre: form.nombre.trim().length >= 3,
  bio:    form.bio.trim().length > 0,
  region: !!form.region,
  foto:   !!fotoUrl.value,
  web:    !!form.web && form.web.startsWith('https://'),
  disciplinas: selDisc.value.size > 0,
  instagram: !!form.instagram,
}))

const progreso = computed(() => {
  const vals = Object.values(checks.value)
  return Math.round((vals.filter(Boolean).length / vals.length) * 100)
})

function toggleDisc(d) {
  const s = new Set(selDisc.value)
  s.has(d) ? s.delete(d) : s.add(d)
  selDisc.value = s
}

function cargarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { mostrarToast('La imagen supera 5 MB.'); return }
  fotoFile.value = file
  const reader = new FileReader()
  reader.onload = ev => { fotoUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}

function actualizarPreview() {}
function actualizarProgreso() {}

async function guardar() {
  errores.value.nombre      = form.nombre.trim().length < 3
  errores.value.disciplinas = selDisc.value.size === 0
  errores.value.web         = !!form.web && !form.web.startsWith('https://')
  if (errores.value.nombre || errores.value.disciplinas || errores.value.web) return

  guardando.value = true
  try {
    await usuariosAPI.actualizarPerfil({
      nombre: form.nombre.trim(),
      bio: form.bio.trim(),
      region: form.region,
      sitioWeb: form.web,
      instagram: form.instagram,
      disciplinas: Array.from(selDisc.value),
      portafolioPublico: toggles[0].val
    }, fotoFile.value)

    mostrarToast('✓ Perfil guardado correctamente.')
    fotoFile.value = null
  } catch (err) {
    console.error('Error al guardar perfil:', err)
    mostrarToast('Error al guardar el perfil.')
  } finally {
    guardando.value = false
  }
}

function resetForm() {
  // Recargar desde la API
  location.reload()
}

function mostrarToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3500)
}
</script>