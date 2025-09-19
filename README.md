# 🏛️ Ágora - Plataforma de Noticias Personalizadas

**Ágora** es una plataforma web que recolecta diariamente noticias de fuentes públicas colombianas, las clasifica automáticamente según su orientación política utilizando inteligencia artificial, y las distribuye a los usuarios de acuerdo con sus preferencias ideológicas.

Inspirado en la **plaza pública de la antigua Grecia**, Ágora busca ser un espacio digital donde cada persona pueda acceder a información diversa y formar su propia opinión con contenido relevante sobre Colombia.

## 🌟 Características Principales

### 🔄 Automatización Completa
- **Scraping inteligente**: Recolección automática de noticias de fuentes colombianas
- **Clasificación por IA**: Análisis automático de orientación política usando Google Gemini
- **Envío programado**: Distribución automática de boletines personalizados
- **Programación horaria**: Tareas ejecutadas con `node-cron`

### 👥 Gestión de Usuarios
- **Registro simplificado**: Solo email válido requerido
- **Orientaciones políticas**: Izquierda, Centro, Derecha, Centro-izquierda, Centro-derecha
- **Personalización automática**: Noticias filtradas según preferencias del usuario

### 📧 Sistema de Notificaciones
- **Boletines personalizados**: Envío automático vía **Resend**
- **Contenido relevante**: Noticias adaptadas a la orientación política del usuario
- **Frecuencia configurable**: Programación flexible de envíos

### 🎨 Interfaz Moderna
- **React 19 + TypeScript**: Frontend moderno y tipado
- **Tailwind CSS**: Diseño responsive y atractivo
- **Animaciones**: Transiciones suaves con Framer Motion
- **Componentes UI**: Interfaz consistente con Radix UI

## 🛠️ Stack Tecnológico

### Backend
- **[Hono.js](https://hono.dev/)**: Framework ultraligero para APIs
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)**: Base de datos relacional
- **[Puppeteer](https://pptr.dev/)**: Web scraping y automatización
- **[Google Gemini](https://ai.google.dev/)**: IA para clasificación de noticias
- **[Resend](https://resend.com/)**: Servicio de envío de emails
- **[node-cron](https://www.npmjs.com/package/node-cron)**: Programación de tareas

### Frontend
- **[React 19](https://react.dev/)**: Biblioteca de UI moderna
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático
- **[Vite](https://vitejs.dev/)**: Build tool y dev server
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utility-first
- **[TanStack Query](https://tanstack.com/query)**: Gestión de estado del servidor
- **[React Hook Form](https://react-hook-form.com/)**: Manejo de formularios
- **[Framer Motion](https://www.framer.com/motion/)**: Animaciones

### DevOps
- **[Docker](https://www.docker.com/)**: Contenedorización
- **[Docker Compose](https://docs.docker.com/compose/)**: Orquestación de servicios
- **[Nginx](https://www.nginx.com/)**: Servidor web para frontend

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **pnpm** (recomendado) o npm
- **Docker** y **Docker Compose**
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jul-cesar/Agora.git
cd Agora
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL
POSTGRES_DB=agora_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://user:password@db:5432/agora_db

# APIs externas
GOOGLE_API_KEY=tu_google_gemini_api_key
RESEND_API_KEY=tu_resend_api_key

# Configuración de envío
SEND_HOUR=8
TZ=America/Bogota

# URLs (para desarrollo local)
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost
```

### 3. Ejecutar con Docker (Recomendado)
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# O en modo detach (background)
docker-compose up -d --build
```

### 4. Desarrollo Local (Alternativo)

#### Backend
```bash
cd agora-backend
pnpm install
pnpm run db:push  # Configurar base de datos
pnpm run dev      # Servidor en http://localhost:3000
```

#### Frontend
```bash
cd agora-front
pnpm install
pnpm run dev      # Servidor en http://localhost:5173
```

## 📡 API Endpoints

### Usuarios
- `POST /api/agora/users` - Registro de nuevo usuario
- `GET /api/agora/users` - Obtener usuarios (admin)

### Noticias
- `GET /api/agora/news` - Obtener últimas noticias clasificadas
- `POST /api/agora/news` - Crear nueva noticia (interno)

### Sistema
- `GET /api/agora/` - Health check de la API

## 🗄️ Estructura de la Base de Datos

### Tabla `users`
```sql
- id: string (CUID2)
- name: string
- lastName: string  
- nickname: string
- email: string (único)
- politicOrientation: enum (Izquierda|Centro|Derecha|Centroizquierda|Centroderecha)
```

### Tabla `news`
```sql
- id: string (CUID2)
- title: string
- body: text
- url: string
- imageUrl: string
- publishedAt: string
- sourceName: string
- category: string
- PoliticOrientation: string
- createdAt: timestamp
```

## 🔄 Flujo de Trabajo Automatizado

1. **Scraping Diario**: El sistema recolecta noticias de fuentes configuradas
2. **Procesamiento IA**: Google Gemini analiza y clasifica cada noticia
3. **Almacenamiento**: Las noticias se guardan en PostgreSQL
4. **Filtrado Personalizado**: Se seleccionan noticias según orientación del usuario
5. **Envío Automático**: Resend envía boletines personalizados a cada usuario

## 🎯 Orientaciones Políticas Soportadas

- **Izquierda**: Contenido progresista y de izquierda
- **Centro-izquierda**: Posiciones moderadas con tendencia progresista  
- **Centro**: Contenido balanceado y moderado
- **Centro-derecha**: Posiciones moderadas con tendencia conservadora
- **Derecha**: Contenido conservador y de derecha

## 🌐 Despliegue en Producción

### Con Docker Compose
```bash
# Producción
docker-compose -f docker-compose.prod.yml up -d

# Revisar logs
docker-compose logs -f
```

### Variables de Entorno Producción
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@tu-db-host:5432/agora_db
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

- [ ] Sistema de preferencias avanzadas por temas
- [ ] API pública para desarrolladores
- [ ] Aplicación móvil (React Native)
- [ ] Dashboard de administración
- [ ] Métricas y analytics
- [ ] Soporte para más países de LATAM
- [ ] Sistema de notificaciones push
- [ ] Chat/comentarios comunitarios

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [@jul-cesar](https://github.com/jul-cesar)

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/jul-cesar/Agora/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/jul-cesar/Agora/wiki)

---

**¿Te gusta el proyecto?** ⭐ ¡Dale una estrella en GitHub!

---

> *"En Ágora, cada perspectiva tiene su lugar en la plaza pública digital"*