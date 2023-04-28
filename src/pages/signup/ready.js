
import Link from "next/link"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"

import { crearPerfil } from "../../utilities/methods"

export default function Standby(){
    
    useEffect(() => {
        const mensaje = crearPerfil()
        alert(mensaje)
    },[])

    return (
        <div className="fondoForms">
            <div className="backdropFondo">
                <div className="divFormLike fondo formDelgado">
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
            return { props: { user: session.user } }
        } else {
            return { redirect: { destination: '/', permanent: false, },}
        }
    } else {
        return null
    }
}