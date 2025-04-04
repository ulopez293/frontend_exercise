export const deleteProyecto = async (id: string) => {
    const token = localStorage.getItem("authToken") 

    const response = await fetch(`${import.meta.env.VITE_URL_API}/proyectos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    })

    if (!response.ok) throw new Error("Error al eliminar el proyecto")

    return response.json()
}
