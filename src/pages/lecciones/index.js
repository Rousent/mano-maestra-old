
import Navigation from "@/components/Navigation"
import LessonContainer from "@/components/LessonContainer"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function LessonsPage({ initialSession, user, lecciones }) {
    return (
        <>
        <Navigation session={initialSession}/>
        <div className="flex flex-col gap-20 py-20 px-40">
            <div className="flex flex-col gap-4">
                <h1 className="text-center">Titulo jijhikjhoijnoijhikjhnkjhkuhikjnlkho</h1>
                <h2 className="text-center">Subtitulo okjhgkjfkhvkjnokjmnkhgkhjblk</h2>
            </div>
            <div className="flex flex-row w-fit self-center gap-10 justify-center">
                <Contenido lecciones={lecciones} user={user}/>
                <div className="flex flex-col p-10 rounded-lg bg-naranja w-fit h-fit">
                    <h4 className="text-center font-medium mb-2">Yo:</h4>
                    <div className="flex flex-col gap-2">
                        <div className="ficha bg-fondo">{user.nombres} {user.apellidoPaterno} {user.apellidoMaterno}</div>
                        <div className="ficha bg-fondo">{user.rol}</div>
                        <div className="ficha bg-fondo">{user.nivel}</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function Contenido({ lecciones, user }) {
    return (
        <div className="flex flex-col shrink-0 max-w-5xl w-full min-w-fit min-h-fit gap-4">
            <LessonContainer indice={1} user={user} nivel={"Nivel Basico"} lecciones={lecciones.basico} />
            <LessonContainer indice={2} user={user} nivel={"Nivel Intermedio"} lecciones={lecciones.intermedio} />
            <LessonContainer indice={3} user={user} nivel={"Nivel Avanzado"} lecciones={lecciones.avanzado} />
            <LessonContainer indice={1} user={user} nivel={"LSM Orientado a Empresas"} lecciones={lecciones.empresas} />
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
        const { data } = await supabase.from("perfiles").select().eq("idUsuario", session.user.id)
        const response = data[0]
        const rol = await supabase.from("roles").select("descripcion").eq("idRol", response.idRol)
        const rolResponse = rol.data[0]
        const userObject = {
            idUsuario: session.user.id,
            nombres: response.nombres,
            apellidoPaterno: response.apellidoPaterno,
            apellidoMaterno: response.apellidoMaterno,
            email: session.user.email,
            idRol: response.idRol,
            rol: rolResponse.descripcion,
            valorNivel: null,
            nivel: null
        }
        if (response.idRol == 2||response.idRol == 3||response.idRol == 4) {
            const { data } = await supabase.from("estudiantes").select("idNivel, niveles (descripcion)").eq("idUsuario", session.user.id)
            userObject.valorNivel = data[0].idNivel
            userObject.nivel = data[0].niveles.descripcion
        }
        //

        // Obtener las lecciones
        const lecciones = await supabase.from("lecciones").select()
        const completadas = await supabase.from("lecciones-completadas").select().eq("idUsuario", session.user.id)
        lecciones.data.forEach((leccion) => {
            Object.assign(leccion, { done: false })
        })
        completadas.data.forEach((lecCompletada) => {
            lecciones.data.forEach((leccion) => {
                if (lecCompletada.idLeccion == leccion.idLeccion) {
                    leccion.done = true
                }
            })
        })
        const basico = lecciones.data.filter(leccion => leccion.idNivel == 1)
        basico.sort((x, y) => x.titulo.localeCompare(y.titulo))
        const intermedio = lecciones.data.filter(leccion => leccion.idNivel == 2)
        intermedio.sort((x, y) => x.titulo.localeCompare(y.titulo))
        const avanzado = lecciones.data.filter(leccion => leccion.idNivel == 3)
        avanzado.sort((x, y) => x.titulo.localeCompare(y.titulo))
        const empresas = lecciones.data.filter(leccion => leccion.idNivel == 4)
        empresas.sort((x, y) => x.titulo.localeCompare(y.titulo))
        const lista = {basico, intermedio, avanzado, empresas}
        //

        return { props: { initialSession: session, user: userObject, lecciones: lista } }
    }
}