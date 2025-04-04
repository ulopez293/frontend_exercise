export const deleteCliente = async (id: string) => {
    const token = localStorage.getItem("authToken") 

    const response = await fetch(`${import.meta.env.VITE_URL_API}/clientes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    })

    if (!response.ok) throw new Error("Error al eliminar el cliente")

    return response.json()
}
