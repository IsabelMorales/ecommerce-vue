# [CONTEXTO DEL SISTEMA] PROYECTO E-COMMERCE VUE/TYPESCRIPT

## 1. MODO DE OPERACIÓN: INVESTIGACIÓN, FUNDAMENTACIÓN AMPLIA Y CAUTELA (MANDATORIO)

### A. Aprobación y Cautela

- **Aprobación Obligatoria:** NUNCA implemente código que modifique archivos existentes, cree nuevos archivos o implemente lógica compleja sin mi APROBACIÓN EXPLICITA. Presente el plan/snippet clave en el chat y espere la confirmación.

### B. Fundamentación e Investigación (Estándar de Calidad)

- **Fundamentación Obligatoria:** Toda solución debe estar BASADA, FUNDAMENTADA y JUSTIFICADA.
  - **Fuentes:** La fundamentación puede provenir de la documentación oficial del stack (Vue, TypeScript, Pinia, Tailwind CSS, Vuetify) o de fuentes externas confiables (patrones de diseño, artículos de ingeniería de software).
  - **Criterio:** Si la solución no es obvia o requiere una decisión de diseño, debe **explicar el razonamiento detrás de la elección** (ej. "Se elige un store de Pinia para esta lógica, ya que permite la persistencia y la reactividad global, sin sobrecargar los componentes raíz.").

### C. No Invención

- **Prohibido Inventar:** Prohibido inventar APIs, URLs o estructuras de datos. Si falta información crucial, DEBE preguntar o usar un placeholder explícito: `// TODO: Reemplazar con <Descripción del valor>`.

## 2. STACK TECNOLÓGICO OBLIGATORIO

| Tecnología         | Rol              | Directriz                                                                 |
| :----------------- | :--------------- | :------------------------------------------------------------------------ |
| **Framework**      | Interfaz         | Vue 3 estándar con Vite.                                                  |
| **API de Vue**     | Sintaxis         | Exclusivamente **Composition API** (`<script setup>`).                    |
| **Idioma**         | Tipado           | TypeScript (uso obligatorio de tipado estricto).                          |
| **Estado Global**  | Manejo de Estado | Exclusivamente **Pinia** (usar `defineStore`).                            |
| **Estilizado**     | CSS              | Exclusivamente **Tailwind CSS**.                                          |
| **Componentes UI** | Widgets          | Exclusivamente **Vuetify** (usar para Modals, Drawers, Navegación, etc.). |

## 3. ESTÁNDARES DE CÓDIGO

### A. Convenciones de Vue y Nomenclatura

- **Archivos:** Todos los componentes Vue deben usar el formato de bloque `<script setup>` y tener la extensión `.vue`.
- **Nomenclatura:**
  - Variables, funciones, métodos, `ref`, `reactive`: `camelCase`.
  - Componentes, Stores de Pinia, Interfaces, Types: `PascalCase`.
- **Props y Emits:** Siempre definir props e emits usando la sintaxis de TypeScript (ej. `defineProps<{...}>`).

### B. Estilizado

- **PROHIBIDO** valores de Tailwind hardcodeados (ej: `bg-[#123]`, `p-[24px]`). Usar solo utility classes.
- **OBLIGATORIO:** Usar `utility classes` de Tailwind.
- **Vuetify:** Para personalizar componentes de Vuetify, usar las clases internas o el sistema de _theming_ de Vuetify, y solo usar Tailwind como clases auxiliares para espaciado y layout.
- **Estilos Inline (`style="..."`):** Su uso está PERMITIDO ÚNICAMENTE cuando es **ESTRICTAMENTE NECESARIO** para aplicar un valor DINÁMICO que no puede ser gestionado eficientemente mediante clases de Tailwind o `v-bind()`. Si se usa, la IA debe justificar su necesidad.

### C. Reutilización

- **PROTOCOLO MANDATORIO:** Antes de crear un nuevo componente, simule una búsqueda en `/src/components/` (o el directorio de componentes) para verificar si se puede **EXTENDER O REUTILIZAR** uno existente. Solo crear si es estrictamente necesario.
