
import { useRouter } from "next/router"
import Link from "next/link"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Login() {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [errores, setErrores] = useState()

    const [boton, setBoton] = useState(<button className="bg-azul">Iniciar Sesión</button>)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrores(null)
        if (email && password) {
            const { error } = await supabase.auth.signInWithPassword({email: email, password: password})
            if (!error) {
                setBoton(<div className="loader"/>)
                router.push("/")
            } else {
                setErrores(error.message)
            }
        } else {
            setErrores("Debes rellenar todos los campos")
        }
    }

    return (
        <div className="w-full h-full bg-placeholder bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <img src="/img/logo.png" className="w-1/3 h-fit"/>
                <form onSubmit={handleSubmit} className="w-form-thin">
                    <h2 className="text-center">Inicio de Sesión</h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="email">Correo electrónico</label>
                            <input id="email" type="email" placeholder="Ej. nombre@correo.com" className="textfield" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" type="password" placeholder="Inserte contraseña" className="textfield" onChange={(e) => setPassword(e.target.value)}/>
                            <Link href={"/login/recovery-request"} className="mt-2 underline decoration-azul">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div className="error">{errores}</div>
                    </div>
                    {boton}
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <div>¿No tienes una cuenta?</div>
                        <Link href={"/signup"} className="underline decoration-azul">¡Registrate!</Link>
                    </div>
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