
import Navigation from "@/components/Navigation"
import LessonContainer from "@/components/LessonContainer"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { getFullUser, getLecciones, getPorcentajes, subirNivel } from "../../utilities/methods"

export default function LessonsPage({ initialSession, user, lecciones, done, subir }) {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const handleClick = async () => {
        const error = subirNivel(user)
        if (error) {
            console.log(error.message)
        } else {
            router.reload()
        }
    }

    const botonSubir = (subir) ? <button onClick={handleClick} className="botonSubirNivel">Subir de nivel</button> : null

    return (
        <>
        <Navigation session={initialSession} aqui={"lecciones"}/>
        <div className="flex flex-col gap-20 py-20 px-40">
            <div className="flex flex-col gap-4">
                <h1 className="text-center">Titulo jijhikjhoijnoijhikjhnkjhkuhikjnlkho</h1>
                <h2 className="text-center">Subtitulo okjhgkjfkhvkjnokjmnkhgkhjblk</h2>
            </div>
            <div className="flex flex-row w-fit self-center gap-10 justify-center">
                <Contenido lecciones={lecciones} user={user} done={done}/>
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

function Contenido({ lecciones, user, done }) {
    return (
        <div className="flex flex-col shrink-0 max-w-5xl w-full min-w-fit min-h-fit gap-4">
            <LessonContainer indice={1} user={user} nivel={"Nivel Basico"} lecciones={lecciones.basico} percentage={done.basico} />
            <LessonContainer indice={2} user={user} nivel={"Nivel Intermedio"} lecciones={lecciones.intermedio} percentage={done.intermedio} />
            <LessonContainer indice={3} user={user} nivel={"Nivel Avanzado"} lecciones={lecciones.avanzado} percentage={done.avanzado}/>
            <LessonContainer indice={1} user={user} nivel={"LSM Orientado a Empresas"} lecciones={lecciones.empresas} percentage={done.empresas}/>
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
        const user = getFullUser()
        //

        // Obtener las lecciones
        const lecciones = getLecciones(user)
        //

        // Obtener porcentaje de completado por cada nivel
        const porcentajes = getPorcentajes(lecciones)
        //

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
        switch (user.valorNivel) {
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
        console.log(user.valorNivel)
        console.log(subir)
        return { props: { initialSession: session, user: user, lecciones: lecciones, done: porcentajes, subir } }
    }
}