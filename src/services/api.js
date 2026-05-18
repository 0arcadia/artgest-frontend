// =============================================
// services/api.js — Conexión con el backend
// ArteGest · Proyecto de Título 2026
// =============================================

import axios from 'axios'

// ── HELPERS DE STORAGE ──────────────────────────────
// Si el usuario marcó "recordar", se usa localStorage (persiste).
// Si no, se usa sessionStorage (se borra al cerrar el navegador).
function getStorage() {
  // Si existe en localStorage, usar localStorage
  if (localStorage.getItem('token')) return localStorage
  // Si existe en sessionStorage, usar sessionStorage
  if (sessionStorage.getItem('token')) return sessionStorage
  // Default: localStorage
  return localStorage
}

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function getUsuarioStr() {
  return localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
}

function getPerfil() {
  return localStorage.getItem('perfil') || sessionStorage.getItem('perfil') || ''
}

function guardarSesion(data, recordar = true) {
  // Limpiar ambos storages primero
  limpiarSesion()
  const storage = recordar ? localStorage : sessionStorage
  storage.setItem('token', data.token)
  storage.setItem('usuario', JSON.stringify(data.usuario))
  storage.setItem('perfil', data.usuario.tipoUsuario)
}

function limpiarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  localStorage.removeItem('perfil')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('usuario')
  sessionStorage.removeItem('perfil')
}

// Instancia base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// ── INTERCEPTOR: agrega el token JWT a cada petición ──
api.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── INTERCEPTOR: si el token expiró, redirige al login ──
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      limpiarSesion()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ══════════════════════════════════════════
// AUTH — LoginView.vue
// ══════════════════════════════════════════

export const authAPI = {
  // Login (recibe recordar para decidir storage)
  async login(email, contrasena, recordar = true) {
    const { data } = await api.post('/auth/login', { email, contrasena })
    guardarSesion(data, recordar)
    return data
  },

  // Registro (siempre persiste como localStorage)
  async registro(nombre, email, contrasena, tipoUsuario) {
    const { data } = await api.post('/auth/registro', { nombre, email, contrasena, tipoUsuario })
    guardarSesion(data, true)
    return data
  },

  // Obtener perfil del usuario autenticado
  async me() {
    const { data } = await api.get('/auth/me')
    return data.usuario
  },

  // Cerrar sesión
  logout() {
    limpiarSesion()
    window.location.href = '/login'
  },

  // Helpers
  estaAutenticado() {
    return !!getToken()
  },

  getUsuario() {
    const u = getUsuarioStr()
    return u ? JSON.parse(u) : null
  },

  getPerfil() {
    return getPerfil()
  }
}

// ══════════════════════════════════════════
// OBRAS — InventarioView.vue
// ══════════════════════════════════════════

