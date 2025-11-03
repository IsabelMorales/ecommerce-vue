# 🛒 Alternova E-commerce

Aplicación de e-commerce desarrollada con Vue.js 3, Vuetify, Tailwindcss y TypeScript. Ofrece un catálogo de productos con funcionalidades de búsqueda, filtrado, carrito de compras y diseño responsive.

## ✨ Características

- **Catálogo de productos** con paginación y carga asíncrona
- **Búsqueda en tiempo real** con debounce para optimizar peticiones
- **Filtrado por categorías** con soporte para múltiples selecciones
- **Carrito de compras** con persistencia en localStorage
- **Modal de agregar al carrito** con validación de cantidad y stock
- **Diseño responsive** optimizado para móviles, tablets y desktop
- **Indicadores de stock** (Sin Stock, Pocas unidades)
- **Manejo de errores** con mensajes informativos y opción de reintentar
- **Estados de carga** con skeleton loaders

## 🛠️ Tecnologías Utilizadas

### Frontend

- **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript progresivo
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vuetify 3](https://vuetifyjs.com/)** - Framework de componentes Material Design
- **[TailwindCSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Pinia](https://pinia.vuejs.org/)** - State management
- **[Vite](https://vitejs.dev/)** - Build tool y dev server

### APIs

- **[DummyJSON](https://dummyjson.com/)** - API REST para productos de prueba

### Herramientas de Desarrollo

- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formateador de código
- **Vue DevTools** - Herramientas de desarrollo para Vue

## 📋 Requisitos Previos

- **Node.js**: `^20.19.0` o `>=22.12.0`
- **npm** o **yarn** o **pnpm**

## 🚀 Instalación

1. **Clonar el repositorio** (si aplica):

   ```bash
   git clone <repository-url>
   cd ecommerce-vue
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo con hot-reload en `http://localhost:5173`

### Producción

```bash
npm run build
```

Compila la aplicación para producción y genera los archivos en la carpeta `dist/`

```bash
npm run preview
```

Vista previa de la compilación de producción

### Calidad de Código

```bash
npm run lint
```

Ejecuta ESLint para detectar y corregir problemas de código

```bash
npm run format
```

Formatea el código con Prettier

```bash
npm run type-check
```

Verifica los tipos de TypeScript

## 🎯 Funcionalidades Principales

### Catálogo de Productos

- Visualización de productos en grid responsive
- Paginación con 12 productos por página
- Estados de carga con skeleton loaders
- Indicadores visuales de stock disponible

### Búsqueda y Filtrado

- **Búsqueda por nombre**: Búsqueda en tiempo real con debounce de 500ms
- **Filtrado por categorías**: Selección múltiple de categorías
- **Contador de resultados**: Muestra la cantidad de productos filtrados
- **Limpieza de filtros**: Botón para resetear todos los filtros

### Carrito de Compras

- Agregar productos con cantidad personalizada
- Modificar cantidad desde el carrito
- Eliminar productos individuales
- Vaciar carrito completamente
- Persistencia en localStorage (los items se mantienen después de refrescar)
- Cálculo automático de totales

### Validaciones

- Validación de cantidad mínima (1) y máxima (stock disponible)
- Prevención de números negativos
- Alertas informativas para errores de validación

### Manejo de Errores

- Manejo completo de errores de red y API
- Mensajes de error claros y descriptivos
- Botón de reintento para operaciones fallidas
- Fallback automático para carga de categorías

### Ajustes Responsive Principales

- App bar con título truncado en pantallas pequeñas
- Grid de productos: 2 columnas (móvil) → 4 columnas (tablet) → 5 columnas (desktop)
- Drawer del carrito: 100% ancho en móvil, 400px en desktop
- Modal de agregar al carrito: fullscreen en móvil, modal centrado en desktop
- Textos y espaciados adaptativos según el tamaño de pantalla

## ⚙️ Configuración

### Variables de Entorno

Actualmente no se requieren variables de entorno. La API de DummyJSON es pública.

### Alias de Rutas

El proyecto usa alias `@` para referenciar la carpeta `src/`:

```typescript
import Component from '@/components/Component.vue'
```

## 🔧 Configuración del IDE

### VS Code (Recomendado)

- Extensión: **[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)**
- **Importante**: Desinstalar cualquier extensión "Vetur" o "Volar" de johnsoncodehk para evitar conflictos

### Configuración Recomendada

El proyecto incluye `.vscode/settings.json` con configuraciones optimizadas:

- TypeScript del workspace
- Formateo automático con Prettier
- Configuración de Volar sin TakeOver Mode

## 📱 Uso

1. **Ver catálogo**: Los productos se cargan automáticamente al iniciar
2. **Buscar productos**: Usa la barra de búsqueda para filtrar por nombre
3. **Filtrar por categoría**: Selecciona una o más categorías del dropdown
4. **Agregar al carrito**: Haz clic en "Añadir al carrito" en cualquier producto
5. **Ver carrito**: Haz clic en el icono del carrito en la barra superior
6. **Modificar cantidad**: Usa los botones +/- en el carrito o en el modal
7. **Eliminar productos**: Haz clic en el icono de eliminar en cada item del carrito

## 🐛 Solución de Problemas

### Los productos no se cargan

- Verifica tu conexión a internet
- La API de DummyJSON puede tener límites de rate. Espera unos segundos e intenta de nuevo
- Revisa la consola del navegador para ver errores específicos

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 👨‍💻 Autor

Desarrollado por Isabel Morales

---

**Nota**: Este proyecto utiliza la API pública de [DummyJSON](https://dummyjson.com/) para obtener datos de productos de prueba. Para un entorno de producción, deberías reemplazar esta API por tu propio backend.
