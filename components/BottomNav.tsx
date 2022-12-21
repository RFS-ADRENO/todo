import React from 'react'
import styles from '../styles/BottomNav.module.scss'
import { AiFillHome, AiOutlineInfoCircle } from 'react-icons/ai'
import Link from 'next/link'

import { useStateContext } from '../context/states'

type Props = {}

export default function BottomNav({ }: Props) {
    const { darkMode } = useStateContext();

    return (
        <footer>
            <nav className={darkMode ? styles["bottom-nav"] : styles["bottom-nav-light"]}>
                <Link href="/home">
                    <AiFillHome
                        size={20}
                    />
                </Link>
                <Link href="/about">
                    <AiOutlineInfoCircle
                        size={20}
                    />
                </Link>
            </nav>
        </footer>
    )
}
