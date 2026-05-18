<template>
  <div class="split v-login">

    <!-- LADO IZQUIERDO -->
    <div class="lado-izq">
      <div class="lado-izq__foto"></div>
      <div class="lado-izq__gradiente"></div>
      <div class="lado-izq__logo-wrap">
        <router-link to="/" class="lado-izq__logo">ArtGest</router-link>
        <router-link to="/" class="lado-izq__volver">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al inicio
        </router-link>
      </div>
      <div class="lado-izq__contenido">
        <span class="lado-izq__tag">Plataforma para artistas visuales · Chile</span>
        <h2 class="lado-izq__titulo">Tu carrera<br>artística,<br><em>en tus manos.</em></h2>
        <div class="lado-izq__linea"></div>
        <p class="lado-izq__frase">Portafolio profesional, inventario de obras, convocatorias y certificados de autenticidad.</p>
        <div class="lado-izq__chips">
          <span class="chip"><span>🎨</span> Portafolio digital</span>
          <span class="chip"><span>📦</span> Inventario de obras</span>
          <span class="chip"><span>📣</span> Convocatorias</span>
          <span class="chip"><span>📄</span> Certificados QR</span>
          <span class="chip"><span>💬</span> Mensajería</span>
        </div>
      </div>
    </div>

    <!-- LADO DERECHO -->
    <div class="lado-der">
      <div class="form-wrap">

        <!-- TABS -->
        <div class="tabs">
          <button class="tab" :class="{ activo: panelActivo === 'registro' }" @click="panelActivo = 'registro'">Crear cuenta</button>
          <button class="tab" :class="{ activo: panelActivo === 'login' }"    @click="panelActivo = 'login'">Iniciar sesión</button>
        </div>

        <!-- PANEL LOGIN -->
        <div v-if="panelActivo === 'login'">
          <h1 class="form-titulo">Bienvenido de vuelta</h1>
          <p class="form-subtitulo">Ingresa a tu espacio en ArtGest</p>
          <form @submit.prevent="submitLogin" novalidate>

            <div class="campo">
              <label for="login-email">Correo electrónico</label>
              <div class="input-wrap">
                <input
                  type="email" id="login-email"
                  v-model="login.email"
                  placeholder="tu.correo@gmail.com"
                  autocomplete="email"
                  :class="{ error: errores.loginEmail }"
                />
              </div>
              <span class="campo__error" v-if="errores.loginEmail">Ingresa un correo válido</span>
            </div>

            <div class="campo">
              <div class="campo__header">
                <label for="login-pass">Contraseña</label>
                <span class="campo__link">¿Olvidaste tu contraseña?</span>
              </div>
              <div class="input-wrap">
                <input
                  :type="mostrarLoginPass ? 'text' : 'password'"
                  id="login-pass"
                  v-model="login.pass"
                  placeholder="Tu contraseña"
                  autocomplete="current-password"
                  :class="{ error: errores.loginPass }"
                />
                <button type="button" class="ojo-btn" @click="mostrarLoginPass = !mostrarLoginPass">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="mostrarLoginPass" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <span class="campo__error" v-if="errores.loginPass">Ingresa tu contraseña</span>
            </div>

            <div class="check-wrap">
              <input type="checkbox" id="recordar" v-model="login.recordar"/>
              <label for="recordar">Mantener sesión iniciada en este dispositivo</label>
            </div>

            <p class="campo__error" v-if="errorServidor" style="text-align:center;margin-bottom:1rem;font-size:0.85rem;">{{ errorServidor }}</p>

            <button type="submit" class="btn-submit" :disabled="cargando">
              {{ cargando ? 'Ingresando…' : 'Ingresar a ArtGest' }}
            </button>

            <p class="form-pie">
              ¿No tienes cuenta aún?
              <a href="#" @click.prevent="panelActivo = 'registro'">Crear cuenta gratis</a>
            </p>
          </form>
        </div>

        <!-- PANEL REGISTRO -->
        <div v-if="panelActivo === 'registro'">
          <h1 class="form-titulo">Crea tu cuenta gratuita</h1>
          <p class="form-subtitulo">Únete a la comunidad de artistas y galeristas de Chile</p>
          <form @submit.prevent="submitRegistro" novalidate>

            <div class="campo">
              <label for="reg-nombre">Nombre completo</label>
              <div class="input-wrap">
                <input type="text" id="reg-nombre" v-model="reg.nombre"
                  placeholder="Ej: Valentina Morales Sepúlveda" autocomplete="name"
                  :class="{ error: errores.nombre }"/>
              </div>
              <span class="campo__error" v-if="errores.nombre">Ingresa tu nombre completo</span>
            </div>

            <div class="campo">
              <label for="reg-email">Correo electrónico</label>
              <div class="input-wrap">
                <input type="email" id="reg-email" v-model="reg.email"
                  placeholder="Ej: valentina@gmail.com" autocomplete="email"
                  :class="{ error: errores.email }"/>
              </div>
              <span class="campo__error" v-if="errores.email">Ingresa un correo válido</span>
            </div>

            <div class="campo">
              <label for="reg-pass">Contraseña</label>
              <div class="input-wrap">
                <input :type="mostrarRegPass ? 'text' : 'password'" id="reg-pass"
                  v-model="reg.pass" placeholder="Mínimo 8 caracteres" autocomplete="new-password"
                  :class="{ error: errores.pass }"/>
                <button type="button" class="ojo-btn" @click="mostrarRegPass = !mostrarRegPass">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <span class="campo__error" v-if="errores.pass">Mínimo 8 caracteres</span>
            </div>

            <div class="campo">
              <label for="reg-pass2">Repite tu contraseña</label>
              <div class="input-wrap">
                <input :type="mostrarRegPass2 ? 'text' : 'password'" id="reg-pass2"
                  v-model="reg.pass2" placeholder="Repite la contraseña" autocomplete="new-password"
                  :class="{ error: errores.pass2 }"/>
                <button type="button" class="ojo-btn" @click="mostrarRegPass2 = !mostrarRegPass2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <span class="campo__error" v-if="errores.pass2">Las contraseñas no coinciden</span>
            </div>

            <!-- SELECTOR PERFIL -->
            <p class="perfil-titulo">¿Cómo quieres usar ArtGest?</p>
            <div class="perfil-grid">
              <div class="perfil-card" :class="{ seleccionado: reg.perfil === 'artista' }" @click="reg.perfil = 'artista'">
                <span class="perfil-card__emoji">🎨</span>
                <p class="perfil-card__titulo">Soy artista</p>
                <p class="perfil-card__desc">Subo obras, gestiono mi portafolio y postulo a convocatorias</p>
              </div>
              <div class="perfil-card" :class="{ seleccionado: reg.perfil === 'galerista' }" @click="reg.perfil = 'galerista'">
                <span class="perfil-card__emoji">🏛️</span>
                <p class="perfil-card__titulo">Soy galerista o curador</p>
                <p class="perfil-card__desc">Exploro portafolios, publico convocatorias y contacto artistas</p>
              </div>
            </div>

            <div class="check-wrap" style="margin-bottom:1.75rem;">
              <input type="checkbox" id="acepto" v-model="reg.terminos"/>
              <label for="acepto" class="legal-texto">
                Acepto los <a href="#">Términos de uso</a> y la <a href="#">Política de Privacidad</a>.
                Mis datos serán tratados según la Ley N° 19.628.
              </label>
            </div>
            <span class="campo__error" v-if="errores.terminos" style="display:block;margin-bottom:1rem;">Debes aceptar los términos y condiciones</span>

            <p class="campo__error" v-if="errorServidor" style="text-align:center;margin-bottom:1rem;font-size:0.85rem;">{{ errorServidor }}</p>

            <button type="submit" class="btn-submit" :disabled="cargando">
              {{ cargando ? 'Creando cuenta…' : 'Crear mi cuenta gratis' }}
            </button>

            <p class="form-pie">
              ¿Ya tienes cuenta?
              <a href="#" @click.prevent="panelActivo = 'login'">Iniciar sesión</a>
            </p>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '@/services/api'
