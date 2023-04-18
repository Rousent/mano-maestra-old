
import Link from "next/link"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect } from "react"

export default function Standby( initialSession, user ){
    const supabase = useSupabaseClient()

    const createProfile = async () => {
        if (initialSession) {
            const { error } = await supabase.from("perfiles").insert({
                idUsuario: user.id,
                nombres: user.user_metadata.nombres,
                apellidoPaterno: user.user_metadata.apellidoPaterno,
                apellidoMaterno: user.user_metadata.apellidoMaterno,
                idRol: user.user_metadata.idRol,
            })
            const result = await supabase.from("estudiantes").insert({
                idUsuario: user.id,
                idNivel: 1,
            })
            if (error) {
                alert(error.message)
            } else if (result.error.message) {
                alert(result.error.message)
            } else {
                alert("Usuario registrado con exito")
            }
        } else {
            alert("Hubo un error con la autenticación de su correo")
        }
    }
    
    useEffect(() => {
        createProfile()
    },[])

    return (
        <div className="fondoForms">
            <div className="backdropFondo">
                <div className="divFormLike formDelgado">
                    <h2 className="textCenter">Cuenta creada</h2>
                    <div className="textCenter">Su perfil ha sido completado, ya puede acceder a las funciones del sistema.</div>
                    <Link href={"/"} className="textCenter">Regresar a la pagina principal</Link>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
        const { data } = await supabase.from("perfiles").select().eq("idUsuario", session.user.id)
        if (data.length == 0) {
            return { props: { initialSession: session, user: session.user } }
        } else {
            return { redirect: { destination: '/', permanent: false, },}
        }
    } else {
        return { props: { initialSession: false, user: false } }
    }
}