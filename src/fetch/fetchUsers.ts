export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${import.meta.env.VITE_URL_API}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error al obtener usuarios")
    
    const data = await response.json() as User[]
    return data
}