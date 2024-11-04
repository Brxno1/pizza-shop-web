import { Pizza } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="text-lg text-foreground">
          <Link to="/" className="flex items-center gap-3">
            <Pizza className="h-5 w-5" />
            <span className="font-semibold">Pizza.shop</span>
          </Link>
        </div>
        <footer className="text-sm">
          Painel do parceiro &copy; pizza.shop - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
