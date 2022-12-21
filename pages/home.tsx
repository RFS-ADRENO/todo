import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useStateContext } from '../context/states'
import { AiOutlineClose } from 'react-icons/ai'
import styles from '../styles/Home.module.scss'

interface Item {
    id: number
    title: string
    completed: boolean
}

type Props = {}

export default function Home({ }: Props) {
    const [data, setData] = useState<Item[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [checkboxes, setCheckboxes] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { updating, setUpdating } = useStateContext();

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal;

        var localData = localStorage.getItem('data');

        if (localData) {
            setData(JSON.parse(localData))
        } else {
            // simulate no fetch data
            if (true) {
                localData = JSON.stringify([]);
            } else {
                fetch('http://localhost:3000/items.json', { signal })
                    .then(response => response.json())
                    .then(json => {
                        setData(json)
                    })
                    .catch(error => {
                        if (error.name !== 'AbortError') {
                            throw error
                        }
                    });
            }
        }

        if (!data) {
            setData(JSON.parse(localData))
        }

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        if (inputRef.current && inputRef.current.value && data && data.length < 10) {
            setUpdating(true)

            const title = inputRef.current.value

            const newData = [...(data || [])]
            newData.push({
                id: newData.length + 1,
                title,
                completed: false
            })

            setData(newData)
            inputRef.current.value = ''
            localStorage.setItem('data', JSON.stringify(newData))
        }


        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
        setUpdating(false)
    }

    async function handleDelete(index: number) {
        setUpdating(true)
        const newData = [...(data || [])]
        newData.splice(index, 1)
        setData(newData)

        localStorage.setItem('data', JSON.stringify(newData))

        await new Promise(resolve => setTimeout(resolve, 100))
        setUpdating(false)
    }

    async function handleChange(index: number) {
        setUpdating(true)
        const newData = [...(data || [])]
        newData[index].completed = !newData[index].completed
        setData(newData)
        localStorage.setItem('data', JSON.stringify(newData))

        await new Promise(resolve => setTimeout(resolve, 100))
        setUpdating(false)
    }

    return (
        <div className={styles.container}>
            <h2 className={styles["page-title"]}>Home</h2>
            <br />
            <br />
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="new task here"
                    name='title'
                    id='title'
                    ref={inputRef}
                    maxLength={30}
                />
                <button
                    type="submit"
                    className={updating || loading ? styles.loading : styles.clickable}
                >Add</button>
            </form>
            <br />
            <hr />
            <br />
            <ul className={styles.list}>
                {data && data.map((item, index) => (
                    <li key={index}>
                        <p>{item.title}</p>
                        <div>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                className={updating ? styles.checkboxes : styles.clickable}
                                onChange={() => handleChange(index)}
                            />
                            <AiOutlineClose
                                className={updating ? styles.deleting : styles.clickable}
                                onClick={() => handleDelete(index)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
