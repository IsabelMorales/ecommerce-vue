<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useCartStore } from '@/stores/cart'
import AddToCartDialog from './components/addToCartDialog.vue'
import CartDrawer from './components/cartDrawer.vue'

interface Product {
  id: number
  title: string
  category: string
  price: number
  stock: number
  thumbnail: string
  images: string[]
}

const cartStore = useCartStore()
const display = useDisplay()
const allProducts = ref<Product[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const searchNameQuery = ref('')
const searchNameQueryDebounced = ref('')
const categoriesForFilter = ref<string[]>([])
const selectedCategories = ref<string[]>([])

const dialog = ref(false)
const selectedProduct = ref<Product | null>(null)
const openDialog = (product: Product) => {
  selectedProduct.value = product
  dialog.value = true
}
const cartDrawer = ref(false)
const openCartDrawer = () => {
  cartDrawer.value = true
}

const currentPage = ref(1)
const itemsPerPage = ref(12)
const totalPages = ref(0)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchNameQuery, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  if (newValue === null) {
    searchNameQueryDebounced.value = ''
  } else {
    debounceTimer = setTimeout(() => {
      searchNameQueryDebounced.value = newValue
    }, 500)
  }
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
})

const hasActiveFilters = computed(() => {
  return searchNameQueryDebounced.value.trim() !== '' || selectedCategories.value.length > 0
})

const filteredProducts = computed(() => {
  let result = allProducts.value

  // Filtrar por búsqueda de nombre (usa el valor debounced)
  if (searchNameQueryDebounced.value.trim() !== '') {
    const query = searchNameQueryDebounced.value.toLowerCase().trim()
    result = result.filter((product) => product.title.toLowerCase().includes(query))
  }

  // No necesitamos filtrar por categorías porque:
  // - Si hay categorías seleccionadas, allProducts ya contiene solo esas categorías
  // - Si no hay categorías seleccionadas, no hay filtro que aplicar

  return result
})

