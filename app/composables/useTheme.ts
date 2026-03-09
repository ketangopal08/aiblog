export const useTheme = () => {
  const isDark = useState<boolean>('isDark', () => false)

  const setDark = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  const toggleTheme = () => setDark(!isDark.value)

  // Called in onMounted to sync reactive state with what the plugin already set on <html>
  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
  }

  return { isDark, toggleTheme, initTheme }
}
