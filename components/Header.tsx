import React from 'react'
import styles from '../styles/Header.module.scss'
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs'

import { useStateContext } from '../context/states'

export default function Header() {
    const { darkMode, setDarkMode } = useStateContext();

    function handleToggleDarkMode() {
        setDarkMode(!darkMode);
    }

    return (
        <header className={darkMode ? styles["header-main"] : styles["header-main-light"]}>
            <div>
                <h1>TODO</h1>
            </div>
            <div>
                {
                    darkMode ?
                        <BsFillSunFill className={styles["toggle-dark-mode"]} onClick={handleToggleDarkMode} /> :
                        <BsFillMoonFill className={styles["toggle-dark-mode"]} onClick={handleToggleDarkMode} />
                }
            </div>
        </header>
    )
}
