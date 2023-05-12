
import Navigation from "@/components/Navigation";
import Image from "next/image";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Contacto({ initialSession }) {
    return (
        <>
        <Navigation session={initialSession} aqui={"empresas"}/>
        <div className="flex flex-row px-40 py-10 justify-between gap-10">
            <div className="flex flex-col w-full gap-5">
                <h2 className="text-center font-bold text-6xl">Ofrecemos promociones y planes personalizados a empresas.</h2>
                <h4 className="text-center font-medium text-3xl">Llena el formulario e incluye detalles de sus necesidades para llegar al mejor acuerdo.</h4>
                <Image src="img/logo.png" fill={true} className="p-10"/>
            </div>
            <form className="w-form h-fit rounded-lg border-2 border-black p-10 flex flex-col justify-center items-center bg-fondo">
                <div className="flex flex-col w-full">
                    <label htmlFor="nombres">Nombre(s)</label>
                    <input id="nombres" placeholder="Ej. Luis Angel"/>
                </div>
                <div className="flex flex-col w-full">
                    <label>Apellidos</label>
                    <div className="flex flex-row gap-4">
                        <input id="paterno" placeholder="Paterno"/>
                        <input id="materno" placeholder="Materno"/>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="email">Correo electronico empresarial</label>
                    <input id="email" placeholder="Ej. ejemplo@gmail.com"/>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="empresa">Nombre de la empresa</label>
                    <input id="empresa" placeholder="Nombre de la empresa"/>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="puesto">Puesto</label>
                    <input id="puesto" placeholder="Cargo dentro de la empresa"/>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="telephone">Teléfono</label>
                    <input id="telephone" placeholder="000-000-0000"/>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="tamaño">Tamaño de la empresa</label>
                    <input id="tamaño" placeholder="Cantidad aproximada de empleados"/>
                </div>
                <div className="w-full">
                    <label htmlFor="details">Detalles</label>
                    <br/>
                    <textarea id="details" rows={5} className="w-full border-2 border-solid border-black rounded-lg px-3 py-0.5" placeholder="Expliquenos sus necesidades"/>
                </div>
                <button className="bg-azul">Enviar</button>
            </form>
        </div>
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