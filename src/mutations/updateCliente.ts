import { Cliente } from "../fetch/fetchClientes"

export const updateCliente = async (clienteEditado: Cliente) => {
    const token = localStorage.getItem("authToken") // Obtener el token

    if (!token) throw new Error("No hay token disponible, inicia sesión")

    const response = await fetch(`${import.meta.env.VITE_URL_API}/clientes/${clienteEditado._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar el token en los headers
        },
        body: JSON.stringify(clienteEditado),
    })

    if (!response.ok) throw new Error("Error al actualizar el cliente")

    return response.json()
}
