import { createContext, useContext, useState, Dispatch, SetStateAction } from "react"

export type TContext = {
    updating: boolean;
    darkMode: boolean;
    setUpdating: Dispatch<SetStateAction<boolean>>;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<TContext>({
    updating: false,
    darkMode: false,
    setUpdating: () => void 0,
    setDarkMode: () => void 0,
})

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    const [updating, setUpdating] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <Context.Provider value={{ updating, darkMode, setUpdating, setDarkMode }}>
            {children}
        </Context.Provider>
    );
}

export function useStateContext() {
    return useContext(Context);
}
