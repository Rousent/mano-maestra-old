
import Lesson from "./Lesson"
import { useState } from "react"
import { FaLock } from "react-icons/fa"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function LessonContainer({ nivel, lecciones, indice, user }) {

    const [open, setOpen] = useState(false)

    const desbloqueado = (indice <= user.valorNivel) ? true : false
    const icono = (!desbloqueado) ? <FaLock className="w-8 h-8 mr-4"/> : (open) ? <FaChevronUp className="w-8 h-8 mr-4"/> : <FaChevronDown className="w-8 h-8 mr-4"/>
    const lessons = lecciones.map((leccion) => (<Lesson idLeccion={leccion.idLeccion} titulo={leccion.titulo} done={leccion.done}/>))
    const contenido = (open) ? lessons : null

    const handleClick = () => {
        if (desbloqueado) {
            setOpen(!open)
        }
    }

    return (
        <div onClick={handleClick} className="flex flex-col p-6 bg-naranja rounded-3xl hover:cursor-pointer">
            <div className="flex flex-row justify-between items-center">
                <h3 className="p-4">{nivel}</h3>
                {icono}
            </div>
            <div className="flex flex-col gap-4">
                {contenido}
            </div>
        </div>
    )
}