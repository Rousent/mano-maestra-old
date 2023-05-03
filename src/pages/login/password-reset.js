import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function recovery() {
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
                alert("Cambio de contraseña exitoso")
                await supabase.auth.signOut()
                router.push("/login")
            }
        } else {
            alert("Las contraseñas no concuerdan.")
        }
    }

    const onInit = async () => {
        const hash = window.location.hash
        const hashArr = hash.substring(1).split("&").map((param) => param.split("="))
        let type;
        for (const [key, value] of hashArr) {
            if (key === "type") {
                type = value
            }
        }
        if (type === "recovery") {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push("/login")
            }
        } else {
            router.push("/login")
        }
    }

    useEffect(() => {
        onInit()
    },[])

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

    if (session) return { redirect: { destination: "/", permanent: false } }

    return { props: {} }
}