
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function LessonNavigation({ anterior=false, actual, user, siguiente=false }){
    const supabase = useSupabaseClient()

    const completarLeccion = async () => {
        const { data } = await supabase.from("lecciones_completadas").select().match({ "id_usuario": user.id, "id_leccion": actual })
        if (data.length == 0) {
            const { error } = await supabase.from("lecciones_completadas").insert({ id_leccion: actual, id_usuario: user.id })
            if (error) {
                alert(error.message)
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