import { Button } from "./components/ui/button"

function App() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Lumifera Control</h1>
        <div className="space-x-2">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Danger Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </main>
  )
}

export default App