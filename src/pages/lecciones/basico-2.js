
import LessonPageTemplate from "@/components/LessonPageTemplate";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Page({ initialSession, user }) {

    return (
        <LessonPageTemplate initialSession={initialSession} user={user} actual={"basico-2"} anterior={"basico-1"}>
            basico-2
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