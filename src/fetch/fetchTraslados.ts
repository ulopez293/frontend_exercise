export interface Traslado {
    _id: string;
    partida: string;
    destino: string;
    transporte: string;
    fecha: string;
    kilometros: number;
    trabajador: string;
    idaVuelta: boolean;
}

export const fetchTraslados = async (): Promise<Traslado[]> => {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${import.meta.env.VITE_URL_API}/traslados`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error al obtener los traslados")
    
    const data = await response.json() as Traslado[]
    return data
}