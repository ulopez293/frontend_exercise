import { Proyecto } from "../fetch/fetchProyectos"

export const updateProyecto = async (proyectoEditado: Proyecto) => {
    const token = localStorage.getItem("authToken") // Obtener el token

    if (!token) throw new Error("No hay token disponible, inicia sesión")

    const response = await fetch(`${import.meta.env.VITE_URL_API}/proyectos/${proyectoEditado._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar el token en los headers
        },
        body: JSON.stringify(proyectoEditado),
    })

    if (!response.ok) throw new Error("Error al actualizar el proyecto")

    return response.json()
}
