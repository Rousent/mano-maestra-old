
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

// Ignora este metodo, no se si lo vamos a utilizar.
export const checkProfileExist = async (idUsuario) => {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase.from("perfiles").select().eq("idUsuario", idUsuario)
    if (data.length == 0) {
        return false
    } else {
        return true
    }
}

// Otro metodo que no hace falta hacer testing. Tecnicamente es un getter.
export const getFullUser = async () => {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase.from("perfiles").select().eq("idUsuario", user.id)
    const response = data[0]
    const rol = await supabase.from("roles").select("descripcion").eq("idRol", response.idRol)
    const rolResponse = rol.data[0]
    const userObject = {
        idUsuario: user.id,
        nombres: response.nombres,
        apellidoPaterno: response.apellidoPaterno,
        apellidoMaterno: response.apellidoMaterno,
        email: user.email,
        idRol: response.idRol,
        rol: rolResponse.descripcion,
        valorNivel: null,
        nivel: null
    }
    if (response.idRol == 2||response.idRol == 3||response.idRol == 4) {
        const { data } = await supabase.from("estudiantes").select("idNivel, niveles (descripcion)").eq("idUsuario", user.id)
        userObject.valorNivel = data[0].idNivel
        userObject.nivel = data[0].niveles.descripcion
    }

    return userObject
}

export const getLecciones = async (user) => {
    //
}

// Empieza las pruebas a partir de aqui. Separe los metodos en base a la "clase" a la que corresponde en el diagrama.

// Usuario :

/**
 * Crea la fila en la bd correspondiente al usuario que se registró.
 * @param {*} session 
 * @returns mensaje de error o confirmación.
 */
export const crearPerfil = async () => {
    const supabase = useSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        try {
            const { error } = await supabase.from("perfiles").insert({
                idUsuario: user.id,
                nombres: user.user_metadata.nombres,
                apellidoPaterno: user.user_metadata.apellidoPaterno,
                apellidoMaterno: user.user_metadata.apellidoMaterno,
                idRol: user.user_metadata.idRol,
            })
            const result = await supabase.from("estudiantes").insert({
                idUsuario: user.id,
                idNivel: 1, //Nivel por defecto
            })
            if (error) {
                return error.message
            } else if (result.error.message) {
                return result.error.message
            } else {
                return "Usuario registrado con exito"
            }
        } catch(e) {
            //
        }
    } else {
        return "Hubo un error con la autenticación de su correo"
    }
}

/**
 * Iniciar Sesión
 * @param {*} email 
 * @param {*} password 
 * @returns error si no se pudo iniciar sessión, o null si no hubo error.
 */
export const iniciarSesion = async (email, password) => {
    const supabase = useSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({email: email, password: password})
    return error
}

/**
 * Cerrar sesión
 */
export const cerrarSesion = async () => {
    const supabase = useSupabaseClient()
    const router = useRouter()

    await supabase.auth.signOut()
    router.push("/")
}

/**
 * Modificar datos
 * @param {*} nombres 
 * @param {*} apellidoPaterno 
 * @param {*} apellidoMaterno 
 * @returns mensaje de error si lo hay, null si no.
 */
export const modificarDatos = async (user, nombres, apellidoPaterno, apellidoMaterno) => {
    const supabase = useSupabaseClient()

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
            return error.message
        } else {
            return null
        }
    } else {
        return "No hay cambios que realizar"
    }
}

/**
 * Modificar contraseña
 * @param {*} actual 
 * @param {*} nueva 
 * @param {*} confirmar 
 * @returns mensaje de error si lo hay, null si no.
 */
export const modificarContraseña = async (actual, nueva, confirmar) => {
    const supabase = useSupabaseClient()

    if (actual && nueva && confirmar) {
        if (nueva == confirmar) {
            const { error } = await supabase.rpc("change_user_password", {current_plain_password: actual, new_plain_password: nueva,})
            if (error) {
                return error.message
            } else {
                return null
            }
        } else {
            return "Las contraseñas no concuerdan"
        }
    } else {
        return "Debes rellenar todos los campos"
    }
}

//Pendiente.
export const recuperarCuenta = async (nueva, confirmar) => {
    const supabase = useSupabaseClient()
}

// Estudiante :

export const subirNivel = async () => {
    //
}

// Pendiente (ojala para siempre)
export const realizarPago = async () => {
    //
}