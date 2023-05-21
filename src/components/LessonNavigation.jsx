
import Link from "next/link"

export default function LessonNavigation({ anterior=null, siguiente=null }){

    const linkBack = (anterior) ? <Link className="lessonNavigation" href={"/lecciones/"+anterior}>Lección Anterior</Link> : <Link className="lessonNavigation" href={"/lecciones"}>Regresar a Lecciones</Link>
    const linkNext = (siguiente) ? <Link className="lessonNavigation" href={"/lecciones/"+siguiente}>Siguiente Lección</Link> : <Link className="lessonNavigation" href={"/lecciones"}>Regresar a Lecciones</Link>

    return (
        <div className="flex flex-row justify-between px-20">
            {linkBack}
            {linkNext}
        </div>
    )
}