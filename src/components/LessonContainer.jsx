
import Lesson from "./Lesson"
import { useState } from "react"
import { FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { BsCheckCircle } from "react-icons/bs"

export default function LessonContainer({ nivel, lecciones, indice, user, percentage }) {

    const [open, setOpen] = useState(false)

    const desbloqueado = (indice <= user.valorNivel) ? true : false
    const icono = (percentage == 100) ? <BsCheckCircle className="w-10 h-10 mr-4"/> : (!desbloqueado) ? <FaLock className="w-8 h-8 mr-4"/> : (open) ? <FaChevronUp className="w-8 h-8 mr-4"/> : <FaChevronDown className="w-8 h-8 mr-4"/>
    const lessons = (lecciones.length > 0) ? lecciones.map((leccion) => (<Lesson idLeccion={leccion.idLeccion} titulo={leccion.titulo} done={leccion.done}/>)) : <div className="text-center">Ups, no hay nada aqui todavia...</div>
    const contenido = (open) ? lessons : null
    const porcentaje = (percentage == 100) ? "(Completado)" : (percentage >= 0) ? ("("+percentage+"% completado)") : null

    const handleClick = () => {
        if (desbloqueado) {
            setOpen(!open)
        }
    }

    return (
        <div onClick={handleClick} className="flex flex-col p-6 bg-naranja rounded-3xl hover:cursor-pointer">
            <div className="flex flex-row justify-between items-center">
                <h3 className="p-4">{nivel} {porcentaje}</h3>
                {icono}
            </div>
            <div className="flex flex-col gap-4">
                {contenido}
            </div>
        </div>
    )
}