
import Navigation from "@/components/Navigation"
import { useState } from "react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

export default function Account({ initialSession, user }) {

    const [contenido, setContenido] = useState(<Datos user={user}/>)
    const modificarDatos = (user.rol !== "Estudiante Empresarial" && user.rol !== "Experto") ? <button id="modificarDatos" className="cuentaButton" onClick={() => setContenido(<ModificarDatos user={user}/>)}>Modificar datos</button> : null

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
    const supabase = useSupabaseClient()

    const [nombres, setNombres] = useState()
    const [apellidoPaterno, setApellidoPaterno] = useState()
    const [apellidoMaterno, setApellidoMaterno] = useState()
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        let cambios = {}
        if (nombres) {
            Object.assign(cambios, {nombres})
        }
        if (apellidoPaterno) {
            Object.assign(cambios, {apellidoPaterno})
        }
        if (apellidoMaterno) {
            Object.assign(cambios, {apellidoMaterno})
        }
        if (Object.keys(cambios).length > 0) {
            const { error } = await supabase.from("perfiles").update(cambios).eq("id_usuario", user.id)
            if (error) {
                setError(error.message)
            } else {
                router.reload()
            }
        } else {
            setError("No hay cambios que realizar")
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
    const supabase = useSupabaseClient()

    const [actual, setActual] = useState()
    const [nueva, setNueva] = useState()
    const [confirmar, setConfirmar] = useState()
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        if (actual && nueva && confirmar) {
            if (nueva == confirmar) {
                const { error } = await supabase.rpc("change_user_password", {current_plain_password: actual, new_plain_password: nueva,})
                if (error) {
                    setError(error.message)
                } else {
                    router.reload()
                }
            } else {
                setError("Las contraseñas no concuerdan")
            }
        } else {
            setError("Debes rellenar todos los campos")
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
        return { redirect: { destination: '/login', permanent: false, } }
    } else {
        const user = await supabase.rpc("get_full_user")
        if (user.data.rol === "Administrador") return { redirect: { destination: "/admin", permanent: false, } }
        return { props: { initialSession: session, user: user.data } }
    }
}