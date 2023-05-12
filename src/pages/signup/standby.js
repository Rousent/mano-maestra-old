
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function Standby(){
    return (
        <div className="w-full h-full bg-sign_languaje bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <div className="h-fit flex flex-col gap-6 bg-fondo rounded-lg p-10 w-form">
                    <h2 className="text-center">Confirmar correo electrónico</h2>
                    <div className="text-center">Hemos enviado un correo de confirmación con un enlace a tu dirección de correo.</div>
                    <div className="text-center">Acceda desde el enlace para terminar el registro.</div>
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