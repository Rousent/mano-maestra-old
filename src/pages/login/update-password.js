import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/router"

export default function recovery({ initialSession }) {
    const router = useRouter()
    const supabase = useSupabaseClient()

    const [newPassword, setNewPassword] = useState()
    const [confirm, setConfirm] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword && confirm && newPassword == confirm) {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) {
                alert(error.message)
            } else {
                router.push("/login")
            }
        } else {
            alert("algo estas haciendo mal wey")
        }
    }

    return (
        <div className="w-full h-full bg-placeholder bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <form onSubmit={handleSubmit} className="w-form-thin">
                    <h2 className="text-center">Cambiar contraseña</h2>
                    <div className="text-center">Se enviara un correo con un enlace de recuperación a la dirección de correo electronico que inserte a continuación</div>
                    <div>
                        <label htmlFor="password">Nueva contraseña</label>
                        <input id="password" type="password" placeholder="La nueva contraseña" onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor="confirm">Confirmar contraseña</label>
                        <input id="confirm" type="password" placeholder="Repetir nueva contraseña" onChange={(e) => setConfirm(e.target.value)}/>
                    </div>
                    <button className="bg-azul">Enviar</button>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    } else {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                return { props: { initialSession: session } }
            }
        })
        return { props: { initialSession: session } }
    }
}