const displayProducts = computed(() => {
  if (!hasActiveFilters.value) {
    return products.value
  }

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

watch(
  [filteredProducts, hasActiveFilters],
  () => {
    if (hasActiveFilters.value) {
      totalPages.value = Math.ceil(filteredProducts.value.length / itemsPerPage.value)
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = 1
      }
    }
  },
  { immediate: true },
)

const fetchAllCategories = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products/category-list')

    if (!response.ok) {
      throw new Error(`Error al cargar categorías: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    categoriesForFilter.value = Array.isArray(data) ? data.sort() : []
    errorMessage.value = null
  } catch (error) {
    console.error('Error fetching categories:', error)
    errorMessage.value = null // No mostramos error en categorías para no bloquear la UI
    try {
      const fallbackResponse = await fetch('https://dummyjson.com/products')

      if (!fallbackResponse.ok) {
        throw new Error(`Error en fallback: ${fallbackResponse.status}`)
      }

      const fallbackData = await fallbackResponse.json()
      const categories = new Set<string>()
      if (fallbackData.products && Array.isArray(fallbackData.products)) {
        fallbackData.products.forEach((product: Product) => {
          categories.add(product.category)
        })
        categoriesForFilter.value = Array.from(categories).sort()
      }
    } catch (fallbackError) {
      console.error('Error in fallback fetching categories:', fallbackError)
      // Si el fallback también falla, dejamos categoriesForFilter vacío
      categoriesForFilter.value = []
    }
  }
}

const fetchProducts = async (page: number = 1) => {
  if (hasActiveFilters.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  loading.value = true
  errorMessage.value = null

  try {
    const skip = (page - 1) * itemsPerPage.value
    const limit = itemsPerPage.value
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)

    if (!response.ok) {
      throw new Error(
        `Error al cargar productos: ${response.status} ${response.statusText}. Por favor, intenta de nuevo.`,
      )
    }

    const data = await response.json()

    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Los datos recibidos no tienen el formato esperado.')
    }

    products.value = data.products

    // Actualizar allProducts solo como caché (no se usa cuando no hay filtros activos)
    // Cuando es página 1, asignar directamente; en otras páginas, agregar evitando duplicados
    if (page === 1) {
      allProducts.value = [...data.products]
    } else {
      data.products.forEach((product: Product) => {
        const existingIndex = allProducts.value.findIndex((p) => p.id === product.id)
        if (existingIndex === -1) {
          allProducts.value.push(product)
        }
      })
    }

    currentPage.value = page
    totalPages.value = Math.ceil((data.total || 0) / itemsPerPage.value)
    errorMessage.value = null
  } catch (error) {
    console.error('Error fetching products:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === 'string') {
      errorMessage.value = error
    } else {
      errorMessage.value =
        'Error al cargar los productos. Por favor, verifica tu conexión e intenta de nuevo.'
    }
    products.value = []
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    await fetchProducts(page)
  }
}

// Función helper para manejar cambios en filtros
const handleFiltersChange = async (shouldReload: boolean = true) => {
  currentPage.value = 1

  if (hasActiveFilters.value) {
    if (shouldReload || allProducts.value.length === 0) {
      await loadAllProducts()
    }
  } else {
    allProducts.value = []
    await fetchProducts(1)
  }
}

watch(searchNameQueryDebounced, async (newValue, oldValue) => {
  await handleFiltersChange(newValue !== oldValue)
})

watch(selectedCategories, async (newValues, oldValues) => {
  const categoriesChanged = JSON.stringify(oldValues) !== JSON.stringify(newValues)
  await handleFiltersChange(categoriesChanged)
})

const loadAllProducts = async () => {
  loading.value = true
  errorMessage.value = null

  try {
    let allItems: Product[] = []

    if (selectedCategories.value.length > 0) {
      const categoryPromises = selectedCategories.value.map(async (category) => {
        try {
          const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
          const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}`)

          if (!response.ok) {
            console.error(`Error HTTP al cargar categoría ${category}: ${response.status}`)
            return []
          }

          const data = await response.json()
          return data.products && Array.isArray(data.products) ? data.products : []
        } catch (error) {
          console.error(`Error loading category ${category}:`, error)
          return []
        }
      })

      const categoryResults = await Promise.all(categoryPromises)
      allItems = categoryResults.flat()

      if (allItems.length === 0 && selectedCategories.value.length > 0) {
        throw new Error('No se pudieron cargar los productos de las categorías seleccionadas.')
      }
      // No necesitamos eliminar duplicados porque cada producto tiene una categoría única
    } else if (searchNameQueryDebounced.value.trim() !== '') {
      let skip = 0
      const limit = 100
      let hasMore = true

      while (hasMore) {
        const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)

        if (!response.ok) {
          throw new Error(
            `Error al buscar productos: ${response.status} ${response.statusText}. Por favor, intenta de nuevo.`,
          )
        }

        const data = await response.json()

        if (!data.products || !Array.isArray(data.products)) {
          throw new Error('Los datos recibidos no tienen el formato esperado.')
        }

        allItems = [...allItems, ...data.products]

        if (data.products.length < limit || allItems.length >= (data.total || 0)) {
          hasMore = false
        } else {
          skip += limit
        }
      }
    }

    allProducts.value = allItems
    errorMessage.value = null
  } catch (error) {
    console.error('Error loading products:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === 'string') {
      errorMessage.value = error
    } else {
      errorMessage.value =
        'Error al cargar los productos. Por favor, verifica tu conexión e intenta de nuevo.'
    }
    allProducts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAllCategories()
  await fetchProducts(1)
})
</script>

