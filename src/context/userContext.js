
import { createContext, useContext, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export const UserContext = createContext()

export const useUser = () => {
    const context = useContext(UserContext)
    return context
}

export const UserProvider = ({ children }) => {

    const getUsuario = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data } = await supabase.from("perfiles").select().eq("idUsuario", user.id)
            const response = data[0]
            const userObject = {
                idUsuario: user.id,
                nombres: response.nombres,
                apellidoPaterno: response.apellidoPaterno,
                apellidoMaterno: response.apellidoMaterno,
                email: user.email,
                idRol: response.idRol,
                valorNivel: null,
                nivel: null
            }
            if (response.idRol == 2||response.idRol == 3||response.idRol == 4) {
                const { data } = await supabase.from("estudiantes").select("idNivel, niveles (descripcion)").eq("idUsuario", user.id)
                const valorNivel = data[0].idNivel
                userObject.valorNivel = valorNivel
                const nivel = data[0].niveles.descripcion
                userObject.nivel = nivel
            }
            setUsuario(userObject)
        } else {
            setUsuario(null)
        }
        console.log("Usuario Actualizado")
    }

    const getLecciones = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        const lecciones = await supabase.from("lecciones").select()
        const completadas = await supabase.from("lecciones-completadas").select().eq("idUsuario", user.id)
        lecciones.data.forEach((leccion) => {
            Object.assign(leccion, { done: false })
        })
        completadas.data.forEach((lecCompletada) => {
            lecciones.data.forEach((leccion) => {
                if (lecCompletada.idLeccion == leccion.idLeccion) {
                    leccion.done = true
                }
            })
        })
        const basico = lecciones.data.filter(leccion => leccion.idNivel == 1)
        const intermedio = lecciones.data.filter(leccion => leccion.idNivel == 2)
        const avanzado = lecciones.data.filter(leccion => leccion.idNivel == 3)
        const empresas = lecciones.data.filter(leccion => leccion.idNivel == 4)
        const lista = {basico, intermedio, avanzado, empresas}
        setLecciones(lista)
        console.log("Lecciones Actualizadas")
    }

    const [usuario, setUsuario] = useState()
    const [lecciones, setLecciones] = useState()

    return (
        <UserContext.Provider value={{ usuario, getUsuario, lecciones, getLecciones }}>
            {children}
        </UserContext.Provider>
    )
}