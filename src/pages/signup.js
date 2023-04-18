
import { useRouter } from "next/router"
import Link from "next/link"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function SignUp() {
    const supabase = useSupabaseClient()
    const router = useRouter()

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
        options: {
            data: {
            nombres: nombres,
            apellidoPaterno: paterno,
            apellidoMaterno: materno,
            idRol: 2 },
            emailRedirectTo: "http://localhost:3000/signup/ready"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrores()
        if (nombres && paterno && materno && email && password && confirm) {
            if (password == confirm) {
                const { error } = await supabase.auth.signUp(signUpData)
                if (!error) {
                    router.push("/signup/standby")
                } else {
                    setErrores(error.message)
                }
            } else {
                setErrores("Las contraseñas no concuerdan")
            }
            
        } else {
            setErrores("Debes rellenar todos los campos")
        }
    }

    return (
        <div className="fondoForms">
            <div className="backdropFondo">
                <form onSubmit={handleSubmit} className="formDelgado">
                    <h1>Registro</h1>
                    <div className="flexCol gapCampos">
                        <div className="flexCol">
                            <label htmlFor="nombres">Nombre(s)</label>
                            <input id="nombres" placeholder="Ej. Luis Angel" onChange={(e) => setNombres(e.target.value)}/>
                        </div>
                        <div className="flexCol">
                            <label>Apellidos</label>
                            <div className="flexRow gapCampos">
                                <input id="apellidoPaterno" placeholder="Paterno" onChange={(e) => setPaterno(e.target.value)}/>
                                <input id="apellidoMaterno" placeholder="Materno" onChange={(e) => setMaterno(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flexCol">
                            <label htmlFor="email">Correo electrónico</label>
                            <input id="email" type="email" placeholder="Ej. nombre@correo.com" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flexCol">
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" type="password" placeholder="Inserte contraseña" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="flexCol">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input id="confirmPassword" type="password" placeholder="Repita la contraseña" onChange={(e) => setConfirm(e.target.value)}/>
                        </div>
                        <div className="error">{errores}</div>
                    </div>
                    <button className="azul">Registrarme</button>
                    <div className="flexRow gapCampos center">
                        <div>¿Ya tienes una cuenta?</div>
                        <Link href={"/login"} className="textoAzul">¡Inicia Sesión!</Link>
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