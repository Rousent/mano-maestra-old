import LobbyAccess from "@/components/LobbyAccess";
import Navigation from "@/components/Navigation";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function practica({ initialSession }) {
    return (
        <>
        <Navigation session={initialSession} aqui={"practica"}/>
        <div className="flex flex-col gap-5 py-12 px-40">
            <div className="flex flex-col gap-4">
                <h2 className="text-center">Practica</h2>
                <h3 className="text-center">Proximamente: Accede a llamadas con otros usuarios y desarrolla tus habilidades.</h3>
            </div>
            <div className="flex flex-row w-fit h-[600px] self-center gap-10 justify-center items-center">
                <LobbyAccess href={"/practica"} bg={"bg-heart_sign"} message={"Unirse a llamada publica"}/>
                <LobbyAccess href={"/practica"} bg={"bg-videocall"} message={"Unirse a llamada privada"}/>
                <LobbyAccess href={"/practica"} bg={"bg-waiting_room"} message={"Crear lobby"}/>
            </div>
        </div>
        </>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { props: { initialSession: null, },}
    } else {
      const { data } = await supabase.rpc("get_full_user")
      if (data.rol === "Experto") return { redirect: { destination: "/", permanent: false, } }
      if (data.rol === "Administrador") {
        return { redirect: { destination: '/admin', permanent: false, } }
      } else {
        return { props: { initialSession: session, user: session.user, }, }
      }
    }
  }