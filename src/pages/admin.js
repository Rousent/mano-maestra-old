
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Navigation from "@/components/AdminNavigation"
import Loading from "@/components/Loading"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function admin({ initialSession, user }) {
  const supabase = useSupabaseClient()

  const [estudiante, setEstudiante] = useState()
  const [boton, setBoton] = useState(<button className="bg-azul">Crear Cuenta</button>)

  const handleClick = async () => {
    const { error } = await supabase.auth.signUp()
  }

  return (
        <>
        <Navigation/>
        <div className="flex py-20 justify-center">
          <form className="border-2 border-black w-form-thin">
            <h4 className="text-center font-semibold text-3xl">Creando cuenta de Usuario Empresarial o Experto</h4>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col w-full">
                <label>Nombre(s)</label>
                <input id="nombres" placeholder="Ej. Luis Angel"/>
              </div>
              <div className="flex flex-col w-full">
                <label>Apellidos</label>
                <div className="flex flex-row gap-4">
                  <input id="paterno" placeholder="Paterno"/>
                  <input id="materno" placeholder="Materno"/>
                </div>
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