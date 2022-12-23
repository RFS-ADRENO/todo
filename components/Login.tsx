import React, { useEffect, useState } from 'react'
import { _getAuth, signInWithGoogle } from '../firebase/firebase'
import { GoogleAuthProvider, UserCredential, signOut } from 'firebase/auth'
import { useStateContext } from '../context/states';

import styles from '../styles/Login.module.scss'

type Props = {}

export default function Login({ }: Props) {
    const { user, setUser, darkMode } = useStateContext();
    const [failed, setFailed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function signIn(): Promise<UserCredential | null> {
        try {
            const result_1 = await signInWithGoogle();
            if (result_1 === null)
                throw new Error('result is null');

            const credential = GoogleAuthProvider.credentialFromResult(result_1);

            if (credential === null)
                throw new Error('credential is null');

            const token = credential?.accessToken;

            setUser(result_1.user);
            return result_1;
        } catch (error) {
            setFailed(true);
            return null;
        }
    }

    useEffect(() => {
        const auth = _getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div
            className={darkMode ? styles["login-container"] : styles["login-container-light"]}
        >
            {
                loading ? <p>Loading...</p> :
                    user ?
                        <div>
                            <p>
                                Logged in as {user.email}
                            </p>
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await signOut(_getAuth());
                                    setUser(null);

                                    setLoading(false);
                                }}
                                className={darkMode ? styles["btn"] : styles["btn-light"]}
                            >
                                Sign out
                            </button>
                        </div> :
                        <div >
                            <p>
                                Not logged in
                            </p>
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await signIn();

                                    setLoading(false);
                                }}
                                className={darkMode ? styles["btn"] : styles["btn-light"]}
                            >Sign in</button>
                        </div>
            }
            {
                failed ?
                    <div>
                        <p>Login failed...</p>
                    </div> : null
            }
        </div>
    )
}
