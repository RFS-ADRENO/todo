import { User } from "firebase/auth";
import { createContext, useContext, useState, Dispatch, SetStateAction } from "react"

export type TContext = {
    updating: boolean;
    darkMode: boolean;
    user: User | null;
    setUpdating: Dispatch<SetStateAction<boolean>>;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const Context = createContext<TContext>({
    updating: false,
    darkMode: false,
    user: null,
    setUpdating: () => void 0,
    setDarkMode: () => void 0,
    setUser: () => void 0,
})

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    const [updating, setUpdating] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    return (
        <Context.Provider value={{ updating, darkMode, user, setUpdating, setDarkMode, setUser }}>
            {children}
        </Context.Provider>
    );
}

export function useStateContext() {
    return useContext(Context);
}
