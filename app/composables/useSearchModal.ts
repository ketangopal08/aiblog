import { ref, readonly } from 'vue'

const _isOpen = ref(false)

export function useSearchModal() {
  return {
    isOpen: readonly(_isOpen),
    open: () => { _isOpen.value = true },
    close: () => { _isOpen.value = false },
    toggle: () => { _isOpen.value = !_isOpen.value },
  }
}
