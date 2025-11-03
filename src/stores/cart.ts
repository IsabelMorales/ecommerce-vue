import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export interface CartProduct {
  id: number
  title: string
  category: string
  price: number
  stock: number
  quantity: number
  totalPrice: number
  thumbnail: string
}

const STORAGE_KEY = 'cart-items'

// Función para cargar items desde localStorage
const loadCartFromStorage = (): CartProduct[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CartProduct[]
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  return []
}

const saveCartToStorage = (items: CartProduct[]) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartProduct[]>(loadCartFromStorage())

  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems)
    },
    { deep: true },
  )

  const addToCart = (item: CartProduct) => {
    const existingItemIndex = items.value.findIndex((cartItem) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      const existingItem = items.value[existingItemIndex]
      if (existingItem) {
        existingItem.quantity += item.quantity
        existingItem.totalPrice = existingItem.quantity * existingItem.price
      }
    } else {
      items.value.push(item)
    }
  }

  const removeFromCart = (productId: number) => {
    const removeIndex = items.value.findIndex((item) => item.id === productId)

    if (removeIndex >= 0) {
      items.value.splice(removeIndex, 1)
    }
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    const itemIndex = items.value.findIndex((item) => item.id === productId)

    if (itemIndex >= 0) {
      const item = items.value[itemIndex]
      if (item) {
        // Validar que la cantidad esté entre 1 y el stock disponible
        const validQuantity = Math.max(1, Math.min(newQuantity, item.stock))

        // Mutar directamente (igual que en addToCart) - el watch deep: true lo detecta
        item.quantity = validQuantity
        item.totalPrice = validQuantity * item.price
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.totalPrice
    }, 0)
  })

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
})
