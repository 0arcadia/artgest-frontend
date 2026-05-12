<template>
  <div class="layout v-inventario">
    <SidebarArtista ruta-activa="inventario" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Inventario de obras</h1>
          <p>{{ stats.total }} obras · {{ stats.vendidas }} vendidas · {{ stats.reservadas }} reservadas</p>
        </div>
        <div class="topbar__der">
          <button class="btn-sec" @click="exportarCSV">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar
          </button>
          <button class="btn-primary" @click="abrirModal()">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar obra
          </button>
        </div>
      </header>

      <div class="contenido">

        <!-- STATS MINI -->
        <div class="stats-mini">
          <div class="smin" v-for="s in statsMini" :key="s.label">
            <div class="smin__dot" :style="{ background: s.color }"></div>
            <div>
              <p class="smin__num">{{ s.valor }}</p>
              <p class="smin__label">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <!-- FILTROS -->
        <div class="filtros-bar">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="filtros.buscar" placeholder="Buscar obra por título…"/>
          </div>
          <select v-model="filtros.tecnica" class="filtro-select">
            <option value="">Todas las técnicas</option>
            <option v-for="t in tecnicas" :key="t">{{ t }}</option>
          </select>
          <select v-model="filtros.disp" class="filtro-select">
            <option value="">Toda disponibilidad</option>
            <option value="disponible">Disponible</option>
            <option value="reservada">Reservada</option>
            <option value="vendida">Vendida</option>
          </select>
          <select v-model="filtros.anio" class="filtro-select">
            <option value="">Todos los años</option>
            <option v-for="a in anios" :key="a">{{ a }}</option>
          </select>
          <div class="filtros-bar__sep"></div>
          <div class="vista-btns">
            <button class="vista-btn" :class="{ activo: vista === 'grid' }" @click="vista = 'grid'">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button class="vista-btn" :class="{ activo: vista === 'list' }" @click="vista = 'list'">
              <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- GRID -->
        <div v-if="vista === 'grid'" class="obras-grid">
          <div class="obra-card" v-for="o in obrasFiltradas" :key="o.id">
            <div class="obra-card__img">
              <div class="obra-card__thumb" :style="{ background: o.color }"></div>
              <div class="obra-card__badge">
                <span class="badge" :class="badgeClass(o.disp)">{{ dispLabel(o.disp) }}</span>
              </div>
              <div class="obra-card__acciones">
                <button class="accion-btn" @click="abrirModal(o)" title="Editar">
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button v-if="o.disp !== 'vendida'" class="accion-btn venta" @click="abrirVenta(o)" title="Marcar vendida">
                  <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
                <button class="accion-btn danger" @click="eliminar(o.id)" title="Eliminar">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            </div>
            <div class="obra-card__body">
              <p class="obra-card__titulo">{{ o.titulo }}</p>
              <p class="obra-card__tecnica">{{ o.tecnica }}{{ o.dims ? ' · ' + o.dims : '' }}</p>
              <div class="obra-card__footer">
                <p class="obra-card__precio">{{ o.precio > 0 ? '$' + o.precio.toLocaleString('es-CL') : 'A consultar' }}</p>
                <p class="obra-card__anio">{{ o.anio }}</p>
              </div>
            </div>
          </div>
          <p v-if="!obrasFiltradas.length" class="empty-txt">No se encontraron obras con esos filtros.</p>
        </div>

        <!-- LISTA -->
        <div v-if="vista === 'list'" class="tabla-wrap">
          <table class="tabla">
            <thead>
              <tr>
                <th>Obra</th><th>Técnica</th><th>Dimensiones</th>
                <th>Año</th><th style="text-align:right">Precio</th>
                <th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in obrasFiltradas" :key="o.id">
                <td>
                  <div class="obra-cell">
                    <div class="obra-thumb" :style="{ background: o.color }"></div>
                    <div>
                      <p class="obra-cell-titulo">{{ o.titulo }}</p>
                      <p class="obra-cell-serie">{{ o.serie || '—' }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ o.tecnica }}</td>
                <td>{{ o.dims || '—' }}</td>
                <td>{{ o.anio }}</td>
                <td style="text-align:right;font-weight:600;color:var(--terra);">{{ o.precio > 0 ? '$' + o.precio.toLocaleString('es-CL') : 'Consultar' }}</td>
                <td><span class="badge" :class="badgeClass(o.disp)">{{ dispLabel(o.disp) }}</span></td>
                <td>
                  <div class="tabla-acciones">
                    <button class="accion-btn" @click="abrirModal(o)"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button class="accion-btn danger" @click="eliminar(o.id)"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="!obrasFiltradas.length" class="empty-txt" style="padding:2rem;text-align:center;">No se encontraron obras.</p>
        </div>

      </div>
    </div>

    <!-- MODAL OBRA -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalObra" @click.self="modalObra = false">
        <div class="modal" style="max-height:90vh;display:flex;flex-direction:column;">
          <div class="modal__head">
            <div>
              <h2 class="modal__titulo">{{ obraEditar ? 'Editar obra' : 'Agregar obra' }}</h2>
              <p class="modal__sub">Completa la ficha técnica de tu obra</p>
            </div>
            <button class="modal__cerrar" @click="modalObra = false">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal__body" style="overflow-y:auto;flex:1;">
            <div class="form-grid">

              <div class="campo fg-full">
                <label>Imagen <span class="req">*</span></label>
                <div class="upload-area" @click="$refs.inpImagen.click()">
                  <input ref="inpImagen" type="file" accept="image/png,image/jpeg" @change="previewImagen" style="display:none"/>
                  <div v-if="!form.imagenPreview">
                    <p class="upload-area__txt">Clic para seleccionar imagen</p>
                    <p class="upload-area__sub">PNG o JPG · Máximo 10 MB</p>
                  </div>
                  <img v-else :src="form.imagenPreview" style="max-height:120px;border-radius:6px;margin:0 auto;display:block;"/>
                </div>
                <span class="campo__error" v-if="errores.imagen">La imagen es obligatoria (máx. 10 MB)</span>
              </div>

              <div class="campo">
                <label>Título <span class="req">*</span></label>
                <input type="text" v-model="form.titulo" placeholder="Ej: Latencia III" :class="{ err: errores.titulo }"/>
                <span class="campo__error" v-if="errores.titulo">Mínimo 3 caracteres</span>
              </div>
              <div class="campo">
                <label>Serie</label>
                <input type="text" v-model="form.serie" placeholder="Ej: Serie Latencia"/>
              </div>
              <div class="campo">
                <label>Técnica <span class="req">*</span></label>
                <select v-model="form.tecnica" :class="{ err: errores.tecnica }">
                  <option value="">Selecciona…</option>
                  <option v-for="t in tecnicas" :key="t">{{ t }}</option>
                </select>
                <span class="campo__error" v-if="errores.tecnica">Selecciona una técnica</span>
              </div>
              <div class="campo">
                <label>Dimensiones</label>
                <input type="text" v-model="form.dims" placeholder="Ej: 80 × 60 cm"/>
              </div>
              <div class="campo">
                <label>Año <span class="req">*</span></label>
                <input type="number" v-model="form.anio" placeholder="2024" min="1900" max="2026" :class="{ err: errores.anio }"/>
                <span class="campo__error" v-if="errores.anio">Año entre 1900 y 2026</span>
              </div>
              <div class="campo">
                <label>Precio (CLP) <span class="req">*</span></label>
                <input type="number" v-model="form.precio" placeholder="380000" min="1" :class="{ err: errores.precio }"/>
                <span class="campo__error" v-if="errores.precio">Precio válido</span>
              </div>
              <div class="campo">
                <label>Disponibilidad <span class="req">*</span></label>
                <select v-model="form.disp">
                  <option value="disponible">Disponible</option>
                  <option value="reservada">Reservada</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>
              <div class="campo fg-full">
                <label>Descripción</label>
                <textarea v-model="form.desc" placeholder="Describe la obra…" maxlength="1000" rows="3"></textarea>
                <p style="font-size:0.73rem;color:var(--gris);text-align:right;">{{ form.desc.length }} / 1000</p>
              </div>
            </div>
          </div>
          <div class="modal__footer">
            <p style="font-size:0.8rem;color:var(--gris);">Campos con <span style="color:var(--terra)">*</span> son obligatorios</p>
            <div style="display:flex;gap:0.75rem;">
              <button class="btn-sec" @click="modalObra = false">Cancelar</button>
              <button class="btn-primary" @click="guardarObra" :disabled="guardando">{{ guardando ? 'Guardando…' : 'Guardar obra' }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL VENTA -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalVenta" @click.self="modalVenta = false">
        <div class="modal" style="max-width:480px;max-height:90vh;display:flex;flex-direction:column;">
          <div class="modal__head">
            <div>
              <h2 class="modal__titulo">Marcar como vendida</h2>
              <p class="modal__sub">Se generará el certificado de autenticidad automáticamente</p>
            </div>
            <button class="modal__cerrar" @click="modalVenta = false">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal__body" style="overflow-y:auto;flex:1;">
            <div class="venta-obra-info">
              <div class="venta-thumb" :style="{ background: obraVenta?.color }"></div>
              <div>
                <p style="font-family:var(--serif);font-size:1rem;font-weight:700;">{{ obraVenta?.titulo }}</p>
                <p style="font-size:0.78rem;color:var(--gris);">{{ obraVenta?.tecnica }}</p>
              </div>
            </div>
            <div class="form-grid" style="grid-template-columns:1fr 1fr;">
              <div class="campo">
                <label>Nombre comprador <span class="req">*</span></label>
                <input type="text" v-model="venta.nombre" placeholder="Ej: Roberto Sánchez" :class="{ err: errVenta.nombre }"/>
                <span class="campo__error" v-if="errVenta.nombre">Campo obligatorio</span>
              </div>
              <div class="campo">
                <label>Email comprador <span class="req">*</span></label>
                <input type="email" v-model="venta.email" placeholder="correo@email.com" :class="{ err: errVenta.email }"/>
                <span class="campo__error" v-if="errVenta.email">Email válido</span>
              </div>
              <div class="campo fg-full">
                <label>Precio de venta (CLP) <span class="req">*</span></label>
                <input type="number" v-model="venta.precio" placeholder="380000" :class="{ err: errVenta.precio }"/>
                <span class="campo__error" v-if="errVenta.precio">Precio válido</span>
              </div>
            </div>
            <div class="info-box">
              Al confirmar, la obra cambia a <strong>Vendida</strong> y se genera el certificado PDF con código QR verificable.
            </div>
          </div>
          <div class="modal__footer">
            <div></div>
            <div style="display:flex;gap:0.75rem;">
              <button class="btn-sec" @click="modalVenta = false">Cancelar</button>
              <button class="btn-primary" @click="confirmarVenta" :disabled="vendiendo">{{ vendiendo ? 'Procesando…' : 'Confirmar y generar certificado' }}</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SidebarArtista from '@/components/SidebarArtista.vue'
import { obrasAPI, certificadosAPI } from '@/services/api'
import '@/assets/css/inventario.css'

// ── DATOS ─────────────────────────────────────────────
const obras = ref([])
const cargando = ref(false)
const errorMsg = ref('')

const tecnicas = ['Óleo sobre tela','Óleo sobre madera','Acrílico sobre tela','Acuarela','Grabado en metal','Grabado en madera','Fotografía análoga','Fotografía digital','Arte digital','Cerámica','Escultura','Técnica mixta','Otra']
const anios    = [2026,2025,2024,2023,2022,2021,2020]

// ── CARGAR OBRAS ──────────────────────────────────────
async function cargarObras() {
  cargando.value = true
  try {
    const data = await obrasAPI.listar()
    obras.value = data.obras.map(o => ({
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
        : 'linear-gradient(135deg,#888,#444)',
      enPortafolio: o.enPortafolio
    }))
  } catch (err) {
    console.error('Error cargando obras:', err)
    errorMsg.value = 'Error al cargar las obras'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarObras)

// ── FILTROS ────────────────────────────────────────────
const filtros = ref({ buscar:'', tecnica:'', disp:'', anio:'' })
const vista   = ref('grid')

const obrasFiltradas = computed(() =>
  obras.value.filter(o => {
    const q = filtros.value.buscar.toLowerCase()
    return (!q || o.titulo.toLowerCase().includes(q)) &&
           (!filtros.value.tecnica || o.tecnica === filtros.value.tecnica) &&
           (!filtros.value.disp    || o.disp === filtros.value.disp) &&
           (!filtros.value.anio    || String(o.anio) === String(filtros.value.anio))
  })
)

// ── STATS ──────────────────────────────────────────────
const stats = computed(() => ({
  total:     obras.value.length,
  vendidas:  obras.value.filter(o => o.disp === 'vendida').length,
  reservadas:obras.value.filter(o => o.disp === 'reservada').length,
}))

const statsMini = computed(() => [
  { color:'#2A7A3B', valor: obras.value.filter(o=>o.disp==='disponible').length, label:'Disponibles' },
  { color:'#B07B10', valor: obras.value.filter(o=>o.disp==='reservada').length,  label:'Reservadas'  },
  { color:'#999',    valor: obras.value.filter(o=>o.disp==='vendida').length,    label:'Vendidas'    },
  { color:'var(--terra)', valor:'$'+obras.value.filter(o=>o.disp!=='vendida').reduce((s,o)=>s+o.precio,0).toLocaleString('es-CL'), label:'Valor disponible' },
])

// ── MODAL OBRA ─────────────────────────────────────────
const modalObra  = ref(false)
const obraEditar = ref(null)
const inpImagen  = ref(null)
const archivoImagen = ref(null)
const guardando  = ref(false)

const formInicial = () => ({ titulo:'', serie:'', tecnica:'', dims:'', anio:'', precio:'', disp:'disponible', desc:'', imagenPreview:'' })
const form    = ref(formInicial())
const errores = ref({ titulo:false, tecnica:false, anio:false, precio:false, imagen:false })

function abrirModal(obra = null) {
  obraEditar.value = obra
  archivoImagen.value = null
  if (obra) {
    form.value = {
      titulo: obra.titulo,
      serie: obra.serie,
      tecnica: obra.tecnica,
      dims: obra.dims,
      anio: obra.anio,
      precio: obra.precio,
      disp: obra.disp,
      desc: obra.desc || '',
      imagenPreview: obra.imagenUrl || ''
    }
  } else {
    form.value = formInicial()
  }
  Object.keys(errores.value).forEach(k => errores.value[k] = false)
  modalObra.value = true
}

function previewImagen(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) { alert('La imagen supera 10 MB'); return }
  archivoImagen.value = file
  const reader = new FileReader()
  reader.onload = ev => { form.value.imagenPreview = ev.target.result }
  reader.readAsDataURL(file)
}

async function guardarObra() {
  const f = form.value
  errores.value.titulo  = f.titulo.trim().length < 3
  errores.value.tecnica = !f.tecnica
  errores.value.anio    = !f.anio || f.anio < 1900 || f.anio > 2026
  errores.value.precio  = f.precio === '' || f.precio < 0
  if (Object.values(errores.value).some(Boolean)) return

  guardando.value = true
  try {
    const datosObra = {
      titulo: f.titulo.trim(),
      tecnica: f.tecnica,
      dimensiones: f.dims,
      anio: Number(f.anio),
      precio: Number(f.precio),
      estado: f.disp,
      serie: f.serie,
      descripcion: f.desc
    }

    if (obraEditar.value) {
      await obrasAPI.actualizar(obraEditar.value.id, datosObra, archivoImagen.value)
    } else {
      await obrasAPI.crear(datosObra, archivoImagen.value)
    }

    modalObra.value = false
    await cargarObras()
  } catch (err) {
    console.error('Error al guardar obra:', err)
    alert(err.response?.data?.mensaje || 'Error al guardar la obra')
  } finally {
    guardando.value = false
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar esta obra del inventario?')) return
  try {
    await obrasAPI.eliminar(id)
    await cargarObras()
  } catch (err) {
    console.error('Error al eliminar:', err)
    alert(err.response?.data?.mensaje || 'Error al eliminar la obra')
  }
}

// ── MODAL VENTA ────────────────────────────────────────
const modalVenta = ref(false)
const obraVenta  = ref(null)
const venta      = ref({ nombre:'', email:'', precio:'' })
const errVenta   = ref({ nombre:false, email:false, precio:false })
const emailRgx   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const vendiendo  = ref(false)

function abrirVenta(obra) {
  obraVenta.value = obra
  venta.value     = { nombre:'', email:'', precio: obra.precio || '' }
  Object.keys(errVenta.value).forEach(k => errVenta.value[k] = false)
  modalVenta.value = true
}

async function confirmarVenta() {
  errVenta.value.nombre = !venta.value.nombre.trim()
  errVenta.value.email  = !emailRgx.test(venta.value.email.trim())
  errVenta.value.precio = !venta.value.precio || venta.value.precio <= 0
  if (Object.values(errVenta.value).some(Boolean)) return

  vendiendo.value = true
  try {
    const data = await certificadosAPI.registrarVenta({
      obraId: obraVenta.value.id,
      compradorNombre: venta.value.nombre.trim(),
      compradorEmail: venta.value.email.trim(),
      precioVenta: Number(venta.value.precio)
    })

    modalVenta.value = false
    alert(`✓ Obra vendida. Certificado generado: ${data.codigoCertificado}`)
    await cargarObras()
  } catch (err) {
    console.error('Error al registrar venta:', err)
    alert(err.response?.data?.mensaje || 'Error al registrar la venta')
  } finally {
    vendiendo.value = false
  }
}

// ── HELPERS ────────────────────────────────────────────
function badgeClass(disp) {
  return { disponible:'badge-enviada', reservada:'badge-revision', vendida:'badge-aceptada' }[disp] || ''
}
function dispLabel(disp) {
  return { disponible:'Disponible', reservada:'Reservada', vendida:'Vendida' }[disp] || disp
}

function exportarCSV() {
  const header = 'Título,Técnica,Dimensiones,Año,Precio,Estado,Serie\n'
  const rows = obras.value.map(o =>
    `"${o.titulo}","${o.tecnica}","${o.dims}",${o.anio},${o.precio},"${dispLabel(o.disp)}","${o.serie}"`
  ).join('\n')
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `inventario_artgest_${new Date().toISOString().slice(0,10)}.csv`
  link.click()
}
</script>