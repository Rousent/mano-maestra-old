
import Navigation from "@/components/Navigation"
import { useState } from "react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { getFullUser } from "../utilities/methods"
import { modificarDatos, modificarContraseña } from "../utilities/methods"

export default function Account({ initialSession, user }) {

    const [contenido, setContenido] = useState(<Datos user={user}/>)
    const modificarDatos = (true) ? <button id="modificarDatos" className="cuentaButton" onClick={() => setContenido(<ModificarDatos user={user}/>)}>Modificar datos</button> : null

    return (
        <>
        <Navigation session={initialSession}/>
        <div className="flex flex-row p-40">
            <div className="w-80 h-fit flex flex-col gap-4 p-10 rounded-lg bg-naranja">
                <button id="datos" className="cuentaButton" onClick={() => setContenido(<Datos user={user}/>)}>Datos de la cuenta</button>
                {modificarDatos}
                <button id="modificarContraseña" className="cuentaButton" onClick={() => setContenido(<ModificarContraseña/>)}>Cambiar contraseña</button>
            </div>
            {contenido}
        </div>
        </>
    )
}

function Datos({ user }) {

    const nivel = (user.nivel) ? <div className="ficha bg-naranja">{user.nivel}</div> : null
    
    return (
        <div className="flex flex-col gap-4 w-full items-center text-center">
            <h2 className="text-center w-form-thin">Datos</h2>
            <div className="flex flex-row gap-4 justify-center items-center">
                <div className="ficha bg-naranja">{user.rol}</div>
                {nivel}
            </div>
            <div>Nombre: {user.nombres} {user.apellidoPaterno} {user.apellidoMaterno}</div>
            <div>Correo electrónico: {user.email}</div>
        </div>
    )
}

function ModificarDatos({ user }) {
    const router = useRouter()

    const [nombres, setNombres] = useState()
    const [apellidoPaterno, setApellidoPaterno] = useState()
    const [apellidoMaterno, setApellidoMaterno] = useState()
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        const error = modificarDatos(user, nombres, apellidoPaterno, apellidoMaterno)
        if (error) {
            setError(error)
        } else {
            router.reload()
        }
    }

    return (
        <form className="w-full px-8 py-0 items-center" onSubmit={handleSubmit}>
            <h2 className="text-center">Modificar Datos</h2>
            <div className="text-center">Rellena los campos que quieras modificar.<br/>Los campos vacios no se veran afectados.</div>
            <div className="flex flex-col gap-2 w-form-thin">
                <div>
                    <label htmlFor="nombres">Nombre(s)</label>
                    <input id="nombres" placeholder="Ej. Luis Angel" onChange={(e) => setNombres(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="apellidoPaterno">Apellido paterno</label>
                    <input id="apellidoPaterno" placeholder="Inserte apellido paterno" onChange={(e) => setApellidoPaterno(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="apellidoMaterno">Apellido materno</label>
                    <input id="apellidoMaterno" placeholder="Inserte apellido materno" onChange={(e) => setApellidoMaterno(e.target.value)}/>
                </div>
                <div className="error">{error}</div>
            </div>
            <button className="bg-azul">Enviar</button>
        </form>
    )
}

function ModificarContraseña() {
    const router = useRouter()

    const [actual, setActual] = useState()
    const [nueva, setNueva] = useState()
    const [confirmar, setConfirmar] = useState()
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        const error = modificarContraseña(actual, nueva, confirmar)
        if (error) {
            setError(error)
        } else {
            router.reload()
        }
    }

    return (
        <form className="w-full px-8 py-0 items-center" onSubmit={handleSubmit}>
            <h2 className="text-center w-form-thin">Cambiar contraseña</h2>
            <div className="flex flex-col w-form-thin gap-2">
                <div>
                    <label htmlFor="current">Contraseña actual</label>
                    <input id="current" type="password" placeholder="Inserte la contraseña actual" onChange={(e) => setActual(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="new">Nueva contraseña</label>
                    <input id="new" type="password" placeholder="Inserte la nueva contraseña" onChange={(e) => setNueva(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="confirm">Confirmar contraseña</label>
                    <input id="confirm" type="password" placeholder="Repita la nueva contraseña" onChange={(e) => setConfirmar(e.target.value)}/>
                </div>
                <div className="error">{error}</div>
            </div>
            <button className="bg-azul">Enviar</button>
        </form>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    } else {
        const user = getFullUser()
        return { props: { initialSession: session, user: user } }
    }
}