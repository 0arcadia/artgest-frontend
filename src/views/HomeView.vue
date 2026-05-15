<template>
  <div class="home v-home">

    <!-- NAVBAR -->
    <nav class="nav" :class="{ clara: navClara }">
      <div class="nav__inner">
        <router-link to="/" class="nav__logo">ArteGest</router-link>
        <ul class="nav__links">
          <li><a href="#artistas" class="nav__link">Explorar artistas</a></li>
          <li><a href="#convocatorias" class="nav__link">Convocatorias</a></li>
          <li><a href="#modulos" class="nav__link">¿Qué es ArteGest?</a></li>
        </ul>
        <div class="nav__der">
          <router-link to="/login" class="nav__ingresa">Iniciar sesión</router-link>
          <router-link to="/login" class="nav__cta">Registrarse</router-link>
        </div>
        <button class="nav__burger" @click="menuAbierto = !menuAbierto" aria-label="Menú">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- MENÚ MÓVIL -->
    <div class="nav__mob" :class="{ open: menuAbierto }">
      <a href="#artistas"     @click="menuAbierto = false">Explorar artistas</a>
      <a href="#convocatorias"@click="menuAbierto = false">Convocatorias</a>
      <a href="#modulos"      @click="menuAbierto = false">¿Qué es ArteGest?</a>
      <router-link to="/login"@click="menuAbierto = false">Iniciar sesión</router-link>
      <router-link to="/login"@click="menuAbierto = false">Registrarse gratis →</router-link>
    </div>

    <main>

      <!-- ══ HERO ══ -->
      <section class="hero">
        <div class="hero__foto" :class="{ loaded: heroLoaded }"></div>
        <div class="hero__vignette"></div>
        <div class="hero__contenido">
          <span class="hero__tag">Plataforma para artistas visuales · Chile · 2026</span>
          <h1 class="hero__titulo">Tu obra<br>merece<br><em>ser vista.</em></h1>
          <div class="hero__linea"></div>
          <p class="hero__bajada">
            Portafolio profesional, inventario de obras, convocatorias y
            certificados de autenticidad. Todo en un solo lugar.
          </p>
          <div class="hero__bots">
            <router-link to="/login" class="btn btn-terra">
              Quiero mi portafolio
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </router-link>
            <router-link to="/login?perfil=galerista" class="btn btn-outline-w">
              Soy galerista o curador
            </router-link>
          </div>
        </div>
        <div class="hero__scroll" @click="scrollTo('numeros')">
          <span class="hero__scroll-txt">Seguir</span>
          <div class="hero__scroll-linea"></div>
        </div>
      </section>

      <!-- ══ NÚMEROS ══ -->
      <div class="s-nums reveal" id="numeros" :class="{ in: vis.numeros }">
        <div class="s-nums__inner">
          <div class="num-item"><p class="num-item__n">$0</p><p class="num-item__label">Versión básica<br>completamente gratuita</p></div>
          <div class="num-item"><p class="num-item__n">5</p><p class="num-item__label">Módulos integrados<br>en una sola plataforma</p></div>
          <div class="num-item"><p class="num-item__n">16</p><p class="num-item__label">Regiones de Chile<br>con alcance nacional</p></div>
        </div>
      </div>

      <!-- ══ FRASE CENTRAL ══ -->
      <section class="s-frase">
        <div class="reveal" :class="{ in: vis.frase }">
          <span class="s-frase__eyebrow">La propuesta</span>
          <h2 class="s-frase__titulo">Todo en un solo lugar.</h2>
          <p class="s-frase__desc">
            Porque administrar una carrera artística no debería consumir el tiempo
            que necesitas para crear. ArteGest reúne todo lo que un artista visual
            emergente necesita para gestionar su obra, su trayectoria y sus oportunidades.
          </p>
          <a href="#modulos" class="btn btn-outline-n" style="display:inline-flex;margin:0 auto;">
            Ver qué incluye
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      <!-- ══ PROBLEMA ══ -->
      <section class="s-problema reveal" id="problema" :class="{ in: vis.problema }">
        <div class="s-problema__inner">
          <div class="s-problema__cabecera">
            <h2 class="s-problema__titulo">¿Eres artista emergente<br>en Chile?</h2>
            <p class="s-problema__intro">
              Entonces conoces las barreras que nada tienen que ver con el talento
              o la calidad de tu obra. ArtGest nació de adentro del circuito para
              responder a necesidades reales.
            </p>
          </div>
          <div class="problema-items">
            <div class="p-item" v-for="p in problemas" :key="p.num">
              <span class="p-item__num">{{ p.num }}</span>
              <div>
                <p class="p-item__titulo">{{ p.titulo }}</p>
                <p class="p-item__texto">{{ p.texto }}</p>
              </div>
            </div>
          </div>
          <p class="s-problema__cierre">ArteGest existe para <span>cambiar eso.</span></p>
        </div>
      </section>

      <!-- ══ MÓDULOS ══ -->
      <section class="s-modulos reveal" id="modulos" :class="{ in: vis.modulos }">
        <div class="s-modulos__inner">
          <div class="s-modulos__cabecera">
            <div>
              <p class="s-modulos__num">02 — La plataforma</p>
              <h2 class="s-modulos__titulo">Una herramienta hecha desde adentro del circuito</h2>
            </div>
            <p class="s-modulos__sub">
              ArteGest nació de la experiencia de Paulette Carrasco — artista visual titulada
              y docente en la Universidad Diego Portales — quien conoce de primera mano las
              barreras del sistema del arte chileno.
            </p>
          </div>
          <div class="modulos-lista">
            <div class="mod" v-for="m in modulos" :key="m.num">
              <div class="mod__icon">{{ m.icon }}</div>
              <p class="mod__num">0{{ m.num }}</p>
              <h3 class="mod__titulo">{{ m.titulo }}</h3>
              <p class="mod__desc">{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CARRUSEL ARTISTAS ══ -->
      <section class="s-obras reveal" id="artistas" :class="{ in: vis.artistas }">
        <div class="s-obras__inner">
          <div class="s-obras__head">
            <h2 class="s-obras__titulo">Artistas que ya<br>confían en ArteGest</h2>
            <div class="s-obras__nav">
              <button class="carr-btn" @click="prevSlide" aria-label="Anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="carr-btn" @click="nextSlide" aria-label="Siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
          <div class="carrusel-wrap" ref="trackWrap">
            <div class="carrusel-track" :style="{ transform: `translateX(-${slideOffset}px)` }">
              <div class="obra-card" v-for="o in obras" :key="o.id">
                <div class="obra-card__bg" :style="{ background: o.color }"></div>
                <div class="obra-card__overlay">
                  <p class="obra-card__artista">{{ o.artista }}</p>
                  <p class="obra-card__titulo">{{ o.titulo }}</p>
                  <p class="obra-card__tecnica">{{ o.tecnica }}</p>
                  <p class="obra-card__precio">{{ o.precio }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="carr-dots">
            <button
              v-for="(_, i) in dotCount" :key="i"
              class="carr-dot" :class="{ active: currentSlide === i }"
              @click="goToSlide(i)"
            ></button>
          </div>
        </div>
      </section>

      <!-- ══ TESTIMONIOS ══ -->
      <section class="s-testimonios reveal" :class="{ in: vis.testimonios }">
        <div class="s-testimonios__inner">
          <div class="s-test__head">
            <span class="s-test__eyebrow">Lo que dicen</span>
            <h2 class="s-test__titulo">Artistas que dejaron Instagram<br>como portafolio</h2>
          </div>
          <div class="testimonios-grid">
            <div class="test-item" v-for="t in testimonios" :key="t.nombre">
              <div class="test-item__comilla">"</div>
              <p class="test-item__texto">{{ t.texto }}</p>
              <div class="test-item__autor">
                <div class="test-item__avatar" :style="{ background: t.color }">{{ t.ini }}</div>
                <div>
                  <p class="test-item__nombre">{{ t.nombre }}</p>
                  <p class="test-item__rol">{{ t.rol }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ PARA QUIÉN ══ -->
      <section class="s-para-quien reveal" id="convocatorias" :class="{ in: vis.paraquien }">
        <div class="s-para-quien__inner">
          <div class="para-quien-grid">
            <div class="pq-card">
              <span class="pq-card__eye">Para artistas emergentes</span>
              <h2 class="pq-card__titulo">Con o sin título.<br>Con o sin contactos.</h2>
              <p class="pq-card__desc">Si creas obra visual en Chile, ArtGest es para ti. La versión básica es gratuita y no requiere ningún conocimiento técnico.</p>
              <ul class="pq-card__lista">
                <li>Portafolio profesional listo en minutos</li>
                <li>Inventario de obras con precios en CLP</li>
                <li>Alerta de nuevas convocatorias</li>
                <li>Certificado de autenticidad con QR</li>
              </ul>
              <router-link to="/login" class="btn btn-terra">
                Crear mi portafolio gratis
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
            <div class="pq-card">
              <span class="pq-card__eye">Para galeristas y curadores</span>
              <h2 class="pq-card__titulo">Talento emergente,<br>bien organizado.</h2>
              <p class="pq-card__desc">Explora cientos de portafolios filtrados por técnica, región, estilo y precio. Publica convocatorias y recibe postulaciones directamente.</p>
              <ul class="pq-card__lista">
                <li>Buscador por técnica, región y precio</li>
                <li>Publicar convocatorias sin costo</li>
                <li>Recibir postulaciones en PDF</li>
                <li>Mensajería directa con artistas</li>
              </ul>
              <router-link to="/login?perfil=galerista" class="btn btn-outline-w">
                Explorar artistas
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ PRECIO ══ -->
      <section class="s-precio reveal" :class="{ in: vis.precio }">
        <div class="s-precio__inner">
          <span class="s-precio__eye">Acceso</span>
          <h2 class="s-precio__pregunta">¿Cuánto cuesta?</h2>
          <p class="s-precio__grande">La versión básica es completamente gratuita.</p>
          <p class="s-precio__desc">
            Porque una plataforma que nació para democratizar el acceso al circuito artístico
            no puede tener una barrera económica en la entrada.
          </p>
          <div class="precio-tabla">
            <div class="precio-col precio-col--dest">
              <p class="precio-col__tag">ArteGest Básico</p>
              <p class="precio-col__nombre">Versión gratuita</p>
              <span class="precio-col__valor">$0</span>
              <p class="precio-col__sub">Portafolio, inventario, convocatorias y certificados incluidos</p>
            </div>
            <div class="precio-col">
              <p class="precio-col__tag">Alternativa actual</p>
              <p class="precio-col__nombre">Sitio web propio</p>
              <span class="precio-col__valor precio-col__valor--gris">$200k – $500k</span>
              <p class="precio-col__sub">Desarrollo + hosting anual, sin inventario ni convocatorias</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CTA FINAL ══ -->
      <section class="s-cta reveal" :class="{ in: vis.cta }">
        <h2 class="s-cta__titulo">
          Tu obra<br><em>tiene nombre.</em><br>Ahora tiene<br>una plataforma.
        </h2>
        <p class="s-cta__sub">
          Únete a la comunidad de artistas visuales emergentes que ya están
          gestionando su carrera con ArteGest.
        </p>
        <div class="s-cta__bots">
          <router-link to="/login" class="btn btn-terra">
            Crear mi cuenta gratis
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
          <router-link to="/portafolio/ejemplo" class="btn btn-outline-w">
            Ver un perfil de ejemplo
          </router-link>
        </div>
      </section>

    </main>

    <!-- ══ FOOTER ══ -->
    <footer class="footer">
      <div class="footer__inner">
        <div>
          <p class="footer__logo">ArtGest</p>
          <p class="footer__desc">Plataforma de gestión y curaduría digital para artistas visuales emergentes en Chile. Proyecto de Título 2026 — IPLACEX.</p>
        </div>
        <div class="footer__col">
          <h4>Plataforma</h4>
          <ul>
            <li><a href="#artistas">Explorar artistas</a></li>
            <li><a href="#convocatorias">Convocatorias</a></li>
            <li><router-link to="/login">Crear cuenta</router-link></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Términos de uso</a></li>
            <li><a href="#">Privacidad (Ley 19.628)</a></li>
            <li><a href="#">Propiedad intelectual</a></li>
          </ul>
        </div>
        <div class="footer__col">
          <h4>Proyecto</h4>
          <ul>
            <li><a href="https://github.com" target="_blank">GitHub</a></li>
            <li><a href="#">Documentación</a></li>
            <li><a href="#">IPLACEX 2026</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copy">© 2026 ArtGest. Todos los derechos reservados.</p>
        <p class="footer__ley">Ley N° 19.287 Propiedad Intelectual · Ley N° 19.628 Protección de Datos Personales</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import '@/assets/css/home.css'

// ── NAV ──────────────────────────────────────────────
const navClara    = ref(false)
const menuAbierto = ref(false)
const heroLoaded  = ref(false)

function onScroll() {
  navClara.value = window.scrollY > window.innerHeight * 0.85
}

// ── REVEAL ON SCROLL ─────────────────────────────────
const vis = ref({
  numeros:false, frase:false, problema:false, modulos:false,
  artistas:false, testimonios:false, paraquien:false, precio:false, cta:false
})

const revealMap = {
  numeros:'numeros', frase:null, problema:'problema',
  modulos:'modulos', artistas:'artistas', testimonios:null,
  paraquien:'convocatorias', precio:null, cta:null
}

function initObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const key = e.target.dataset.visKey
      if (key && e.isIntersecting) vis.value[key] = true
    })
  }, { threshold: 0.07 })
  document.querySelectorAll('[data-vis-key]').forEach(el => io.observe(el))
}

