
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

export default function Done({ actual, user }) {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const completarLeccion = async () => {
        const { error } = await supabase.from("lecciones_completadas").insert({ id_leccion: actual, id_usuario: user.id })
        if (error) {
            alert(error.message)
        }
        router.push("/lecciones")
    }

    return <button className="bg-azul hover:bg-yellow-400" onClick={completarLeccion}>Terminar Lección</button>
}