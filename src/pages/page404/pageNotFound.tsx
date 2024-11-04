import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PageNotFound() {
  const [time, setTime] = useState(5)
  const timer = useRef<number | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setTime((prevTime) => prevTime - 1)
    }, 1000)

    if (time <= 0) {
      navigate('/')
    }

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current)
      }
    }
  }, [navigate, time])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="text-accent-foreground">
        Redirect to home in:{' '}
        <span
          data-timer={time <= 3}
          className="text-sky-500 data-[timer='true']:!text-rose-500 dark:text-sky-400"
        >
          {time}
        </span>
      </p>
    </div>
  )
}