// ── CARRUSEL ─────────────────────────────────────────
const trackWrap    = ref(null)
const currentSlide = ref(0)
const slideOffset  = ref(0)

const obras = ref([
  { id:1, artista:'Camila Reyes Vásquez · Santiago',   titulo:'Latencia III',         tecnica:'Óleo sobre tela · 80×60 cm · 2024',      precio:'$380.000 CLP', color:'url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80) center/cover' },
  { id:2, artista:'Rodrigo Fuentes · Valparaíso',      titulo:'Taller, invierno',     tecnica:'Grabado en metal · 40×30 cm · 2023',     precio:'$220.000 CLP', color:'url(https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80) center/cover' },
  { id:3, artista:'Valentina Montecinos · Concepción', titulo:'Forma materna III',    tecnica:'Cerámica · 35×20 cm · 2024',             precio:'$450.000 CLP', color:'url(https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80) center/cover' },
  { id:4, artista:'Martín Saavedra · Santiago',        titulo:'Erosión digital I',    tecnica:'Arte digital · 50×70 cm · 2025',         precio:'A consultar',  color:'url(https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80) center/cover' },
  { id:5, artista:'Isabel Contreras · Temuco',         titulo:'Raíz',                 tecnica:'Acuarela · 30×40 cm · 2024',             precio:'$95.000 CLP',  color:'url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80) center/cover' },
  { id:6, artista:'Diego Pizarro · Antofagasta',       titulo:'Desierto florido',     tecnica:'Fotografía análoga · 60×90 cm · 2023',   precio:'$180.000 CLP', color:'url(https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80) center/cover' },
])

