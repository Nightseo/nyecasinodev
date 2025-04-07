# NYE Casino

Sitio web de reseñas de casinos desarrollado con Next.js y desplegado en Cloudflare Pages.

## Características

- Reseñas detalladas de casinos
- Opiniones de expertos
- Galería de medios
- Panel de administración
- Optimizado para SEO

## Tecnologías utilizadas

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Cloudflare Pages para el despliegue

## Desarrollo local

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env.local` con la siguiente variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
4. Inicia el servidor de desarrollo: `npm run dev`
5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Construcción para producción

```bash
npm run build
```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Cloudflare Pages cuando se suben cambios a la rama principal del repositorio.

## Estructura del proyecto

- `/app`: Páginas y rutas de la aplicación
- `/components`: Componentes reutilizables
- `/lib`: Utilidades y funciones auxiliares
- `/public`: Archivos estáticos 