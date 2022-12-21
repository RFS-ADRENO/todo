import { ReactNode } from 'react'
import { useStateContext } from '../context/states';
import styles from '../styles/Content.module.scss'

type Props = {
    children: ReactNode
}

export default function Content({ children }: Props) {
    const { darkMode, setDarkMode } = useStateContext();
    return (
        <main className={darkMode ? styles["content-container"] : styles["content-container-light"]}>
            {children}
        </main>
    )
}
