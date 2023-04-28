
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
        return { props: { initialSession: null } }
    } else {
        return { props: { initialSession: session } }
    }
}