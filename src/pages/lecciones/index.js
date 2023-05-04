
import Navigation from "@/components/Navigation"
import LessonContainer from "@/components/LessonContainer"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

export default function LessonsPage({ initialSession, user, lecciones, porcentajes, subir }) {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const subirNivel = async () => {
        const { error } = await supabase.from("estudiantes").update({ id_nivel: (user.valorNivel+1)}).eq("id_usuario", user.id)
        if (error) {
            console.log(error.message)
        } else {
            router.reload()
        }
    }

    const botonSubir = (subir) ? <button id="subirNivel" onClick={subirNivel} className="botonSubirNivel">Subir de nivel</button> : null

    return (
        <>
        <Navigation session={initialSession} aqui={"lecciones"}/>
        <div className="flex flex-col gap-20 py-20 px-40">
            <div className="flex flex-col gap-4">
                <h1 className="text-center">Titulo jijhikjhoijnoijhikjhnkjhkuhikjnlkho</h1>
                <h2 className="text-center">Subtitulo okjhgkjfkhvkjnokjmnkhgkhjblk</h2>
            </div>
            <div className="flex flex-row w-fit self-center gap-10 justify-center">
                <Contenido lecciones={lecciones} user={user} porcentajes={porcentajes}/>
                <div className="flex flex-col p-10 rounded-lg bg-naranja w-fit h-fit">
                    <h4 className="text-center font-medium mb-2">Yo:</h4>
                    <div className="flex flex-col gap-2">
                        <div className="ficha bg-fondo">{user.nombres} {user.apellidoPaterno} {user.apellidoMaterno}</div>
                        <div className="ficha bg-fondo">{user.rol}</div>
                        <div className="ficha bg-fondo">{user.nivel}</div>
                        {botonSubir}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function Contenido({ lecciones, user, porcentajes }) {
    return (
        <div className="flex flex-col shrink-0 max-w-5xl w-full min-w-fit min-h-fit gap-4">
            <LessonContainer indice={1} user={user} nivel={"Nivel Basico"} lecciones={lecciones["Nivel Basico"]} percentage={porcentajes.basico} />
            <LessonContainer indice={2} user={user} nivel={"Nivel Intermedio"} lecciones={lecciones["Nivel Intermedio"]} percentage={porcentajes.intermedio} />
            <LessonContainer indice={3} user={user} nivel={"Nivel Avanzado"} lecciones={lecciones["Nivel Avanzado"]} percentage={porcentajes.avanzado}/>
            <LessonContainer indice={1} user={user} nivel={"LSM Orientado a Empresas"} lecciones={lecciones["LSM Orientado a Empresas"]} percentage={porcentajes.empresas}/>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    } else {
        // Obtener todos los datos del usuario
        const user = await supabase.rpc("get_full_user")
        //

        if (user.data.rol === "Administrador") return { redirect: { destination: "/admin", permanent: false, } }

        // Obtener las lecciones
        const lecciones = await supabase.rpc("get_lessons")
        const basico = lecciones.data["Nivel Basico"]
        const intermedio = lecciones.data["Nivel Intermedio"]
        const avanzado = lecciones.data["Nivel Avanzado"]
        const empresas = lecciones.data["LSM Orientado a Empresas"]
        //

        // Obtener porcentaje de completado por cada nivel
        let porcentajes = { basico: -1, intermedio: -1, avanzado: -1, empresas: -1 }
        if (user.data.valorNivel >= 1 && basico){
            porcentajes.basico = (basico.filter(leccion => leccion.done == true).length*100) / basico.length
        }
        if (user.data.valorNivel >= 2 && intermedio){
            porcentajes.intermedio = (intermedio.filter(leccion => leccion.done == true).length*100) / intermedio.length
        }
        if (user.data.valorNivel >= 3 && avanzado){
            porcentajes.avanzado = (avanzado.filter(leccion => leccion.done == true).length*100) / avanzado.length
        }
        if (user.data.valorNivel >= 1 && empresas){
            porcentajes.empresas = (empresas.filter(leccion => leccion.done == true).length*100) / empresas.length
        }

        /**
         * La variable subir determina si el estudiante
         * esta listo para subir de nivel.
         * 
         * Revisa si ha completado todas las lecciones del nivel actual:
         * regresa false si no, y true si si.
         * 
         * El criterio para subir de nivel podria variar en proximas versiones.
         * */
        let subir = null
        switch (user.data.valorNivel) {
            case 1:
                if (porcentajes.basico == 100) {
                    subir = true
                }
                break;
            case 2:
                if (porcentajes.intermedio == 100) {
                    subir = true
                }
                break;
        }
        return { props: { initialSession: session, user: user.data, lecciones: lecciones.data, porcentajes, subir } }
    }
}