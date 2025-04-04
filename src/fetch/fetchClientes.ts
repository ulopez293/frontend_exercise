export interface Cliente {
    _id: string;
    nombre: string;
    correo: string;
    telefono: string;
    user_id: string;
}

export const fetchClientes = async (): Promise<Cliente[]> => {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${import.meta.env.VITE_URL_API}/clientes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error al obtener los clientes")
    
    const data = await response.json() as Cliente[]
    return data
}