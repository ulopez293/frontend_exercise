export interface Proyecto {
    _id: string
    nombre: string
    descripcion: string
    estado: string
    fecha_inicio: string
    fecha_entrega: string
    cliente_id: string
}

export const fetchProyectos = async (): Promise<Proyecto[]> => {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${import.meta.env.VITE_URL_API}/proyectos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error al obtener los proyectos")
    
    const data = await response.json() as Proyecto[]
    return data
}