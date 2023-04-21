
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function LessonNavigation({ anterior=false, actual, user, siguiente=false }){
    const supabase = useSupabaseClient()

    const completarLeccion = async () => {
        const { data } = await supabase.from("lecciones-completadas").select().match({ "idUsuario": user.id, "idLeccion": actual })
        if (data.length == 0) {
            const { error } = await supabase.from("lecciones-completadas").insert({ idLeccion: actual, idUsuario: user.id })
            if (error) {
                console.log(error.message)
            }
        }
    }

    const linkBack = (anterior) ? <Link className="lessonNavigation" href={"/lecciones/"+anterior}>Lección Anterior</Link> : <Link className="lessonNavigation" href={"/lecciones"}>Regresar a Lecciones</Link>
    const linkNext = (siguiente) ? <Link className="lessonNavigation" onClick={completarLeccion} href={"/lecciones/"+siguiente}>Siguiente Lección</Link> : <Link className="lessonNavigation" onClick={completarLeccion} href={"/lecciones"}>Regresar a Lecciones</Link>

    return (
        <div className="flex flex-row justify-between px-20">
            {linkBack}
            {linkNext}
        </div>
    )
}