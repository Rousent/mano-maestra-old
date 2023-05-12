
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Navigation from "@/components/AdminNavigation"
import Loading from "@/components/Loading"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import getURL from "@/utils/getURL"

export default function Admin({ initialSession, user }) {
  const supabase = useSupabaseClient()

  const [nombres, setNombres] = useState()
  const [paterno, setPaterno] = useState()
  const [materno, setMaterno] = useState()
  const [email, setEmail] = useState()
  const [estudiante, setEstudiante] = useState()
  const [boton, setBoton] = useState(<button className="bg-azul">Crear Cuenta</button>)

  const handleClick = async (e) => {
    e.preventDefault()
    setBoton(<Loading/>)
    let rol
    if (estudiante === "empresarial") {
      rol = 4
    } else if (estudiante === "experto") {
      rol = 5
    }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: getURL("/login/set-password") } })
    const rpc = await supabase.rpc("create_user_profile", { _email: email, _nombres: nombres, _paterno: paterno, _materno: materno, _rol: rol })
    if (error) {
      alert(error.message)
    } else if (rpc.error) {
      alert(rpc.error.message)
    } else {
      alert("Usuario creado con exito")
      //
    }
    setBoton(<button className="bg-azul">Crear Cuenta</button>)
  }

  return (
        <>
        <Navigation/>
        <div className="flex py-20 justify-center">
          <form onSubmit={handleClick} className="border-2 border-black w-form-thin">
            <h4 className="text-center font-semibold text-3xl">Creando cuenta de Usuario Empresarial o Experto</h4>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col w-full">
                <label>Nombre(s)</label>
                <input id="nombres" placeholder="Ej. Luis Angel" onChange={(e) => setNombres(e.target.value)}/>
              </div>
              <div className="flex flex-col w-full">
                <label>Apellidos</label>
                <div className="flex flex-row gap-4">
                  <input id="paterno" placeholder="Paterno" onChange={(e) => setPaterno(e.target.value)}/>
                  <input id="materno" placeholder="Materno" onChange={(e) => setMaterno(e.target.value)}/>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label>Correo Electrónico</label>
                <input id="email" type="email" placeholder="Ej. luis@correo.com" onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="">Tipo de cuenta:</label>
              <fieldset>
                <div className="flex flex-row gap-4 justify-center">
                  <div className="flex gap-4 w-fit">
                    <input id="empresarial" type="radio" name="estudiante" value={"empresarial"} onChange={(e) => setEstudiante(e.target.value)} className="w-fit"/>
                    <label htmlFor="empresarial">Empresarial</label>
                  </div>
                  <div className="flex gap-4 w-fit">
                    <input id="experto" type="radio" name="estudiante" value={"experto"} onChange={(e) => setEstudiante(e.target.value)} className="w-fit"/>
                    <label htmlFor="experto">Experto</label>
                  </div>
                </div>
              </fieldset>
            </div>
            {boton}
          </form>
        </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { destination: '/login', permanent: false, }
    }
    
    const { data } = await supabase.rpc("get_full_user")
    if (data.rol === "Administrador") {
      return { props: { initialSession: session, user: data } }
    } else {
      return { redirect: { destination: '/', permanent: false, } }
    }
}