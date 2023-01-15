import style from '../styles/hamburger.module.css'
import { useState } from 'react'

export function Hamburger({ children }: HamburgerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className={style.settingsButton}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? 'Close' : 'Settings'}
      </button>
      {isOpen && children}
    </>
  )
}

type HamburgerProps = {
  children: React.ReactNode
}
