import React from 'react'
import styles from '../styles/About.module.scss'

type Props = {}

export default function About({ }: Props) {
    return (
        <div
            className={styles["page-about"]}
        >
            <h2 className={styles["page-title"]}>ABOUT</h2>
            <br />
            <div className={styles["page-content"]}>
                <div>
                    <h3>What is this?</h3>
                    <p>
                        This is a simple todo app built with Next.js and TypeScript.
                    </p><br />

                    <h3>Why?</h3>
                    <p>
                        I wanted to learn Next.js and TypeScript, so I built this app.
                    </p><br />

                    <h3>How?</h3>
                    <p>
                        I followed the <a href="https://nextjs.org/learn/basics/create-nextjs-app">Next.js tutorial</a> and the <a href="https://www.typescriptlang.org/docs/handbook/react.html">TypeScript React tutorial</a>.
                    </p><br />

                    <h3>Where?</h3>
                    <p>
                        The source code is available on <a href="">GitHub</a>.
                    </p><br />
                </div>
            </div>

            <footer
                className={styles["page-footer"]}
            >
                <p>
                    &copy; 2022 DimensityDU
                </p>
            </footer>
        </div>
    )
}
