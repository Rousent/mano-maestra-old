
import LessonPageTemplate from "@/components/LessonPageTemplate";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CameraAccess from "@/components/CameraAccess";

export default function Page({ initialSession, user }) {

    const titulo = "1. Vocales"

    return (
        <LessonPageTemplate initialSession={initialSession} user={user} titulo={titulo} actual={"basico-1"} siguiente={"basico-2"}>
            <h2>{titulo}</h2>
            <h3>Subtitulo</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sodales nulla purus, ut molestie nisl dignissim eu. Vestibulum tempus sodales lacus facilisis efficitur. Nunc suscipit elit velit, sed dictum elit pellentesque id. Aliquam viverra gravida elit, quis facilisis mauris ultricies nec. Vestibulum porta scelerisque bibendum. Cras malesuada, magna ac cursus maximus, quam sem pretium mauris, quis commodo nisi mi in mi. Nunc mi est, posuere ut maximus id, molestie eu diam. Proin facilisis mi purus, quis pellentesque quam ultrices vitae. Nunc scelerisque semper efficitur. Etiam suscipit dictum mauris sed scelerisque. Fusce turpis arcu, dignissim nec nisl vitae, sodales pulvinar ex. Nam convallis nisl at sem tincidunt tincidunt. </p>
            <h3>Subtitulo</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sodales nulla purus, ut molestie nisl dignissim eu. Vestibulum tempus sodales lacus facilisis efficitur. Nunc suscipit elit velit, sed dictum elit pellentesque id. Aliquam viverra gravida elit, quis facilisis mauris ultricies nec. Vestibulum porta scelerisque bibendum. Cras malesuada, magna ac cursus maximus, quam sem pretium mauris, quis commodo nisi mi in mi. Nunc mi est, posuere ut maximus id, molestie eu diam. Proin facilisis mi purus, quis pellentesque quam ultrices vitae. Nunc scelerisque semper efficitur. Etiam suscipit dictum mauris sed scelerisque. Fusce turpis arcu, dignissim nec nisl vitae, sodales pulvinar ex. Nam convallis nisl at sem tincidunt tincidunt. </p>
            <h4>Pongamos a prueba el sistema:</h4>
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
        const { data } = await supabase.rpc("get_full_user")
        if (data.rol === "Administrador") {
            return { redirect: { destination: '/admin', permanent: false, } }
        } else {
            return { props: { initialSession: session, user: session.user, }, }
        }
    }
}