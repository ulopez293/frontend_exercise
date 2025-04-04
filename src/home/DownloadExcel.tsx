import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Traslado } from "../fetch/fetchTraslados"
import { emissionFactors } from "../data/emisionData"

export const exportToExcel = (traslados: Traslado[]) => {
    if (!traslados || traslados.length === 0) {
        alert("No hay datos para exportar.")
        return
    }

    const data = traslados.map(traslado => {
        const factor = emissionFactors[traslado.transporte] ?? 0
        const kmTotales = traslado.kilometros * (traslado.idaVuelta ? 2 : 1)
        const huellaCarbono = kmTotales * factor

        return {
            Partida: traslado.partida,
            Destino: traslado.destino,
            Transporte: traslado.transporte,
            Kilómetros: `${traslado.kilometros} km`,
            "Ida y Vuelta": traslado.idaVuelta ? "Sí" : "No",
            Fecha: traslado.fecha,
            Trabajador: traslado.trabajador,
            "Factor de Emisión": `${factor.toFixed(6)} kg CO₂/km`,
            "Huella de Carbono": `${huellaCarbono.toFixed(6)} kg CO₂`
        }
    })

    const totalHuellaCarbono = traslados.reduce((total, traslado) => {
        const factor = emissionFactors[traslado.transporte] ?? 0
        const kmTotales = traslado.kilometros * (traslado.idaVuelta ? 2 : 1)
        return total + kmTotales * factor
    }, 0).toFixed(6)

    data.push({
        Partida: "TOTAL",
        Destino: "",
        Transporte: "",
        Kilómetros: "",
        Fecha: "",
        Trabajador: "",
        "Ida y Vuelta": "",
        "Factor de Emisión": "",
        "Huella de Carbono": `${totalHuellaCarbono} kg CO₂`
    })

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Traslados")

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as Uint8Array
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    saveAs(blob, "traslados.xlsx")
}
