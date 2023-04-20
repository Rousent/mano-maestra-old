
import Navigation from "@/components/Navigation";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Contacto({ initialSession }) {
    return (
        <>
        <Navigation session={initialSession}/>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return { props: { initialSession: false } }
    } else {
        return { props: { initialSession: session } }
    }
}