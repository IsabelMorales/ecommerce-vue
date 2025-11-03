<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useDisplay } from 'vuetify'

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const cartStore = useCartStore()
const display = useDisplay()

const drawerWidth = computed(() => {
  if (display.xs.value) {
    // Use viewport width to ensure full coverage on mobile
    return Math.min(display.width.value, window.innerWidth)
  }
  if (display.sm.value) {
    return 320
  }
  return 400
})

const closeDrawer = () => {
  emit('update:modelValue', false)
}

const decreaseQuantity = (productId: number, currentQuantity: number) => {
  cartStore.updateQuantity(productId, currentQuantity - 1)
}

const increaseQuantity = (productId: number, currentQuantity: number) => {
  cartStore.updateQuantity(productId, currentQuantity + 1)
}
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    location="right"
    temporary
    :width="drawerWidth"
    scrim
  >
    <template v-slot:prepend>
      <v-list-item prepend-icon="mdi-cart" title="Carrito de Compras" subtitle="Tus productos">
        <template v-slot:append>
          <v-btn icon="mdi-close" variant="text" @click.stop="closeDrawer" />
        </template>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list v-if="cartStore.items.length > 0">
      <v-list-item
        v-for="item in cartStore.items"
        :key="item.id"
        class="py-4 px-8 pa-sm-4 border-b"
      >
        <template v-slot:prepend>
          <v-img
            :src="item.thumbnail"
            :alt="item.title"
            :width="display.mobile.value ? 50 : 60"
            :height="display.mobile.value ? 50 : 60"
            cover
            class="rounded mr-2 mr-sm-4"
          />
        </template>

        <div class="flex-grow-1">
          <div class="d-flex justify-space-between align-start">
            <v-list-item-title class="text-body-1 font-weight-bold pr-2">
              {{ item.title }}
            </v-list-item-title>
            <v-btn
              icon
              size="small"
              color="error"
              variant="text"
              density="compact"
              @click="cartStore.removeFromCart(item.id)"
              class="mt-n1"
            >
              <v-icon size="16">mdi-delete</v-icon>
            </v-btn>
          </div>

          <!-- Selector de cantidad -->
          <div class="d-flex align-center mb-2 gap-2">
            <span class="text-body-2 text-grey-darken-1 mr-2">Cantidad:</span>
            <v-btn
              icon="mdi-minus"
              size="small"
              color="grey-darken-1"
              variant="text"
              density="compact"
              :disabled="item.quantity <= 1"
              @click="decreaseQuantity(item.id, item.quantity)"
            />
            <span class="text-body-2 font-weight-medium min-w-6 text-center">
              {{ item.quantity }}
            </span>
            <v-btn
              icon="mdi-plus"
              size="small"
              color="grey-darken-1"
              variant="text"
              density="compact"
              :disabled="item.quantity >= item.stock"
              @click="increaseQuantity(item.id, item.quantity)"
            />
          </div>

          <!-- Precio unitario y total -->
          <div class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey">${{ item.price }} c/u</span>
            <span class="text-body-1 font-weight-bold text-primary">
              ${{ item.totalPrice.toFixed(2) }}
            </span>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <!-- Estado vacío -->
    <div v-else class="d-flex flex-column align-center justify-center pa-8 h-full">
      <v-icon size="64" color="grey-lighten-1">mdi-cart-off</v-icon>
      <p class="text-h6 mt-4 text-grey">Tu carrito está vacío</p>
      <p class="text-body-2 text-grey text-center mt-2">Agrega productos desde el catálogo</p>
    </div>

    <!-- Footer con total y botones de acción -->
    <template v-slot:append>
      <v-divider></v-divider>
      <div v-if="cartStore.items.length > 0" :class="display.xs.value ? 'pa-4 pr-8' : 'pa-4'">
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6 font-weight-bold">Total a pagar:</span>
          <span class="text-h6 text-primary font-weight-bold">
            ${{ cartStore.totalPrice.toFixed(2) }}
          </span>
        </div>

        <v-btn block color="primary" variant="elevated" size="large" class="mb-2">
          <v-icon start>mdi-checkout</v-icon>
          Proceder al Checkout
        </v-btn>

        <v-btn block variant="outlined" @click="cartStore.clearCart()">
          <v-icon start>mdi-cart-off</v-icon>
          Vaciar Carrito
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.border-b:last-child {
  border-bottom: none;
}
</style>
