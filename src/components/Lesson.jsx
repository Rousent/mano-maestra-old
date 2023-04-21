
import Link from "next/link"
import { BsFillPlayFill, BsCheckCircle } from "react-icons/bs"

export default function Lesson({ idLeccion, titulo, done }) {

    const icono = (done) ? <BsCheckCircle className="w-7 h-7"/> : <BsFillPlayFill className="w-10 h-10"/>

    return (
        <Link href={"/lecciones/"+idLeccion} className="flex flex-row justify-between h-fit items-center rounded-3xl py-1 pl-8 pr-4 bg-fondo">
            <h4>Lección {titulo}</h4>
            {icono}
        </Link>
    )
}