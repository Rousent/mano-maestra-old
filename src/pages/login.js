
import { useRouter } from "next/router"
import Link from "next/link"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Login({ initialSession }) {
    const supabase = useSupabaseClient()
    const router = useRouter()

    if (initialSession) {
        router.push("/")
    }

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [errores, setErrores] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrores([])
        if (email && password) {
            const { error } = await supabase.auth.signInWithPassword({email: email, password: password})
            if (!error) {
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
                    <h1>Inicio de Sesión</h1>
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
                        <button className="azul">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session)
      return {
        props: {
          initialSession: null,
        },
      }
  
    return {
      props: {
        initialSession: session,
        user: session.user,
      },
    }
}