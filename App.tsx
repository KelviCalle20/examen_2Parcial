import { FaEye, FaTrash } from "react-icons/fa";
import { Accion, Columna, DataTable, EstadoPill } from "./components/DataTable.js";
import { FaPencil } from "react-icons/fa6";
import { useState, useEffect } from "react";

export type FilaTarea = {
  empleado: string;     
  imagen: string;         
  idTarea: string;
  tarea: string;
  inicio: string;
  fin: string;
  conteo: number;
  estado: string;
  colorEstado: "verde" | "amarillo" | "rojo" | "azul" | "gris";
};

export default function App() {
  const [datos, setDatos] = useState<FilaTarea[]>([]);

  const columnas: Array<Columna<FilaTarea>> = [
    {
      key: "empleado",
      encabezado: "Personaje",
      ordenable: true,
      ancho: "25%",
      render: (fila) => (
        <div className="flex items-center gap-3">
          <img
            src={fila.imagen}
            alt={fila.empleado}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <span className="font-medium text-slate-800">{fila.empleado}</span>
        </div>
      ),
    },
    { key: "tarea", encabezado: "Especie", ordenable: true },
    { key: "inicio", encabezado: "Género", ordenable: true },
    { key: "fin", encabezado: "Origen", ordenable: true },
    { key: "conteo", encabezado: "Ubicacion", ordenable: true, alineacion: "center" },
    {
      key: "estado",
      encabezado: "Estado",
      ordenable: true,
      render: (fila) => <EstadoPill etiqueta={fila.estado} color={fila.colorEstado} />,
    },
  ];

  const acciones: Array<Accion<FilaTarea>> = [
    { etiqueta: "Ver", icono: <FaEye size={16} />, onClick: (fila) => alert(JSON.stringify(fila, null, 2)) },
    { etiqueta: "Editar", icono: <FaPencil size={16} />, onClick: (fila) => alert(`Editar: ${fila.empleado}`) },
    { etiqueta: "Eliminar", icono: <FaTrash size={16} />, onClick: (fila) => alert(`Eliminar: ${fila.empleado}`) },
  ];

  const filtros = (
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
        Fuente: Rick and Morty API
      </span>
    </div>
  );

  useEffect(() => {
  fetch("https://rickandmortyapi.com/api/character")
    .then((res) => res.json())
    .then((data) => {
      const personajes = data.results.map((p: any) => ({
        empleado: p.name,
        imagen: p.image,
        //idTarea: p.id.toString(),
        tarea: p.species,
        inicio: p.gender,
        fin: p.origin.name,
        conteo: p.location.name,
        estado: p.status,
        colorEstado:
          p.status === "Alive"
            ? "verde"
            : p.status === "Dead"
              ? "rojo"
              : "gris",
      }));
      setDatos(personajes);
    })
    .catch((err) => console.error("Error al obtener personajes:", err));
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Personajes de Rick and Morty</h1>
      <DataTable<FilaTarea>
        columnas={columnas}
        datos={datos}
        acciones={acciones}
        filtrosUI={filtros}
        ordenInicial={{ key: "empleado", direccion: "asc" }}
        opcionesTamPagina={[5, 10, 20]}
      />
    </div>
  );
}

