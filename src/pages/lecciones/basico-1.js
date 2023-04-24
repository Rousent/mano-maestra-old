
import LessonPageTemplate from "@/components/LessonPageTemplate";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CameraAccess from "@/components/CameraAccess";

export default function Page({ initialSession, user }) {

    const titulo = "1. Abecedario"

    return (
        <LessonPageTemplate initialSession={initialSession} user={user} titulo={titulo} actual={"basico-1"} siguiente={"basico-2"}>
            {titulo}
            <CameraAccess/>
        </LessonPageTemplate>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    } else {
        return { props: { initialSession: session, user: session.user } }
    }
}