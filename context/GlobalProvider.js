import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true)
                    setIsLoading(true)
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setIsLoading(false)
                    setUser(null)
                }
            })
            .catch(error => console.log(error))
            .finally(() => {
                console.log("Logged In")
                setIsLoading(false)
            })
        }, [refreshKey])
    
    const refreshUser = () => setRefreshKey(refreshKey + 1)
    return (
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading, refreshUser}}>
            {children}
        </GlobalContext.Provider>
    )
}
