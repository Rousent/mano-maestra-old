
import Navigation from "./Navigation"
import LessonNavigation from "./LessonNavigation"
import Done from "./Done"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"

export default function LessonPageTemplate({ initialSession, user, titulo, actual, anterior, siguiente, children }) {
    const supabase = useSupabaseClient()

    const [terminar, setTerminar] = useState(null)

    const onInit = async () => {
        const { data } = await supabase.from("lecciones_completadas").select().match({ "id_usuario": user.id, "id_leccion": actual })
        if (data.length == 0) {
            setTerminar(<Done actual={actual} user={user}/>)
        }
    }

    useEffect(() => {
        onInit()
    },[])

    return (
        <>
        <Navigation session={initialSession} aqui={"lecciones"} leccion={titulo}/>
        <div className="flex flex-col p-40 gap-4">
            <LessonNavigation anterior={anterior} siguiente={siguiente}/>
            <div className="flex flex-col p-20 rounded-3xl bg-blanco shadow-2xl gap-4">
                {children}
                {terminar}
            </div>
            <LessonNavigation anterior={anterior} siguiente={siguiente}/>
        </div>
        </>
    )
}