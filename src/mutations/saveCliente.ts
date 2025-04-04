import { InitialFormType } from "../home/Home"

export const saveCliente = async (data: InitialFormType) => {
    const token = localStorage.getItem("authToken") // Obtener el token

    const response = await fetch(`${import.meta.env.VITE_URL_API}/clientes/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar el token en los headers
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Error al guardar el cliente")

    return response.json()
}
