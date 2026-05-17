<template>
  <div class="v-verificar">
    <div class="verificar-container">

      <div class="verificar-logo">
        <router-link to="/">ArtGest</router-link>
      </div>

      <!-- CARGANDO -->
      <div class="verificar-card" v-if="cargando">
        <div class="verificar-loading">
          <div class="spinner-ver"></div>
          <p>Verificando certificado…</p>
        </div>
      </div>

      <!-- CERTIFICADO VÁLIDO -->
      <div class="verificar-card" v-else-if="verificado">
        <div class="verificar-status ok">
          <div class="status-icon ok">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
          </div>
          <h1>Certificado válido</h1>
          <p>Este certificado ha sido verificado y es auténtico.</p>
        </div>

        <div class="verificar-codigo">{{ codigo }}</div>

        <div class="verificar-seccion">
          <h3>Datos de la obra</h3>
          <div class="verificar-grid">
            <div><p class="vl">Título</p><p class="vv">{{ certificado.obra?.titulo || '—' }}</p></div>
            <div><p class="vl">Técnica</p><p class="vv">{{ certificado.obra?.tecnica || '—' }}</p></div>
            <div><p class="vl">Dimensiones</p><p class="vv">{{ certificado.obra?.dimensiones || '—' }}</p></div>
            <div><p class="vl">Año</p><p class="vv">{{ certificado.obra?.anio || '—' }}</p></div>
          </div>
        </div>

        <div class="verificar-seccion">
          <h3>Datos de la transacción</h3>
          <div class="verificar-grid">
            <div><p class="vl">Artista</p><p class="vv">{{ certificado.artista || '—' }}</p></div>
            <div><p class="vl">Adquirida por</p><p class="vv">{{ certificado.comprador || '—' }}</p></div>
            <div><p class="vl">Fecha de venta</p><p class="vv">{{ fechaVenta }}</p></div>
            <div><p class="vl">Precio</p><p class="vv">{{ precioFmt }}</p></div>
          </div>
        </div>

        <div class="verificar-footer-txt">
          <p>Este certificado fue emitido a través de ArtGest y acredita la autenticidad y procedencia de la obra descrita.</p>
        </div>
      </div>

      <!-- CERTIFICADO NO ENCONTRADO -->
      <div class="verificar-card" v-else>
        <div class="verificar-status err">
          <div class="status-icon err">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h1>Certificado no encontrado</h1>
          <p>El código <strong>{{ codigo }}</strong> no corresponde a ningún certificado registrado en ArtGest.</p>
        </div>

        <div class="verificar-manual">
          <p>¿Tienes otro código? Ingresalo aquí:</p>
          <div class="verificar-input-wrap">
            <input type="text" v-model="codigoManual" placeholder="Ej: ARTG-2026-00847" @keydown.enter="verificarManual" />
            <button @click="verificarManual">Verificar</button>
          </div>
        </div>
      </div>

      <div class="verificar-bottom">
        <router-link to="/">← Volver a ArtGest</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { certificadosAPI } from '@/services/api'
import '@/assets/css/verificar-certificado.css'

const route = useRoute()
const router = useRouter()

const codigo = ref(route.params.codigo || '')
const cargando = ref(true)
const verificado = ref(false)
const certificado = ref({})
const codigoManual = ref('')

const fechaVenta = computed(() => {
  if (!certificado.value.fechaVenta) return '—'
  return new Date(certificado.value.fechaVenta).toLocaleDateString('es-CL', { day:'numeric', month:'long', year:'numeric' })
})

const precioFmt = computed(() => {
  if (!certificado.value.precioVenta) return '—'
  return '$' + certificado.value.precioVenta.toLocaleString('es-CL') + ' ' + (certificado.value.moneda || 'CLP')
})

onMounted(async () => {
  if (codigo.value) {
    await verificar(codigo.value)
  } else {
    cargando.value = false
  }
})

async function verificar(cod) {
  cargando.value = true
  try {
    const data = await certificadosAPI.verificar(cod)
    if (data.verificado) {
      verificado.value = true
      certificado.value = data.certificado
    } else {
      verificado.value = false
    }
  } catch (err) {
    verificado.value = false
  } finally {
    cargando.value = false
  }
}

function verificarManual() {
  const cod = codigoManual.value.trim()
  if (!cod) return
  codigo.value = cod
  router.replace(`/verificar/${cod}`)
  verificar(cod)
}
</script>