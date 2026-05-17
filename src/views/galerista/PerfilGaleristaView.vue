<template>
  <div class="layout v-perfil-gal">
    <SidebarGalerista ruta-activa="perfil" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <button class="btn-volver" onclick="history.back()" title="Volver">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h1>Mi perfil de galería</h1>
          <p>Completa tu información para que los artistas te encuentren</p>
        </div>
        <div class="topbar__der">
          <button class="btn-primary" @click="guardar" :disabled="guardando">
            <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
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
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.nombre" d="M9 12l2 2 4-4"/></svg>
                <span>Nombre completo</span>
              </div>
              <div class="prog-item" :class="checks.galeria ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.galeria" d="M9 12l2 2 4-4"/></svg>
                <span>Nombre de galería</span>
              </div>
              <div class="prog-item" :class="checks.desc ? 'ok' : 'pend'">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path v-if="checks.desc" d="M9 12l2 2 4-4"/></svg>
                <span>Descripción</span>
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
            </div>
          </div>

          <!-- SEC 1: IDENTIDAD -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">1</div>
              <p class="sec-titulo">Identidad de la galería</p>
              <p class="sec-sub">Datos básicos de tu perfil</p>
            </div>
            <div class="sec-body">
              <!-- FOTO -->
              <div class="campo" style="margin-bottom:1.5rem;">
                <label>Logo / Foto de perfil <span class="opt">(opcional · máx. 2 MB)</span></label>
                <div class="foto-upload">
                  <div class="foto-preview" :style="{ background: fotoUrl ? 'transparent' : '#2A4A6A' }" @click="$refs.inpFoto.click()">
                    <img v-if="fotoUrl" :src="fotoUrl" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>
                    <span v-else>{{ iniciales }}</span>
                    <div class="foto-overlay">
                      <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                  </div>
                  <input ref="inpFoto" type="file" accept="image/png,image/jpeg" style="display:none" @change="cargarFoto"/>
                  <div class="foto-info">
                    <p>Sube el logo o foto de tu galería</p>
                    <p>PNG o JPG · Mínimo 200×200 px · Máximo 2 MB</p>
                    <div class="foto-btns">
                      <button class="fbtn fbtn-terra" @click="$refs.inpFoto.click()">Subir foto</button>
                      <button class="fbtn fbtn-out" @click="fotoUrl = ''">Quitar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="campo">
                  <label>Tu nombre completo <span class="req">*</span></label>
                  <input type="text" v-model="form.nombre" maxlength="100" :class="{ err: errores.nombre }"/>
                  <span class="campo__error" v-if="errores.nombre">El nombre es obligatorio (mín. 3 caracteres).</span>
                </div>
                <div class="campo">
                  <label>Nombre de la galería <span class="req">*</span></label>
                  <input type="text" v-model="form.nombreGaleria" maxlength="100" placeholder="Ej: Galería Centro" :class="{ err: errores.galeria }"/>
                  <span class="campo__error" v-if="errores.galeria">El nombre de la galería es obligatorio.</span>
                </div>
                <div class="campo">
                  <label>Región <span class="opt">(opcional)</span></label>
                  <select v-model="form.region">
                    <option value="">Selecciona tu región…</option>
                    <option v-for="r in regiones" :key="r">{{ r }}</option>
                  </select>
                </div>
                <div class="campo">
                  <label>Ciudad <span class="opt">(opcional)</span></label>
                  <input type="text" v-model="form.ciudad" placeholder="Ej: Santiago"/>
                </div>
              </div>
            </div>
          </div>

          <!-- SEC 2: DESCRIPCIÓN -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">2</div>
              <p class="sec-titulo">Descripción de la galería</p>
              <p class="sec-sub">Cuéntale a los artistas sobre tu espacio</p>
            </div>
            <div class="sec-body">
              <div class="campo">
                <label>Descripción <span class="opt">(opcional · máx. 1500 caracteres)</span></label>
                <textarea v-model="form.descripcionGaleria" maxlength="1500" rows="5"
                  placeholder="Describe tu galería, línea curatorial, tipo de artistas que buscas, años de trayectoria…"></textarea>
                <p class="campo__cnt">{{ form.descripcionGaleria.length }} / 1500 caracteres</p>
              </div>
            </div>
          </div>

          <!-- SEC 3: INTERESES -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">3</div>
              <p class="sec-titulo">Disciplinas de interés</p>
              <p class="sec-sub">{{ selDisc.size }} seleccionada{{ selDisc.size !== 1 ? 's' : '' }}</p>
            </div>
            <div class="sec-body">
              <p style="font-size:0.82rem;color:var(--gris-c);margin-bottom:1rem;">Selecciona las disciplinas artísticas que te interesan como galerista. Esto ayuda a los artistas a encontrarte.</p>
              <div class="disciplinas-grid">
                <button class="disc-pill" v-for="d in todasDisc" :key="d" :class="{ sel: selDisc.has(d) }" @click="toggleDisc(d)">{{ d }}</button>
              </div>
            </div>
          </div>

          <!-- SEC 4: REDES -->
          <div class="form-sec">
            <div class="sec-head">
              <div class="sec-num">4</div>
              <p class="sec-titulo">Redes sociales y contacto</p>
              <p class="sec-sub">Visibles para artistas registrados</p>
            </div>
            <div class="sec-body">
              <div class="form-grid">
                <div class="campo">
                  <label>Instagram <span class="opt">(opcional)</span></label>
                  <div class="input-prefix">
                    <span class="prefix">@</span>
                    <input type="text" v-model="form.instagram" placeholder="galeria_centro"/>
                  </div>
                </div>
                <div class="campo">
                  <label>Sitio web <span class="opt">(opcional)</span></label>
                  <input type="url" v-model="form.web" placeholder="https://galeriacentro.cl" :class="{ err: errores.web }"/>
                  <span class="campo__error" v-if="errores.web">URL válida (https://…)</span>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
            <button class="btn-sec" @click="resetForm">Descartar cambios</button>
            <button class="btn-primary" @click="guardar" :disabled="guardando">
              <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
            </button>
          </div>
        </div>

        <!-- PANEL LATERAL -->
        <div class="panel-lateral">
          <div class="preview-card">
            <div class="preview-card__head">
              <div class="preview-av" :style="{ background: fotoUrl ? 'transparent' : '#2A4A6A' }">
                <img v-if="fotoUrl" :src="fotoUrl" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>
                <span v-else>{{ iniciales }}</span>
              </div>
              <p class="preview-nombre">{{ form.nombreGaleria || 'Tu galería' }}</p>
              <p class="preview-region">{{ form.region || 'Tu región' }} · Chile</p>
              <div class="preview-discs">
                <span class="preview-disc" v-for="d in [...selDisc].slice(0,4)" :key="d">{{ d }}</span>
              </div>
            </div>
            <div class="preview-card__body">
              <p class="preview-bio">{{ form.descripcionGaleria.length > 120 ? form.descripcionGaleria.substring(0,120) + '…' : form.descripcionGaleria || 'La descripción de tu galería aparecerá aquí…' }}</p>
              <div class="preview-stats">
                <div class="pstat"><p class="pstat__num">3</p><p class="pstat__lbl">Convocatorias</p></div>
                <div class="pstat"><p class="pstat__num">1</p><p class="pstat__lbl">Postulaciones</p></div>
                <div class="pstat"><p class="pstat__num">0</p><p class="pstat__lbl">Favoritos</p></div>
              </div>
            </div>
            <div class="preview-card__footer">
              <p class="preview-ver">
                <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Así te verán los artistas
              </p>
            </div>
          </div>

          <div class="tip-card">
            <div class="tip-head">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>Tips para un perfil efectivo</p>
            </div>
            <ul>
              <li>Un logo profesional genera más confianza con los artistas.</li>
              <li>Describe tu línea curatorial para atraer artistas afines.</li>
              <li>Incluye tu sitio web para que los artistas vean tu espacio.</li>
              <li>Selecciona las disciplinas que más te interesan.</li>
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
import SidebarGalerista from '@/components/SidebarGalerista.vue'
import { authAPI, usuariosAPI } from '@/services/api'
import '@/assets/css/perfil.css'

const inpFoto = ref(null)
const fotoUrl = ref('')
const fotoFile = ref(null)
const toastVisible = ref(false)
const toastMsg = ref('')
const guardando = ref(false)

const todasDisc = ['Pintura','Fotografía','Grabado','Escultura','Cerámica','Arte digital','Instalación','Videoarte','Performance','Ilustración','Muralismo','Textil','Técnica mixta']
const selDisc = ref(new Set())

const regiones = ['Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso','Región Metropolitana','O\'Higgins','Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes']

const form = reactive({
  nombre: '',
  nombreGaleria: '',
  region: '',
  ciudad: '',
  descripcionGaleria: '',
  instagram: '',
  web: '',
})

const errores = ref({ nombre: false, galeria: false, web: false })

const iniciales = computed(() => {
  const name = form.nombreGaleria || form.nombre || 'GA'
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
})

onMounted(async () => {
  try {
    const me = await authAPI.me()
    form.nombre = me.nombre || ''
    form.nombreGaleria = me.nombreGaleria || ''
    form.region = me.region || ''
    form.ciudad = me.ciudad || ''
    form.descripcionGaleria = me.descripcionGaleria || ''
    form.instagram = me.instagram || ''
    form.web = me.sitioWeb || ''
    fotoUrl.value = me.fotoUrl || ''
    if (me.disciplinas && me.disciplinas.length) {
      selDisc.value = new Set(me.disciplinas)
    }
  } catch (err) {
    console.error('Error cargando perfil:', err)
  }
})

const checks = computed(() => ({
  nombre: form.nombre.trim().length >= 3,
  galeria: form.nombreGaleria.trim().length >= 2,
  desc: form.descripcionGaleria.trim().length > 0,
  region: !!form.region,
  foto: !!fotoUrl.value,
  web: !!form.web && form.web.startsWith('https://'),
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

async function guardar() {
  errores.value.nombre = form.nombre.trim().length < 3
  errores.value.galeria = form.nombreGaleria.trim().length < 2
  errores.value.web = !!form.web && !form.web.startsWith('https://')
  if (errores.value.nombre || errores.value.galeria || errores.value.web) return

  guardando.value = true
  try {
    await usuariosAPI.actualizarPerfil({
      nombre: form.nombre.trim(),
      nombreGaleria: form.nombreGaleria.trim(),
      descripcionGaleria: form.descripcionGaleria.trim(),
      region: form.region,
      sitioWeb: form.web,
      instagram: form.instagram,
      disciplinas: Array.from(selDisc.value),
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

function resetForm() { location.reload() }

function mostrarToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3500)
}
</script>