
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Standby(){
    return (
        <div className="fondoForms">
            <div className="backdropFondo">
                <div className="divFormLike formDelgado">
                    <h2 className="textCenter">Confirmar correo electrónico</h2>
                    <div className="textCenter">Hemos enviado un correo de confirmación con un enlace a tu dirección de correo.</div>
                    <div className="textCenter">Acceda desde el enlace para terminar el registro.</div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {

    const supabase = createServerSupabaseClient(ctx)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    } else {
        return { props: { initialSession: false } }
    }
}