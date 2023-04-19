
import Navigation from "@/components/Navigation"
import Lesson from "@/components/Lesson"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function LessonsPage({ initialSession, user }) {
    return (
        <>
        <Navigation session={initialSession}/>
        <div className="flexCol gap5 p40">
            <div className="flexCol gap1">
                <h1>Titulo jijhikjhoijnoijhikjhnkjhkuhikjnlkho</h1>
                <h2>Subtitulo okjhgkjfkhvkjnokjmnkhgkhjblk</h2>
            </div>
            <div className="flexRow gap15 center">
                <div className="gap1 contenedorLecciones">
                    <Lesson titulo={"Hola"}/>
                    <Lesson titulo={"Hola"}/>
                </div>
                <div className="progreso naranja">
                    <h4 className="textCenter">Mi progreso</h4>
                </div>
            </div>
        </div>
        </>
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
        return { props: { initialSession: session, user: userObject } }
    }
}