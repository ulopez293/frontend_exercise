import { Traslado } from "../fetch/fetchTraslados"

export const updateTraslado = async (trasladoEditado: Traslado) => {
    const token = localStorage.getItem("authToken") // Obtener el token

    if (!token) throw new Error("No hay token disponible, inicia sesión")

    const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados/${trasladoEditado._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar el token en los headers
        },
        body: JSON.stringify(trasladoEditado),
    })

    if (!response.ok) throw new Error("Error al actualizar el traslado")

    return response.json()
}
