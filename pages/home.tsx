import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Login from '../components/Login'
import { useStateContext } from '../context/states'
import styles from '../styles/Home.module.scss'

import { getDatabase, onValue, ref, get, set, Unsubscribe } from "firebase/database"

interface Item {
    id: number
    title: string
    completed: boolean
}

type Props = {}

function parseData(str: string) {
    const data = str.split("__").filter(item => item !== "" && item.split("_")[0])

    return data.map((item, index) => {
        const [title, completed] = item.split("_");

        return {
            id: index + 1,
            title,
            completed: completed === '1'
        }
    })
}

function parseDataBack(data: Item[]) {
    return data.map(item => {
        return `${item.title}_${item.completed ? '1' : '0'}`
    }).join("__")
}

export default function Home({ }: Props) {
    const [data, setData] = useState<Item[] | null>(null)
    const [loading, setLoading] = useState(false)
    const { user } = useStateContext();

    const inputRef = useRef<HTMLInputElement>(null)

    const { updating, setUpdating } = useStateContext();

    useEffect(() => {
        var unsubscribe: Unsubscribe;

        async function loadData() {
            var localData = localStorage.getItem('data') || "";
            try {
                if (localData && !user) {
                    setData(parseData(localData))
                } else if (user) {
                    const db = getDatabase();
                    const userRef = ref(db, 'users/' + user.uid);

                    const _data = await get(userRef);

                    if (_data.exists()) {
                        setData(parseData(_data.val()))
                    } else if (localData) {
                        setData(parseData(localData))

                        await set(userRef, localData)
                    }
                }
            } catch (error) {
                console.error(error);
            }

            if (!data) {
                setData(parseData(localData))
            }

            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid);

                unsubscribe = onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setData(parseData(snapshot.val()))
                    }
                }, (error) => {
                    console.error(error);
                })
            }
        }

        loadData()

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

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

            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.uid)

                await set(userRef, parseDataBack(newData))
            } else {
                localStorage.setItem('data', parseDataBack(newData))
            }

            setData(newData)
            inputRef.current.value = ''
        }


        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
        setUpdating(false)
    }

    async function handleDelete(index: number) {
        setUpdating(true)
        const newData = [...(data || [])]
        newData.splice(index, 1)

        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid)

            await set(userRef, parseDataBack(newData))
        } else {
            localStorage.setItem('data', parseDataBack(newData))
        }

        setData(newData)

        await new Promise(resolve => setTimeout(resolve, 100))
        setUpdating(false)
    }

    async function handleChange(index: number) {
        setUpdating(true)
        const newData = [...(data || [])]
        newData[index].completed = !newData[index].completed

        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);

            await set(userRef, parseDataBack(newData))
        } else {
            localStorage.setItem('data', parseDataBack(newData))
        }

        setData(newData)

        await new Promise(resolve => setTimeout(resolve, 100))
        setUpdating(false)
    }

    return (
        <div className={styles.container}>

            <Login />
            <h2 className={styles["page-title"]}>Home</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="new task here"
                    name='title'
                    id='title'
                    ref={inputRef}
                    maxLength={30}
                    pattern="^(?!.*(_)).*$"
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