function getVisibles() {
  return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3
}
const dotCount = computed(() => Math.max(1, obras.value.length - getVisibles() + 1))

function getCardWidth() {
  if (!trackWrap.value) return 0
  const card = trackWrap.value.querySelector('.obra-card')
  if (!card) return 0
  return card.getBoundingClientRect().width + 20
}

function goToSlide(i) {
  const max = dotCount.value - 1
  currentSlide.value = Math.max(0, Math.min(i, max))
  slideOffset.value  = currentSlide.value * getCardWidth()
}
function nextSlide() { goToSlide(currentSlide.value + 1) }
function prevSlide()  { goToSlide(currentSlide.value - 1) }

// swipe táctil
let touchStartX = 0
function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e)   {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide()
}

function onResize() {
  if (currentSlide.value > dotCount.value - 1) currentSlide.value = 0
  goToSlide(currentSlide.value)
}

// ── DATOS ────────────────────────────────────────────
const problemas = [
  { num:'01', titulo:'Visibilidad',      texto:'Tu portafolio vive en Instagram y el algoritmo decide quién lo ve. No hay organización por series ni seriedad ante un galerista.' },
  { num:'02', titulo:'Inventario',       texto:'Llevas tus obras en una planilla Excel o en un cuaderno que ya perdiste. La falta de registro genera pérdidas concretas.' },
  { num:'03', titulo:'Fondos públicos',  texto:'El Fondart abre y te enteras tarde. Nadie te enseñó a postular y dedicar horas a rastrear convocatorias es agotador.' },
  { num:'04', titulo:'Autenticidad',     texto:'Vendiste una obra y entregaste un trozo de papel firmado como certificado. Sin estándar, sin código QR, sin respaldo.' },
]

