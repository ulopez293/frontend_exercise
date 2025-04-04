import { InitialFormType } from "../proyectos/Proyectos"

export const saveProyecto = async (data: InitialFormType) => {
    const token = localStorage.getItem("authToken") // Obtener el token

    const response = await fetch(`${import.meta.env.VITE_URL_API}/proyectos/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar el token en los headers
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Error al guardar el proyecto")

    return response.json()
}
