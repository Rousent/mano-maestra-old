
import { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/router"

export default function request() {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const [email,setEmail] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) {
            alert(error.message)
        } else {
            alert("Correo enviado")
        }
    }

    return (
        <div className="w-full h-full bg-placeholder bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <form onSubmit={handleSubmit} className="w-form-thin">
                    <h2 className="text-center">Recuperar cuenta</h2>
                    <div className="text-center">Se enviara un correo con un enlace de recuperación a la dirección de correo electronico que inserte a continuación:</div>
                    <div>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input id="email" type="email" placeholder="Ej. nombre@correo.com"  onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="text-center">Si no recibe el correo de recuperación, revise en la sección de spam y correo no deseado.</div>
                    <button className="bg-azul">Enviar</button>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    } else {
        return { props: { initialSession: false } }
    }
}