import '@/assets/css/login.css'

const router = useRouter()
const route  = useRoute()

// Panel activo: login | registro
const panelActivo = ref('login')
const errorServidor = ref('')

// Si viene con ?perfil=galerista desde el landing
onMounted(() => {
  if (route.query.perfil === 'galerista') {
    panelActivo.value = 'registro'
    reg.value.perfil  = 'galerista'
  }

  // Si ya está autenticado, redirigir al dashboard
  if (authAPI.estaAutenticado()) {
    const perfil = authAPI.getPerfil()
    router.replace(perfil === 'galerista' ? '/galerista/dashboard' : '/artista/dashboard')
  }
})

// ── ESTADO ──────────────────────────────────────────
const cargando       = ref(false)
const mostrarLoginPass = ref(false)
const mostrarRegPass   = ref(false)
const mostrarRegPass2  = ref(false)

const login = ref({ email: '', pass: '', recordar: false })

const reg = ref({
  nombre: '', email: '', pass: '', pass2: '',
  perfil: 'artista', terminos: false
})

const errores = ref({
  loginEmail: false, loginPass: false,
  nombre: false, email: false, pass: false, pass2: false, terminos: false
})

// ── VALIDACIONES ─────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Redirigir según perfil del usuario
function redirigirPorPerfil(tipoUsuario) {
  if (tipoUsuario === 'galerista') {
    router.push('/galerista/dashboard')
  } else {
    router.push('/artista/dashboard')
  }
}

async function submitLogin() {
  errorServidor.value = ''
  errores.value.loginEmail = !emailRegex.test(login.value.email.trim())
  errores.value.loginPass  = !login.value.pass

  if (errores.value.loginEmail || errores.value.loginPass) return

  cargando.value = true
  try {
    // ← Ahora pasa login.recordar para decidir localStorage vs sessionStorage
    const data = await authAPI.login(login.value.email.trim(), login.value.pass, login.value.recordar)
    redirigirPorPerfil(data.usuario.tipoUsuario)
  } catch (error) {
    errorServidor.value = error.response?.data?.mensaje || 'Error al iniciar sesión. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}

async function submitRegistro() {
  errorServidor.value = ''
  const e = errores.value
  e.nombre   = reg.value.nombre.trim().length < 2
  e.email    = !emailRegex.test(reg.value.email.trim())
  e.pass     = reg.value.pass.length < 8
  e.pass2    = reg.value.pass !== reg.value.pass2
  e.terminos = !reg.value.terminos

  if (e.nombre || e.email || e.pass || e.pass2 || e.terminos) return

  cargando.value = true
  try {
    const data = await authAPI.registro(
      reg.value.nombre.trim(),
      reg.value.email.trim(),
      reg.value.pass,
      reg.value.perfil
    )
    redirigirPorPerfil(data.usuario.tipoUsuario)
  } catch (error) {
    errorServidor.value = error.response?.data?.mensaje || 'Error al crear la cuenta. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>