export const obrasAPI = {
  // Listar obras del artista (con filtros opcionales)
  async listar(filtros = {}) {
    const params = {}
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.busqueda) params.busqueda = filtros.busqueda
    if (filtros.orden) params.orden = filtros.orden
    const { data } = await api.get('/obras', { params })
    return data
  },

  // Detalle de una obra
  async detalle(id) {
    const { data } = await api.get(`/obras/${id}`)
    return data.obra
  },

  // Crear obra (con imagen)
  async crear(datosObra, archivoImagen) {
    const formData = new FormData()
    Object.keys(datosObra).forEach(key => {
      if (datosObra[key] !== undefined && datosObra[key] !== '') {
        formData.append(key, datosObra[key])
      }
    })
    if (archivoImagen) formData.append('imagen', archivoImagen)

    const { data } = await api.post('/obras', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // Actualizar obra
  async actualizar(id, datosObra, archivoImagen) {
    const formData = new FormData()
    Object.keys(datosObra).forEach(key => {
      if (datosObra[key] !== undefined) {
        formData.append(key, datosObra[key])
      }
    })
    if (archivoImagen) formData.append('imagen', archivoImagen)

    const { data } = await api.put(`/obras/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // Eliminar obra
  async eliminar(id) {
    const { data } = await api.delete(`/obras/${id}`)
    return data
  },

  // Portafolio público de un artista
  async portafolioPublico(artistaId) {
    const { data } = await api.get(`/obras/portafolio/${artistaId}`)
    return data.obras
  }
}

// ══════════════════════════════════════════
// CONVOCATORIAS — ConvocatoriasView.vue
// ══════════════════════════════════════════

export const convocatoriasAPI = {
  // Listar convocatorias
  async listar(filtros = {}) {
    const params = {}
    if (filtros.tipo) params.tipo = filtros.tipo
    if (filtros.region) params.region = filtros.region
    if (filtros.busqueda) params.busqueda = filtros.busqueda
    if (filtros.orden) params.orden = filtros.orden
    const { data } = await api.get('/convocatorias', { params })
    return data.convocatorias
  },

  // Detalle de una convocatoria
  async detalle(id) {
    const { data } = await api.get(`/convocatorias/${id}`)
    return data.convocatoria
  },

  // Crear convocatoria (galerista)
  async crear(datosConv) {
    const { data } = await api.post('/convocatorias', datosConv)
    return data
  },

  // Actualizar convocatoria
  async actualizar(id, datosConv) {
    const { data } = await api.put(`/convocatorias/${id}`, datosConv)
    return data
  }
}

// ══════════════════════════════════════════
// POSTULACIONES — PostulacionView.vue
// ══════════════════════════════════════════

export const postulacionesAPI = {
  // Listar postulaciones
  async listar(filtros = {}) {
    const params = {}
    if (filtros.estado) params.estado = filtros.estado
    const { data } = await api.get('/postulaciones', { params })
    return data.postulaciones
  },

  // Postular a convocatoria (con PDF opcional)
  async postular(datosPost, archivoPdf) {
    const formData = new FormData()
    formData.append('convocatoriaId', datosPost.convocatoriaId)
    if (datosPost.declaracionArtista) formData.append('declaracionArtista', datosPost.declaracionArtista)
    if (datosPost.linkPortafolio) formData.append('linkPortafolio', datosPost.linkPortafolio)
    if (datosPost.obrasAdjuntas) {
      datosPost.obrasAdjuntas.forEach(id => formData.append('obrasAdjuntas', id))
    }
    if (archivoPdf) formData.append('archivoPdf', archivoPdf)

    const { data } = await api.post('/postulaciones', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  // Cambiar estado de postulación (galerista)
  async cambiarEstado(id, estado) {
    const { data } = await api.put(`/postulaciones/${id}/estado`, { estado })
    return data
  }
}

// ══════════════════════════════════════════
// MENSAJES — MensajeriaView.vue
// ══════════════════════════════════════════

export const mensajesAPI = {
  // Listar conversaciones
  async conversaciones() {
    const { data } = await api.get('/mensajes/conversaciones')
    return data.conversaciones
  },

  // Obtener mensajes de una conversación
  async obtenerMensajes(receptorId) {
    const { data } = await api.get(`/mensajes/${receptorId}`)
    return data
  },

  // Enviar mensaje
  async enviar(receptorId, contenido) {
    const { data } = await api.post('/mensajes', { receptorId, contenido })
    return data.mensaje
  }
}

// ══════════════════════════════════════════
// CERTIFICADOS — CertificadosView.vue
// ══════════════════════════════════════════

export const certificadosAPI = {
  // Listar certificados del artista
  async listar() {
    const { data } = await api.get('/certificados')
    return data
  },

  // Registrar venta y generar certificado
  async registrarVenta(datosVenta) {
    const { data } = await api.post('/certificados', datosVenta)
    return data
  },

  // Verificar certificado por código (público)
  async verificar(codigo) {
    const { data } = await api.get(`/certificados/verificar/${codigo}`)
    return data
  }
}

// ══════════════════════════════════════════
// USUARIOS — PerfilView.vue + PortafolioPublicoView.vue
// ══════════════════════════════════════════

export const usuariosAPI = {
  // Actualizar perfil (con foto opcional)
  async actualizarPerfil(datosPerfil, archivoFoto) {
    const formData = new FormData()
    Object.keys(datosPerfil).forEach(key => {
      const val = datosPerfil[key]
      if (val !== undefined) {
        if (Array.isArray(val)) {
          val.forEach(item => formData.append(key, item))
        } else {
          formData.append(key, val)
        }
      }
    })
    if (archivoFoto) formData.append('foto', archivoFoto)

    const { data } = await api.put('/usuarios/perfil', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Actualizar storage con datos nuevos
    const storage = getStorage()
    storage.setItem('usuario', JSON.stringify(data.usuario))
    return data
  },

  // Actualizar imagen de fondo del perfil
  async actualizarBanner(archivoBanner) {
    const formData = new FormData()
    formData.append('banner', archivoBanner)
    const { data } = await api.put('/usuarios/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Actualizar storage
    const storage = getStorage()
    const u = JSON.parse(storage.getItem('usuario') || '{}')
    u.bannerUrl = data.bannerUrl
    storage.setItem('usuario', JSON.stringify(u))
    return data
  },

  // Perfil público de un artista
  async perfilPublico(id) {
    const { data } = await api.get(`/usuarios/perfil-publico/${id}`)
    return data
  },

  // Toggle favorito (galerista)
  async toggleFavorito(artistaId) {
    const { data } = await api.post(`/usuarios/favorito/${artistaId}`)
    return data
  },

  // Listar favoritos del galerista
  async listarFavoritos() {
    const { data } = await api.get('/usuarios/favoritos')
    return data.favoritos
  },

  // Listar todos los artistas (para Explorar artistas - galerista)
  async listarArtistas() {
    const { data } = await api.get('/usuarios/artistas')
    return data.artistas
  }
}

// Export por defecto para uso general
export default api