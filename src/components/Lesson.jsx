
import Link from "next/link"
import { BsFillPlayFill, BsCheckCircleFill } from "react-icons/bs"

export default function Lesson({ idLeccion, titulo, done }) {

    const icono = (done) ? <BsCheckCircleFill className="icoLec"/> : <BsFillPlayFill className="iconoLeccion"/>

    return (
        <Link href={"/lecciones/"+idLeccion} className="flexRow justifyBetween leccion">
            <h4>Lección {titulo}</h4>
            {icono}
        </Link>
    )
}