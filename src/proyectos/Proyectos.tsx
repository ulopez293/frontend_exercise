import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchProyectos } from "../fetch/fetchProyectos"
import { saveProyecto } from "../mutations/saveProyecto"
import { deleteProyecto } from "../mutations/deleteProyecto"
import { updateProyecto } from "../mutations/updateProyecto"
import { fetchClientes } from "../fetch/fetchClientes"

const initialForm = {
    nombre: "",
    descripcion: "",
    estado: "",
    fecha_inicio: "",
    fecha_entrega: "",
    cliente_id: ""
}
export type InitialFormType = typeof initialForm

export const Proyectos = () => {
    const [isEditMode, setIsEditMode] = useState(false)
    const [actualID, setActualID] = useState("")
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState(initialForm)
    const [filtro, setFiltro] = useState("")

    const { data: proyectos = [], isLoading, isError, error } = useQuery({
        queryKey: ["proyectos"],
        queryFn: fetchProyectos,
    })

    const { data: clientes = []} = useQuery({
        queryKey: ["clientes"],
        queryFn: fetchClientes,
    })


    const proyectosFiltrados = proyectos
    .filter(proyecto => 
      proyecto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      proyecto.estado.toLowerCase().includes(filtro.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
      proyecto.cliente_id.toLowerCase().includes(filtro.toLowerCase())
    )

    const mutation = useMutation({
        mutationFn: saveProyecto,
        onSuccess: () => {
            alert("proyecto guardado con éxito")
            setFormData(initialForm)
            void queryClient.invalidateQueries({ queryKey: ["proyectos"] })
        },
        onError: (error) => {
            console.error("Error al guardar el proyecto:", error)
            alert("Hubo un error al guardar el proyecto")
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProyecto,
        onSuccess: () => {
            alert("proyecto eliminado con éxito");
            void queryClient.invalidateQueries({ queryKey: ["proyectos"] })
        },
        onError: (error) => {
            console.error("Error al eliminar el proyecto:", error)
            alert("Hubo un error al eliminar el proyecto")
        },
    })

    const mutationUpdate = useMutation({
        mutationFn: updateProyecto,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["proyectos"] })
            setIsEditMode(false)
            setFormData(initialForm)
            setActualID("")
            alert("Proyecto actualizado con éxito")
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
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
                descripcion: formData.descripcion,
                estado: formData.estado,
                fecha_inicio: formData.fecha_inicio,
                fecha_entrega: formData.fecha_entrega,
                cliente_id: formData.cliente_id,
            })
            return
        }
        mutation.mutate(formData)
    }


    const handleEdit = (_id: string) => {
        setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, 10)
        setIsEditMode(true)
        setActualID(_id)
        const proyectoSeleccionado = proyectos.find((t) => t._id === _id)

        if (proyectoSeleccionado) {
            setFormData({
                nombre: proyectoSeleccionado.nombre,
                descripcion: proyectoSeleccionado.descripcion,
                estado: proyectoSeleccionado.estado,
                fecha_inicio: proyectoSeleccionado.fecha_inicio ? proyectoSeleccionado.fecha_inicio.split("T")[0] : "",
                fecha_entrega: proyectoSeleccionado.fecha_entrega ? proyectoSeleccionado.fecha_entrega.split("T")[0] : "",
                cliente_id: proyectoSeleccionado.cliente_id
            })
        }
    }

    if (isLoading) return <p>Cargando proyectos...</p>
    if (isError) return <p className="text-red-500">Error: {error instanceof Error ? error.message : "Error desconocido"}</p>

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-5">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 mb-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Proyecto</h2>

                <label className="block mb-2">Nombre</label>
                <input type="text" minLength={4} name="nombre" value={formData.nombre} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Descripcion</label>
                <input type="text" minLength={4} name="descripcion" value={formData.descripcion} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Estado</label>
                <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                >
                    <option value="">Seleccione...</option>
                    <option value="pendiente">pendiente</option>
                    <option value="progreso">progreso</option>
                    <option value="completado">completado</option>
                </select>
                
                <label className="block mb-2">Fecha Inicio</label>
                <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Fecha Entrega</label>
                <input type="date" name="fecha_entrega" value={formData.fecha_entrega} onChange={handleChange}
                    className="w-full p-2 border rounded mb-3" required />

                <label className="block mb-2">Cliente</label>
                <select
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                >
                    <option value="">Seleccione...</option>
                    {clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>
                            {cliente.nombre}
                        </option>
                    ))}
                </select>

                {
                    isEditMode ?
                        <button type="submit"
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Editando..." : "Editar Proyecto"}
                        </button>
                        :
                        <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            disabled={mutation.isPending}>
                            {mutation.isPending ? "Guardando..." : "Guardar Proyecto"}
                        </button>
                }
            </form>

            {/* Listado */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-2xl mx-auto mb-6">
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">Lista de Proyectos</h2>
                    {/* Input de Filtrado */}
                    <input
                        type="text"
                        placeholder="Filtrar por nombre, estado, descripcion o cliente id..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                    />
                    {isLoading && <p className="text-center">Cargando proyectos...</p>}
                    {isError && <p className="text-center text-red-500">Error al cargar proyectos</p>}
                    {!isLoading && !isError && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-200 text-xs sm:text-sm">
                                        <th className="border p-2">nombre</th>
                                        <th className="border p-2">descripcion</th>
                                        <th className="border p-2">estado</th>
                                        <th className="border p-2">fecha_inicio</th>
                                        <th className="border p-2">fecha_entrega</th>
                                        <th className="border p-2">cliente_id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyectosFiltrados.map((proyecto, index) => {
                                        return (
                                            <tr key={proyecto._id ?? index} className="text-center">
                                                <td className="border p-2">{proyecto.nombre}</td>
                                                <td className="border p-2">{proyecto.descripcion}</td>
                                                <td className="border p-2">{proyecto.estado}</td>
                                                <td className="border p-2">{proyecto.fecha_inicio}</td>
                                                <td className="border p-2">{proyecto.fecha_entrega}</td>
                                                <td className="border p-2">{proyecto.cliente_id}</td>
                                                <td className="border p-2 flex flex-col sm:flex-row gap-2">
                                                    <button
                                                        onClick={() => handleDelete(proyecto._id)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 w-full sm:w-auto"
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(proyecto._id)}
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
