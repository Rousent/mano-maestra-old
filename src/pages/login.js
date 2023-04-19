
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

    const [boton, setBoton] = useState(<button className="azul">Iniciar Sesión</button>)

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
        <div className="fondoForms">
            <div className="backdropFondo">
                <img src="/img/logo.png" className="logoEnLogin"/>
                <form onSubmit={handleSubmit} className="formDelgado">
                    <h2 className="textCenter">Inicio de Sesión</h2>
                    <div className="flexCol gapCampos">
                        <div className="flexCol">
                            <label htmlFor="email">Correo electrónico</label>
                            <input id="email" type="email" placeholder="Ej. nombre@correo.com" className="textfield" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flexCol">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" type="password" placeholder="Inserte contraseña" className="textfield" onChange={(e) => setPassword(e.target.value)}/>
                            <Link href={"/"} className="textoAzul">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div className="error">{errores}</div>
                    </div>
                    {boton}
                    <div className="flexRow gapCampos center">
                        <div>¿No tienes una cuenta?</div>
                        <Link href={"/signup"} className="textoAzul">¡Registrate!</Link>
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