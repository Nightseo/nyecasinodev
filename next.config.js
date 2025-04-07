/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Deshabilitar la validación de tipos durante la construcción
  typescript: {
    ignoreBuildErrors: true,
  },
  // Deshabilitar el linting durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración para la exportación estática
  distDir: 'out',
  // Deshabilitar la generación de imágenes estáticas
  images: {
    unoptimized: true,
  },
  // Configuración para el manejo de rutas
  trailingSlash: true,
}

module.exports = nextConfig 