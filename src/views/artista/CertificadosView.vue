<template>
  <div class="layout v-certificados">
    <SidebarArtista ruta-activa="certificados" />

    <div class="main">
      <header class="topbar">
        <div class="topbar__izq">
          <h1>Certificados de autenticidad</h1>
          <p>{{ certs.length }} certificados emitidos · todos verificables con código QR</p>
        </div>
        <div class="topbar__der">
          <button class="btn-sec" @click="modalVer = true">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Verificar código QR
          </button>
          <button class="btn-primary" @click="alert('Para generar, ve a Inventario → selecciona obra → Marcar como vendida.')">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Generar certificado
          </button>
        </div>
      </header>

      <div class="contenido">

        <!-- STATS -->
        <div class="stats-cert">
          <div class="sstat" v-for="s in statsCert" :key="s.label">
            <div class="sstat__icon" :class="s.iconClass">
              <svg viewBox="0 0 24 24" v-html="s.path"></svg>
            </div>
            <div>
              <p class="sstat__val">{{ s.val }}</p>
              <p class="sstat__lbl">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <!-- FILTROS -->
        <div class="filtros-bar">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" v-model="filtros.buscar" placeholder="Buscar por obra o comprador…"/>
          </div>
          <select v-model="filtros.anio" class="filtro-select">
            <option value="">Todos los años</option>
            <option v-for="a in anios" :key="a">{{ a }}</option>
          </select>
          <select v-model="filtros.tecnica" class="filtro-select">
            <option value="">Todas las técnicas</option>
            <option v-for="t in tecnicas" :key="t">{{ t }}</option>
          </select>
          <div class="filtros-bar__sep"></div>
          <span class="filtros-cnt">{{ certsFiltrados.length }} certificado{{ certsFiltrados.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- TABLA -->
        <div class="tabla-wrap">
          <table class="tabla">
            <thead>
              <tr>
                <th>Obra</th>
                <th>Comprador</th>
                <th>Fecha de venta</th>
                <th>Precio</th>
                <th>Código QR</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in certsFiltrados" :key="c.id">
                <td>
                  <div class="obra-cell">
                    <div class="obra-thumb" :style="{ background: c.color }"></div>
                    <div>
                      <p class="obra-cell-titulo">{{ c.obra }}</p>
                      <p class="obra-cell-tec">{{ c.tecnica }} · {{ c.dims }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style="font-weight:500;color:var(--negro);">{{ c.comprador }}</p>
                  <p style="font-size:0.73rem;color:var(--gris);">{{ c.email }}</p>
                </td>
                <td>{{ c.fecha }}</td>
                <td style="font-weight:600;color:var(--terra);">${{ c.precio.toLocaleString('es-CL') }}</td>
                <td>
                  <div class="code-pill" @click="copiarCodigo(c.codigo)" :title="'Copiar ' + c.codigo">
                    <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    {{ c.codigo }}
                  </div>
                </td>
                <td><span class="badge b-ok">Verificado</span></td>
                <td>
                  <div class="tabla-acciones">
                    <button class="accion-btn terra" @click="verCert(c)" title="Ver certificado">
                      <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="accion-btn" @click="descargar(c)" title="Descargar PDF">
                      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <button class="accion-btn" @click="compartir(c)" title="Compartir enlace">
                      <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!certsFiltrados.length">
                <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--gris);font-size:0.9rem;">Sin resultados para los filtros aplicados.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- MODAL VER CERTIFICADO -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalCert" @click.self="modalCert = false">
        <div class="cert-modal">
          <div class="cert-modal__actions">
            <div style="display:flex;gap:0.5rem;">
              <button class="btn-primary" @click="descargar(certActual)">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar PDF
              </button>
              <button class="btn-sec" @click="copiarCodigo(certActual?.codigo)">
                <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copiar código
              </button>
            </div>
            <button class="cert-modal__cerrar" @click="modalCert = false">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- DOCUMENTO CERTIFICADO -->
          <div class="certificado" v-if="certActual">
            <div class="cert-header">
              <div>
                <p class="cert-logo">Art<span>Gest</span></p>
                <p class="cert-logo-sub">Certificado de autenticidad</p>
              </div>
              <div class="cert-qr-area">
                <!-- QR simulado SVG -->
                <svg class="qr-svg" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                  <rect width="72" height="72" fill="white"/>
                  <rect x="4"  y="4"  width="20" height="20" fill="none" stroke="#0A0A0A" stroke-width="2"/>
                  <rect x="8"  y="8"  width="12" height="12" fill="#0A0A0A"/>
                  <rect x="48" y="4"  width="20" height="20" fill="none" stroke="#0A0A0A" stroke-width="2"/>
                  <rect x="52" y="8"  width="12" height="12" fill="#0A0A0A"/>
                  <rect x="4"  y="48" width="20" height="20" fill="none" stroke="#0A0A0A" stroke-width="2"/>
                  <rect x="8"  y="52" width="12" height="12" fill="#0A0A0A"/>
                  <rect x="28" y="4"  width="4" height="4" fill="#0A0A0A"/>
                  <rect x="34" y="4"  width="4" height="4" fill="#0A0A0A"/>
                  <rect x="28" y="10" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="36" y="16" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="28" y="28" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="36" y="34" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="28" y="48" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="40" y="48" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="28" y="54" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="36" y="60" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="58" y="28" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="60" y="34" width="4" height="4" fill="#0A0A0A"/>
                  <rect x="58" y="40" width="4" height="4" fill="#0A0A0A"/>
                </svg>
                <p class="cert-code">{{ certActual.codigo }}</p>
              </div>
            </div>

            <p class="cert-titulo-doc">Certificado de autenticidad de obra artística</p>
            <p class="cert-obra-nombre">{{ certActual.obra }}</p>
            <p class="cert-artista">Por Paulette Alexandra Carrasco Maureira</p>

            <div class="cert-grid">
              <div class="cert-dato"><p>Técnica</p><p>{{ certActual.tecnica }}</p></div>
              <div class="cert-dato"><p>Dimensiones</p><p>{{ certActual.dims }}</p></div>
              <div class="cert-dato"><p>Año de creación</p><p>{{ certActual.anio }}</p></div>
              <div class="cert-dato"><p>Serie</p><p>{{ certActual.serie }}</p></div>
              <div class="cert-dato"><p>Soporte</p><p>{{ certActual.soporte }}</p></div>
              <div class="cert-dato"><p>Número de edición</p><p>Obra única · Original</p></div>
            </div>

            <div class="cert-divider"></div>

            <p class="cert-comprador-titulo">Datos de transferencia de propiedad</p>
            <div class="cert-comprador-grid">
              <div class="cert-dato"><p>Comprador</p><p>{{ certActual.comprador }}</p></div>
              <div class="cert-dato"><p>Fecha de venta</p><p>{{ certActual.fecha }}</p></div>
              <div class="cert-dato"><p>Precio de venta</p><p>${{ certActual.precio.toLocaleString('es-CL') }} CLP</p></div>
              <div class="cert-dato"><p>Lugar de venta</p><p>Santiago, Chile</p></div>
            </div>

            <div class="cert-firma-area">
              <div class="cert-firma"><p>Paulette Carrasco</p><p>Artista visual · RUT 18.204.731-K</p></div>
              <div class="cert-firma"><p>{{ certActual.comprador }}</p><p>Comprador / Propietario</p></div>
            </div>

            <div class="cert-footer">
              <p>Certificado emitido por ArtGest · artgest.cl<br>Verificar en: artgest.cl/verificar/{{ certActual.codigo }}</p>
              <span class="cert-valido">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL VERIFICAR -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="modalVer" @click.self="modalVer = false">
        <div class="modal-ver">
          <div class="modal-ver__head">
            <p class="modal-ver__titulo">Verificar certificado</p>
            <button class="cert-modal__cerrar" @click="modalVer = false">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-ver__body">
            <p class="ver-desc">Ingresa el código del certificado para verificar que la obra es auténtica.</p>
            <div class="ver-input-wrap">
              <input type="text" v-model="codigoVer" placeholder="Ej: ARTG-2026-00847" style="text-transform:uppercase;" @keydown.enter="verificar"/>
              <button class="btn-verificar" @click="verificar">Verificar</button>
            </div>
            <div v-if="verResult" class="ver-result" :class="verResult.type">
              <strong>{{ verResult.titulo }}</strong><br>
              <span v-html="verResult.detalle"></span>
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
import { authAPI, certificadosAPI } from '@/services/api'
import '@/assets/css/certificados.css'

const modalCert = ref(false)
const modalVer  = ref(false)
const certActual = ref(null)
const codigoVer  = ref('')
const verResult  = ref(null)
const verificando = ref(false)

const filtros = ref({ buscar:'', anio:'', tecnica:'' })
const anios   = [2026,2025,2024,2023]
const tecnicas = ['Óleo sobre tela','Acuarela','Grabado en metal','Fotografía análoga','Arte digital','Cerámica','Técnica mixta']

const certs = ref([])
const usuarioNombre = ref('')

onMounted(async () => {
  const usuario = authAPI.getUsuario()
  usuarioNombre.value = usuario?.nombre || 'Artista'

  try {
    const data = await certificadosAPI.listar()
    certs.value = data.ventas.map(v => ({
      id: v._id,
      obra: v.obraId?.titulo || 'Obra',
      tecnica: v.obraId?.tecnica || '—',
      dims: '',
      anio: v.obraId?.anio || '',
      serie: '',
      soporte: '',
      comprador: v.compradorNombre,
      email: v.compradorEmail || '',
      fecha: new Date(v.fechaVenta).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }),
      precio: v.precioVenta,
      codigo: v.codigoCertificado,
      color: v.obraId?.imagenUrl
        ? `url(${v.obraId.imagenUrl}) center/cover`
        : 'linear-gradient(135deg,#888,#444)'
    }))
  } catch (err) {
    console.error('Error cargando certificados:', err)
  }
})

