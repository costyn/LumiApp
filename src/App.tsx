import { LumiferaController } from './components/LumiferaController.tsx'
import { ThemeProvider } from "./components/ThemeProvider.tsx"

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <main className="min-h-screen bg-background p-4">
        <LumiferaController />
      </main>
    </ThemeProvider>
  )
}

export default App