<template>
  <v-app>
    <v-app-bar :elevation="1" class="px-2 px-md-8">
      <v-app-bar-title
        :class="
          display.width.value < 400
            ? 'text-caption text-sm-body-1 text-md-h5'
            : 'text-body-1 text-md-h5'
        "
        :style="{
          maxWidth:
            display.width.value < 400 ? '140px' : display.width.value < 800 ? '180px' : 'none',
        }"
      >
        <span
          :class="display.width.value < 800 ? 'text-truncate d-inline-block' : ''"
          :style="display.width.value < 800 ? { maxWidth: '100%' } : {}"
        >
          Alternova E-commerce
        </span>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn
        icon
        :class="display.width.value < 400 ? 'mr-12' : 'mr-4'"
        @click.stop="openCartDrawer"
        :min-width="display.width.value < 400 ? '36' : '40'"
        :height="display.width.value < 400 ? '36' : '40'"
      >
        <v-badge
          location="top right"
          color="primary"
          :content="cartStore.totalItems"
          :offset-x="display.width.value < 400 ? 2 : 4"
          :offset-y="display.width.value < 400 ? 2 : 4"
        >
          <v-icon icon="mdi-cart" :size="display.width.value < 400 ? '20' : '24'" />
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="py-2 py-md-4 px-4 px-md-8">
        <div class="mb-6">
          <h1 class="text-2xl md:text-3xl font-bold mb-4 text-center">Catálogo de Productos</h1>
        </div>

        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchNameQuery"
              label="Buscar por nombre"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedCategories"
              :items="categoriesForFilter"
              label="Filtrar por categorías"
              prepend-inner-icon="mdi-filter"
              variant="outlined"
              density="compact"
              multiple
              chips
              closable-chips
              clearable
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Mensaje de error -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          @click:close="errorMessage = null"
          class="mb-4"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="flex-grow-1">
              <v-alert-title class="mb-2">{{ errorMessage }}</v-alert-title>
              <p class="text-body-2 mb-0">
                Por favor, verifica tu conexión a internet e intenta de nuevo.
              </p>
            </div>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-refresh"
              @click="
                errorMessage = null
                if (hasActiveFilters) {
                  loadAllProducts()
                } else {
                  fetchProducts(currentPage)
                }
              "
              class="ml-4"
            >
              Reintentar
            </v-btn>
          </div>
        </v-alert>

        <!-- Contador de resultados -->
        <div
          class="mb-4 d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between gap-2"
        >
          <span class="text-body-2 text-sm-body-1 text-grey-darken-1">
            <span v-if="hasActiveFilters">
              Mostrando <strong>{{ filteredProducts.length }}</strong> producto{{
                filteredProducts.length !== 1 ? 's' : ''
              }}
            </span>
            <span v-else>
              <strong>{{ products.length }}</strong> productos en esta página
            </span>
          </span>
          <v-btn
            v-if="hasActiveFilters"
            variant="text"
            size="small"
            prepend-icon="mdi-close"
            @click="
              ((searchNameQuery = ''), (searchNameQueryDebounced = ''), (selectedCategories = []))
            "
          >
            Limpiar filtros
          </v-btn>
        </div>

        <v-row v-if="loading">
          <v-col v-for="n in itemsPerPage" :key="n" cols="6" md="4" lg="3" class="d-flex">
            <v-card class="d-flex flex-column w-100">
              <v-skeleton-loader type="card"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="product in displayProducts"
            :key="product.id"
            cols="6"
            md="4"
            lg="3"
            class="d-flex"
          >
            <v-card class="d-flex flex-column w-100" :class="{ 'opacity-60': product.stock === 0 }">
              <div class="position-relative">
                <v-img height="200" :src="product.thumbnail" cover></v-img>
                <v-chip
                  v-if="product.stock === 0"
                  color="error"
                  size="small"
                  class="position-absolute"
                  style="top: 8px; right: 8px"
                >
                  Sin Stock
                </v-chip>
                <v-chip
                  v-else-if="product.stock < 10"
                  color="warning"
                  size="small"
                  class="position-absolute"
                  style="top: 8px; right: 8px"
                >
                  Pocas unidades
                </v-chip>
              </div>

              <v-card-title class="pb-0">{{ product.title }}</v-card-title>
              <v-card-subtitle>{{ product.category }}</v-card-subtitle>
              <v-card-text class="text-h6 pb-0 pt-2 font-weight-bold">
                {{ product.price }}$
              </v-card-text>
              <v-card-actions class="px-2 px-md-4">
                <v-btn
                  block
                  :color="product.stock === 0 ? 'grey' : 'primary'"
                  variant="elevated"
                  :disabled="product.stock === 0"
                  class="mb-2"
                  @click.stop="openDialog(product)"
                >
                  <span class="text-caption text-sm-body-2">
                    {{ product.stock === 0 ? 'Agotado' : 'Añadir al carrito' }}
                  </span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div
          v-if="!loading && hasActiveFilters && filteredProducts.length === 0"
          class="text-center pa-8"
        >
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
          <p class="text-h6 text-grey">No se encontraron productos</p>
          <p class="text-body-2 text-grey mt-2">
            Intenta ajustar tus filtros de búsqueda o categorías
          </p>
        </div>

        <div v-if="!loading && totalPages > 1" class="mt-4 mt-md-6 d-flex justify-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="display.mobile.value ? 5 : 7"
            @update:model-value="changePage"
          />
        </div>
      </v-container>
    </v-main>

    <AddToCartDialog v-model="dialog" :product="selectedProduct" />
    <CartDrawer v-model="cartDrawer" />
  </v-app>
</template>
