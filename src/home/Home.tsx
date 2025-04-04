import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { saveCliente } from "../mutations/saveCliente"
import { userDataAtom } from "../atoms/userDataAtom"
import { useAtom } from "jotai"
import { fetchClientes } from "../fetch/fetchClientes"
import { updateCliente } from "../mutations/updateCliente"
import { deleteCliente } from "../mutations/deleteCliente"

const initialForm = {
    nombre: "",
    email: "",
    telefono: "",
    id_usuario: ""
}
export type InitialFormType = typeof initialForm

export const Home = () => {
    const [userData,] = useAtom(userDataAtom)
    const [isEditMode, setIsEditMode] = useState(false)
    const [actualID, setActualID] = useState("")
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState(initialForm)
    const [filtro, setFiltro] = useState("")

    const { data: clientes = [], isLoading, isError, error } = useQuery({
        queryKey: ["clientes"],
        queryFn: fetchClientes,
    })


    const clientesFiltrados = clientes
    .filter(cliente => cliente.user_id === userData.id) // Solo los clientes del usuario actual
    .filter(cliente => 
      cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.telefono.toLowerCase().includes(filtro.toLowerCase())
    )

    const mutation = useMutation({
        mutationFn: saveCliente,
        onSuccess: () => {
            alert("Cliete guardado con éxito")
            setFormData(initialForm)
            void queryClient.invalidateQueries({ queryKey: ["clientes"] })
        },
        onError: (error) => {
            console.error("Error al guardar el cliente:", error)
            alert("Hubo un error al guardar el cliente")
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCliente,
        onSuccess: () => {
            alert("cliente eliminado con éxito");
            void queryClient.invalidateQueries({ queryKey: ["clientes"] })
        },
        onError: (error) => {
            console.error("Error al eliminar el cliente:", error)
            alert("Hubo un error al eliminar el cliente")
        },
    })

    const mutationUpdate = useMutation({
        mutationFn: updateCliente,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["clientes"] })
            setIsEditMode(false)
            setFormData(initialForm)
            setActualID("")
            alert("Cliente actualizado con éxito")
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            id_usuario: userData.id ?? "",
            [target.name]: target.type === "checkbox" ? target.checked : target.value,
        }))
    }

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEditMode) {
            mutationUpdate.mutate({
                _id: actualID,
                nombre: formData.nombre,
                correo: formData.email,
                telefono: formData.telefono,
                user_id: "",
            })
            return
        }
        mutation.mutate(formData)
    }


    const handleEdit = (_id: string) => {
        setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, 10)
        setIsEditMode(true)
        setActualID(_id)
        const clienteSeleccionado = clientes.find((t) => t._id === _id)

        if (clienteSeleccionado) {
            setFormData({
                nombre: clienteSeleccionado.nombre,
                email: clienteSeleccionado.correo,
                telefono: clienteSeleccionado.telefono,
                id_usuario: clienteSeleccionado.user_id
            })
        }
    }

    if (isLoading) return <p>Cargando clientes...</p>
    if (isError) return <p className="text-red-500">Error: {error instanceof Error ? error.message : "Error desconocido"}</p>

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-5">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 mb-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Cliente</h2>

                <label className="block mb-2">Nombre</label>
                <input type="text" minLength={4} name="nombre" value={formData.nombre} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Correo electrónico</label>
                <input type="email" placeholder="example@gmail.com" name="email" value={formData.email} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Telefono</label>
                <input type="text" minLength={10} name="telefono" value={formData.telefono} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required  pattern="[0-9]*" />

                {
                    isEditMode ?
                        <button type="submit"
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Editando..." : "Editar Cliente"}
                        </button>
                        :
                        <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Guardando..." : "Guardar Cliente"}
                        </button>
                }
            </form>

            {/* Listado */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-2xl mx-auto mb-6">
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">Lista de Clientes</h2>
                    {/* Input de Filtrado */}
                    <input
                        type="text"
                        placeholder="Filtrar por nombre, correo o telefono..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                    />
                    {isLoading && <p className="text-center">Cargando clientes...</p>}
                    {isError && <p className="text-center text-red-500">Error al cargar clientes</p>}
                    {!isLoading && !isError && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-200 text-xs sm:text-sm">
                                        <th className="border p-2">ID Cliente</th>
                                        <th className="border p-2">nombre</th>
                                        <th className="border p-2">correo</th>
                                        <th className="border p-2">telefono</th>
                                        <th className="border p-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientesFiltrados.filter(cliente => cliente.user_id === userData.id).map((cliente, index) => {
                                        return (
                                            <tr key={cliente._id ?? index} className="text-center">
                                                <td className="border p-2">{cliente._id}</td>
                                                <td className="border p-2">{cliente.nombre}</td>
                                                <td className="border p-2">{cliente.correo}</td>
                                                <td className="border p-2">{cliente.telefono}</td>
                                                <td className="border p-2 flex flex-col sm:flex-row gap-2">
                                                    <button
                                                        onClick={() => handleDelete(cliente._id)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(cliente._id)}
                                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 w-full sm:w-auto"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
