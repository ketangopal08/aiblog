// Runs on client BEFORE app mount — sets dark class synchronously from localStorage
export default defineNuxtPlugin(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
