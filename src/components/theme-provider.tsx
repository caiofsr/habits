import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    // This effect runs only on the client after hydration
    // Update the theme based on localStorage if it wasn't set initially (e.g. SSR)
    const storedTheme =
      typeof localStorage !== "undefined"
        ? (localStorage.getItem(storageKey) as Theme)
        : null
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme)
    }
  }, [storageKey, theme])

  useEffect(() => {
    const root = window.document.documentElement

    // Helper function to apply the current theme or system preference
    const applyActualTheme = (currentThemeSetting: Theme) => {
      root.classList.remove("light", "dark")
      let themeToApply: "light" | "dark"

      if (currentThemeSetting === "system") {
        themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      } else {
        // If currentThemeSetting is not "system", it must be "light" or "dark".
        themeToApply = currentThemeSetting as "light" | "dark"
      }
      root.classList.add(themeToApply)
    }

    // Apply the theme when the hook runs (e.g. `theme` state changes or component mounts)
    applyActualTheme(theme)

    // If the theme setting is "system", listen for OS-level changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = () => {
        applyActualTheme("system") // Re-evaluate and apply system theme
      }

      // Add event listener for changes in system preference
      mediaQuery.addEventListener("change", handleChange)

      // Cleanup function to remove the event listener
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }
    // No specific cleanup needed if theme is not "system", as no listener was added in that case.
  }, [theme]) // Re-run this effect if the `theme` state (light, dark, system) changes

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
