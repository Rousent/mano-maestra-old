import LobbyAccess from "@/components/LobbyAccess";
import Navigation from "@/components/Navigation";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function practica({ initialSession }) {
    return (
        <>
        <Navigation session={initialSession} aqui={"practica"}/>
        <div className="flex flex-col gap-5 py-12 px-40">
            <div className="flex flex-col gap-4">
                <h1 className="text-center">Titulo jijhikjhoijnoijhikjhnkjhkuhikjnlkho</h1>
                <h2 className="text-center">Subtitulo okjhgkjfkhvkjnokjmnkhgkhjblk</h2>
            </div>
            <div className="flex flex-row w-fit h-[600px] self-center gap-10 justify-center items-center">
                <LobbyAccess href={"/practica"} image={"placeholder"} message={"Unirse a llamada publica"}/>
                <LobbyAccess href={"/practica"} image={"placeholder"} message={"Unirse a llamada privada"}/>
                <LobbyAccess href={"/practica"} image={"placeholder"} message={"Crear lobby"}/>
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
      if (data.rol === "Administrador") {
        return { redirect: { destination: '/admin', permanent: false, } }
      } else {
        return { props: { initialSession: session, user: session.user, }, }
      }
    }
  }