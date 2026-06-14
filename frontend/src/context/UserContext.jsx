import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  })

  function login(userData, token) {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
    setUser(userData)
  }

  function logout() {
  if (user?.id) {
    localStorage.removeItem(`rentopia_wishlist_${user.id}`)
  }
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  setUser(null)
}
  function updateUserData(newData) {
    const updated = { ...user, ...newData }
    localStorage.setItem("user", JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <UserContext.Provider value={{ user, login, logout, updateUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext)
}
