
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function admin() {
    return (
        <></>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { destination: '/login', permanent: false, }
    }
    
    const { data } = await supabase.from("perfiles").select().eq("idUsuario", session.user.id)
    if (data.idRol == 1) {
      return { props: { initialSession: session, user: session.user } }
    } else {
        return { destination: '/', permanent: false, }
    }
}