<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCartStore, type CartProduct } from '@/stores/cart'
import { useDisplay } from 'vuetify'

interface Product {
  id: number
  title: string
  category: string
  price: number
  stock: number
  thumbnail: string
  images: string[]
}

interface Props {
  modelValue: boolean
  product: Product | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add-to-cart': [product: CartProduct]
}>()

const cartStore = useCartStore()
const display = useDisplay()
const quantity = ref(1)
const maxQuantity = computed(() => {
  return props.product?.stock || 0
})
const subtotal = computed(() => {
  if (!props.product) return 0

  return (props.product.price * quantity.value).toFixed(2)
})
const isQuantityValid = computed(() => {
  return quantity.value > 0 && quantity.value <= (props.product?.stock || 0)
})

const isNegative = computed(() => {
  return quantity.value < 0
})
const adjustQuantity = (value: number) => {
  const currentQuantity = Number(quantity.value) || 1
  const newQuantity = currentQuantity + value

  if (newQuantity < 1) {
    quantity.value = 1
  } else if (newQuantity > maxQuantity.value) {
    quantity.value = maxQuantity.value
  } else {
    quantity.value = newQuantity
  }
}
const addToCart = () => {
  if (!props.product || !isQuantityValid.value) return

  const cartProduct: CartProduct = {
    id: props.product.id,
    title: props.product.title,
    category: props.product.category,
    price: props.product.price,
    stock: props.product.stock,
    quantity: quantity.value,
    totalPrice: Number(subtotal.value),
    thumbnail: props.product.thumbnail,
  }

  cartStore.addToCart(cartProduct)
  emit('add-to-cart', cartProduct)
  closeDialog()
}

const closeDialog = () => {
  quantity.value = 1
  emit('update:modelValue', false)
}

watch(
  () => props.product?.id,
  () => {
    quantity.value = 1
  },
)
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600px"
    :fullscreen="display.xs.value"
    persistent
  >
    <v-card v-if="product">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">Añadir al Carrito</span>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4 pa-md-6">
        <div class="d-flex flex-column flex-md-row mb-4">
          <div
            style="flex-shrink: 0; max-width: 200px; margin: 0 auto"
            class="w-100 w-md-24 h-32 h-md-28 mb-4 mb-md-0 mr-md-8"
          >
            <v-img :src="product.thumbnail" :alt="product.title" width="100%" height="100%" cover />
          </div>
          <div class="flex-grow-1 text-center text-md-left">
            <h3 class="text-h6">{{ product.title }}</h3>
            <p class="text-body-2 text-grey">{{ product.category }}</p>
            <p class="text-h6 mt-2">{{ product.price }}$</p>
            <span class="text-caption font-weight-medium">
              Stock disponible: {{ product.stock }} unidades
            </span>

            <v-divider class="my-4"></v-divider>

            <label class="text-body-1 font-weight-medium mb-0 d-block">Cantidad:</label>

            <div class="d-flex align-center justify-center justify-md-start" style="gap: 0">
              <v-btn
                icon
                variant="flat"
                size="small"
                color="grey-lighten-1"
                :disabled="quantity <= 1"
                @click="adjustQuantity(-1)"
                style="min-width: 40px; height: 40px; border-radius: 4px 0 0 4px"
              >
                <v-icon size="small">mdi-minus</v-icon>
              </v-btn>

              <v-text-field
                v-model.number="quantity"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                :min="1"
                :max="maxQuantity"
                hide-spin-buttons
                style="max-width: 70px"
                class="quantity-input"
              >
                <template v-slot:prepend-inner>
                  <span style="opacity: 0; pointer-events: none">0</span>
                </template>
              </v-text-field>

              <v-btn
                icon
                variant="flat"
                size="small"
                color="grey-lighten-1"
                :disabled="quantity >= maxQuantity"
                @click="adjustQuantity(1)"
                style="min-width: 40px; height: 40px; border-radius: 0 4px 4px 0; margin-left: -1px"
              >
                <v-icon size="small">mdi-plus</v-icon>
              </v-btn>
            </div>

            <v-alert
              v-if="isNegative"
              type="error"
              density="compact"
              variant="tonal"
              class="text-caption mt-2 pa-2"
            >
              Solo se permiten números positivos
            </v-alert>
            <v-alert
              v-else-if="quantity > maxQuantity"
              type="error"
              density="compact"
              variant="tonal"
              class="text-caption mt-2 pa-2"
            >
              La cantidad no puede exceder el stock disponible
            </v-alert>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Acciones del modal -->
      <v-card-actions class="pa-4 d-flex flex-row gap-2">
        <v-btn variant="text" @click="closeDialog" class="flex-grow-1"> Cancelar </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!isQuantityValid"
          @click="addToCart"
          class="flex-grow-1"
        >
          Agregar al carrito
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.quantity-input :deep(.v-field) {
  border-radius: 0;
  margin: 0;
}

.quantity-input :deep(.v-field__outline) {
  border-radius: 0;
}

/* Remover o personalizar el borde en hover y focus */
.quantity-input :deep(.v-field__outline__start),
.quantity-input :deep(.v-field__outline__notch),
.quantity-input :deep(.v-field__outline__end) {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.quantity-input :deep(.v-field:hover .v-field__outline__start),
.quantity-input :deep(.v-field:hover .v-field__outline__notch),
.quantity-input :deep(.v-field:hover .v-field__outline__end) {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.quantity-input :deep(.v-field--focused .v-field__outline__start),
.quantity-input :deep(.v-field--focused .v-field__outline__notch),
.quantity-input :deep(.v-field--focused .v-field__outline__end) {
  border-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
