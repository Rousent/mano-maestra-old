
import { useRouter } from "next/router"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState, useEffect } from "react"

export default function set() {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const [newPassword, setNewPassword] = useState()
    const [confirm, setConfirm] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword && confirm && newPassword == confirm) {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) {
                alert(error.message)
            } else {
                alert("Contraseña guardada exitosamente")
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
        let type, token;
        for (const [key, value] of hashArr) {
            if (key === "access_token") {
                token = value
            }
            if (key === "type") {
                type = value
            }
        }
        if (token && type === "signup") {
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
        <div className="w-full h-full bg-sign_languaje bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <form onSubmit={handleSubmit} className="w-form-thin">
                    <h2 className="text-center">Establezca su contraseña contraseña</h2>
                    <div className="text-center">Usuario Empresarial o Experto, introduzca su contraseña con la que accedera al sistema a partir de ahora.</div>
                    <div>
                        <label htmlFor="password">Inserte contraseña</label>
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