const certsFiltrados = computed(() =>
  certs.value.filter(c => {
    const q = filtros.value.buscar.toLowerCase()
    return (!q || c.obra.toLowerCase().includes(q) || c.comprador.toLowerCase().includes(q)) &&
           (!filtros.value.anio    || c.fecha.includes(filtros.value.anio)) &&
           (!filtros.value.tecnica || c.tecnica === filtros.value.tecnica)
  })
)

const statsCert = computed(() => [
  { val: certs.value.length,  label:'Certificados emitidos', iconClass:'icon-terra', path:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>' },
  { val: certs.value.length,  label:'QR verificables',       iconClass:'icon-verde', path:'<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>' },
  { val: certs.value.length,  label:'Verificaciones totales', iconClass:'icon-azul',  path:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
  { val: '$' + certs.value.reduce((s,c)=>s+c.precio,0).toLocaleString('es-CL'), label:'Total certificado', iconClass:'icon-ambar', path:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },
])

function verCert(c) { certActual.value = c; modalCert.value = true }

function copiarCodigo(codigo) {
  if (!codigo) return
  navigator.clipboard.writeText(codigo)
    .then(() => alert('Código copiado: ' + codigo))
    .catch(() => alert('Código: ' + codigo))
}

function descargar(c) {
  if (!c) return
  alert(`Descarga de certificado PDF de "${c.obra}" — Código: ${c.codigo}`)
}

function compartir(c) {
  const url = `https://artgest.cl/verificar/${c.codigo}`
  navigator.clipboard.writeText(url)
    .then(() => alert('Enlace copiado: ' + url))
    .catch(() => alert('Enlace: ' + url))
}

async function verificar() {
  const cod = codigoVer.value.trim().toUpperCase()
  if (!cod) return

  verificando.value = true
  try {
    const data = await certificadosAPI.verificar(cod)
    if (data.verificado) {
      verResult.value = {
        type: 'ok',
        titulo: '✓ Certificado válido',
        detalle: `<strong>Obra:</strong> ${data.certificado.obra?.titulo || '—'}<br><strong>Artista:</strong> ${data.certificado.artista}<br><strong>Propietario:</strong> ${data.certificado.comprador}<br><strong>Fecha de venta:</strong> ${new Date(data.certificado.fechaVenta).toLocaleDateString('es-CL')}`
      }
    }
  } catch (error) {
    verResult.value = {
      type: 'err',
      titulo: '✗ Código no registrado',
      detalle: error.response?.data?.mensaje || 'Este código no corresponde a ningún certificado en ArtGest.'
    }
  } finally {
    verificando.value = false
  }
}
</script>