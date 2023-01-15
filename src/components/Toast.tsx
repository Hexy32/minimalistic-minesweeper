import fontColorContrast from 'font-color-contrast'
import styles from '../styles/toast.module.css'

export default function Toast({ message, color, func }: ToastProps) {
  const textColor = fontColorContrast(color)
  return (
    <section
      className={styles.container + ' ' + styles.slide}
      id="toast"
      style={{ backgroundColor: color, color: textColor }}
      onClick={func}
    >
      <p>{message}</p>
    </section>
  )
}

type ToastProps = {
  message: string
  color: string
  func?: () => void
}
