
import Lesson from "./Lesson"
import { useState } from "react"

export default function LessonContainer({ nivel, lecciones }) {

    const [open, setOpen] = useState(false)

    const lessons = lecciones.map((leccion) => (<Lesson idLeccion={leccion.idLeccion} titulo={leccion.titulo} done={leccion.done}/>))
    const contenido = (open) ? lessons : null

    return (
        <div onClick={() => setOpen(!open)} className="flexCol contenedorLecciones gap1">
            <h3>{nivel}</h3>
            <div className="flexCol gap1">
                {contenido}
            </div>
        </div>
    )
}