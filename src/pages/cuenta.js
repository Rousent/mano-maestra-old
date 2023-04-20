
import Navigation from "@/components/Navigation"
import { useState } from "react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"

export default function Account({ initialSession, user }) {

    const [contenido, setContenido] = useState(<Datos user={user}/>)
    const modificarDatos = (true) ? <div className="botonOpciones textCenter" onClick={() => setContenido(<ModificarDatos user={user}/>)}>Modificar datos</div> : null

    return (
        <>
        <Navigation session={initialSession}/>
        <div className="flexRow p40 gap5">
            <div className="menuCuenta naranja">
                <div className="botonOpciones textCenter" onClick={() => setContenido(<Datos user={user}/>)}>Datos de la cuenta</div>
                {modificarDatos}
                <div className="botonOpciones textCenter" onClick={() => setContenido(<ModificarContraseña/>)}>Cambiar contraseña</div>
            </div>
            {contenido}
        </div>
        </>
    )
}

function Datos({ user }) {

    const nivel = (user.nivel) ? <div className="ficha naranja">{user.nivel}</div> : null
    
    return (
        <div className="flexCol gap1">
            <h2 className="textCenter formDelgado">Datos</h2>
            <div className="flexRow gap1 center">
                <div className="ficha naranja">{user.rol}</div>
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
            const { error } = await supabase.from("perfiles").update(cambios).eq("idUsuario", user.idUsuario)
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
        <form onSubmit={handleSubmit}>
            <h2 className="textCenter formDelgado">Modificar Datos</h2>
            <div className="textCenter">Rellena los campos que quieras modificar.<br/>Los campos vacios no se veran afectados.</div>
            <div className="flexCol gapCampos">
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
            <button className="azul">Enviar</button>
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
        <form onSubmit={handleSubmit}>
            <h2 className="textCenter formDelgado">Cambiar contraseña</h2>
            <div className="flexCol gapCampos">
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
            <button className="azul">Enviar</button>
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
        const { data } = await supabase.from("perfiles").select().eq("idUsuario", session.user.id)
        const response = data[0]
        const rol = await supabase.from("roles").select("descripcion").eq("idRol", response.idRol)
        const rolResponse = rol.data[0]
        const userObject = {
            idUsuario: session.user.id,
            nombres: response.nombres,
            apellidoPaterno: response.apellidoPaterno,
            apellidoMaterno: response.apellidoMaterno,
            email: session.user.email,
            idRol: response.idRol,
            rol: rolResponse.descripcion,
            valorNivel: null,
            nivel: null
        }
        if (response.idRol == 2||response.idRol == 3||response.idRol == 4) {
            const { data } = await supabase.from("estudiantes").select("idNivel, niveles (descripcion)").eq("idUsuario", session.user.id)
            userObject.valorNivel = data[0].idNivel
            userObject.nivel = data[0].niveles.descripcion
        }
        return { props: { initialSession: session, user: userObject } }
    }
}