
import Link from "next/link"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect } from "react"
import {useRouter } from "next/router"

export default function Standby(){
    const supabase = useSupabaseClient()
    const router = useRouter()

    const createProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
            const { data } = await supabase.from("perfiles").select().eq("id_usuario",session.user.id)
            if (data.length == 0) {
                const { error } = await supabase.from("perfiles").insert({
                    id_usuario: session.user.id,
                    nombres: session.user.user_metadata.nombres,
                    apellido_paterno: session.user.user_metadata.apellidoPaterno,
                    apellido_materno: session.user.user_metadata.apellidoMaterno,
                    id_rol: session.user.user_metadata.idRol,
                })
                const result = await supabase.from("estudiantes").insert({
                    id_usuario: session.user.id,
                    id_nivel: 1,
                })
                if (error) {
                    console.log(error)
                } else if (result.error) {
                    console.log(result.error)
                } else {
                    alert("Usuario registrado con exito")
                }
            } else {
                router.push("/")
            }
        } else {
            alert("Hubo un error con la autenticación de su correo")
        }
    }
    
    useEffect(() => {
        createProfile()
    },[])

    return (
        <div className="w-full h-full bg-placeholder bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <div className="h-fit flex flex-col gap-6 bg-fondo rounded-lg p-10 w-form">
                    <h2 className="text-center">Cuenta creada</h2>
                    <div className="text-center">Su perfil ha sido completado, ya puede acceder a las funciones del sistema.</div>
                    <Link href={"/"} className="text-center">Regresar a la pagina principal</Link>
                </div>
            </div>
        </div>
    )
}