import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()
    console.log(theme)
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-500" />
      )}
    </button>
  )
}

export default ThemeChanger