const modulos = [
  { num:1, icon:'🎨', titulo:'Curaduría visual',             desc:'Organiza tus obras por series, técnicas o temáticas. Tú decides cómo te presentas ante un galerista.' },
  { num:2, icon:'📦', titulo:'Inventario de obras',          desc:'Registro completo con título, técnica, dimensiones, año, precio en pesos chilenos y disponibilidad.' },
  { num:3, icon:'📣', titulo:'Convocatorias',                desc:'Fondart, corporaciones municipales, galerías y fundaciones. Buscador inteligente con alertas de cierre.' },
  { num:4, icon:'📄', titulo:'Certificados de autenticidad', desc:'PDF con código QR único generado automáticamente al marcar una obra como vendida.' },
  { num:5, icon:'💬', titulo:'Mensajería directa',           desc:'Conecta con galeristas y curadores sin intermediarios ni redes sociales de por medio.' },
]

const testimonios = [
  { ini:'CR', color:'#C1440E', nombre:'Camila Reyes Vásquez',  rol:'Artista visual · Santiago',           texto:'Por primera vez tengo mis 80 obras ordenadas, con precios en CLP actualizados y una ficha técnica que puedo enviarle a cualquier galería. En una semana.' },
  { ini:'RF', color:'#2A4A6A', nombre:'Rodrigo Fuentes Araya', rol:'Grabador · Valparaíso',               texto:'Postulé al Fondart 2025 con el portafolio que armé en ArtGest. El jurado comentó que era el expediente más ordenado de la convocatoria.' },
  { ini:'VM', color:'#3A6A2A', nombre:'Valentina Montecinos',  rol:'Curadora independiente · Concepción', texto:'Como curadora, ArtGest me permite filtrar artistas por técnica y región en segundos. Antes pasaba horas buscando en Instagram y olvídalo.' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ── LIFECYCLE ────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', onResize)
  setTimeout(() => { heroLoaded.value = true }, 100)

  await nextTick()
  initObserver()

  // Asignar data-vis-key a cada sección reveal
  const secciones = {
    numeros: document.getElementById('numeros'),
    problema: document.getElementById('problema'),
    modulos: document.getElementById('modulos'),
    artistas: document.getElementById('artistas'),
    convocatorias: document.getElementById('convocatorias'),
  }
  // Para secciones sin id usamos querySelect por clase
  document.querySelectorAll('.s-frase .reveal').forEach(el => el.dataset.visKey = 'frase')
  document.querySelectorAll('.s-testimonios').forEach(el => { el.dataset.visKey = 'testimonios'; el.classList.add('reveal') })
  document.querySelectorAll('.s-precio').forEach(el => { el.dataset.visKey = 'precio'; el.classList.add('reveal') })
  document.querySelectorAll('.s-cta').forEach(el => { el.dataset.visKey = 'cta'; el.classList.add('reveal') })
  if (secciones.numeros)       secciones.numeros.dataset.visKey       = 'numeros'
  if (secciones.problema)      secciones.problema.dataset.visKey      = 'problema'
  if (secciones.modulos)       secciones.modulos.dataset.visKey       = 'modulos'
  if (secciones.artistas)      secciones.artistas.dataset.visKey      = 'artistas'
  if (secciones.convocatorias) secciones.convocatorias.dataset.visKey = 'paraquien'

  initObserver()

  // Touch swipe carrusel
  const track = document.querySelector('.carrusel-track')
  track?.addEventListener('touchstart', onTouchStart, { passive: true })
  track?.addEventListener('touchend',   onTouchEnd)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>