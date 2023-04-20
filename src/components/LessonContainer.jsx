
import Lesson from "./Lesson"
import { useState } from "react"
import { FaLock } from "react-icons/fa"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function LessonContainer({ nivel, lecciones, indice, user }) {

    const [open, setOpen] = useState(false)

    const desbloqueado = (indice <= user.valorNivel) ? true : false
    const icono = (!desbloqueado) ? <FaLock className="iconoNivel"/> : (open) ? <FaChevronUp className="iconoNivel"/> : <FaChevronDown className="iconoNivel"/>
    const lessons = lecciones.map((leccion) => (<Lesson idLeccion={leccion.idLeccion} titulo={leccion.titulo} done={leccion.done}/>))
    const contenido = (open) ? lessons : null

    const handleClick = () => {
        if (desbloqueado) {
            setOpen(!open)
        }
    }

    return (
        <div onClick={handleClick} className="flexCol contenedorLecciones">
            <div className="flexRow justifyBetween itemsCenter">
                <h3 className="p1">{nivel}</h3>
                {icono}
            </div>
            <div className="flexCol gap1">
                {contenido}
            </div>
        </div>
    )
}