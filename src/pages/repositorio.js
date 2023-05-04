
import Navigation from "@/components/Navigation";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Repositorio({ initialSession }) {
    return (
        <>
        <Navigation session={initialSession} aqui={"repositorio"}/>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return { props: { initialSession: false } }
    } else {
        const { data } = await supabase.rpc("get_full_user")
        if (data.rol === "Administrador") {
            return { redirect: { destination: '/admin', permanent: false, } }
        } else {
            return { props: { initialSession: session, user: session.user, }, }
        }
    }
}