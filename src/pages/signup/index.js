
import { useRouter } from "next/router"
import Link from "next/link"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Loading from "@/components/Loading"
import getURL from "@/utils/getURL"

export default function SignUp() {
    const supabase = useSupabaseClient()
    const router = useRouter()

    const [boton, setBoton] = useState(<button className="bg-azul">Registrarme</button>)

    const [nombres, setNombres] = useState()
    const [paterno, setPaterno] = useState()
    const [materno, setMaterno] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirm, setConfirm] = useState()
    const [errores, setErrores] = useState()

    const signUpData = {
        email: email,
        password: password,
        options: { emailRedirectTo: getURL("/signup/ready") }
    }

    const profileData = {
        _email: email,
        _nombres: nombres,
        _paterno: paterno,
        _materno: materno,
        _rol: 2,
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrores()
        if (nombres && paterno && materno && email && password && confirm) {
            if (password == confirm) {
                const { error } = await supabase.auth.signUp(signUpData)
                const res = await supabase.rpc("create_user_profile", profileData)
                if (!error && !res.error) {
                    setBoton(<Loading/>)
                    router.push("/signup/standby")
                } else if (error) {
                    setErrores(error.message)
                } else if (res.error) {
                    setErrores(res.error.message)
                }
            } else {
                setErrores("Las contraseñas no concuerdan")
            }
            
        } else {
            setErrores("Debes rellenar todos los campos")
        }
    }

    return (
        <div className="w-full h-full bg-sign_languaje bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <form onSubmit={handleSubmit} className="w-form">
                    <h1 className="text-center">Registro</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="nombres">Nombre(s)</label>
                            <input id="nombres" placeholder="Ej. Luis Angel" onChange={(e) => setNombres(e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label>Apellidos</label>
                            <div className="flex flex-row gap-2">
                                <input id="apellidoPaterno" placeholder="Paterno" onChange={(e) => setPaterno(e.target.value)}/>
                                <input id="apellidoMaterno" placeholder="Materno" onChange={(e) => setMaterno(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email">Correo electrónico</label>
                            <input id="email" type="email" placeholder="Ej. nombre@correo.com" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" type="password" placeholder="Inserte contraseña" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input id="confirmPassword" type="password" placeholder="Repita la contraseña" onChange={(e) => setConfirm(e.target.value)}/>
                        </div>
                        <div className="error">{errores}</div>
                    </div>
                    {boton}
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <div>¿Ya tienes una cuenta?</div>
                        <Link href={"/login"} className="underline decoration-azul">¡Inicia Sesión!</Link>
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