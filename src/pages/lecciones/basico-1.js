
import LessonPageTemplate from "@/components/LessonPageTemplate";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CameraAccess from "@/components/CameraAccess";

export default function Page({ initialSession, user }) {

    const titulo = "1. Vocales"

    return (
        <LessonPageTemplate initialSession={initialSession} user={user} titulo={titulo} actual={"basico-1"} siguiente={"basico-2"}>
            <h2>{titulo}</h2>
            <p>¡Bienvenidos a esta lección sobre las vocales en la Lengua de Señas Mexicana! En esta lección aprenderemos cómo se expresan las vocales a través de señas en LSM. Las vocales son componentes esenciales del lenguaje y su dominio nos permitirá comunicarnos de manera efectiva con las personas sordas y con discapacidad auditiva. ¡Comencemos!</p>
            <h3>Vocal "A":</h3>
            <ul>
                <li>Posición inicial: Extiende la mano derecha hacia adelante con los dedos juntos y estirados.</li>
                <li>Movimiento: Mantén los dedos juntos y cierra todos los dedos para que las puntas de los dedos toquen la palma de la mano.</li>
                <li>Forma de la mano: Mantén los dedos cerrados y el pulgar extendido hacia afuera, alejado de la palma de la mano.</li>
            </ul>
            <h3>Vocal "E":</h3>
            <ul>
                <li>Posición inicial: Extiende la mano derecha hacia adelante con los dedos juntos y estirados.</li>
                <li>Movimiento: Mantén la mano quieta y sin moverla.</li>
                <li>Forma de la mano: Mantén los dedos semicerrados, es decir, dobla ligeramente los dedos en las articulaciones de las falanges media y distal. El pulgar se coloca debajo de los demás dedos.</li>
            </ul>
            <h3>Vocal "I":</h3>
            <ul>
                <li>Posición inicial: Extiende la mano derecha hacia adelante con los dedos juntos y estirados.</li>
                <li>Movimiento: Mantén la mano quieta y sin moverla.</li>
                <li>Forma de la mano: Cierra todos los dedos juntos, dejando solo el dedo índice extendido hacia arriba.</li>
            </ul>
            <h3>Vocal "O":</h3>
            <ul>
                <li>Posición inicial: Extiende la mano derecha hacia adelante con los dedos juntos y estirados.</li>
                <li>Movimiento: Mantén la mano quieta y sin moverla.</li>
                <li>Forma de la mano: Abre la mano con los dedos separados y ligeramente curvados, como si estuvieras sosteniendo una pelota imaginaria.</li>
            </ul>
            <h3>Vocal "U":</h3>
            <ul>
                <li>Posición inicial: Extiende la mano derecha hacia adelante con los dedos juntos y estirados.</li>
                <li>Movimiento: Mantén la mano quieta y sin moverla.</li>
                <li>Forma de la mano: Cierra el meñique y el anular, manteniéndolos juntos y doblados hacia adentro, hacia la palma de la mano. El dedo medio y el índice deben estar estirados hacia afuera. El pulgar debe tocar la punta del anular, sujetándolo suavemente.</li>
            </ul>
            <h3>¡Pongamoslo a prueba!</h3>
            <p>Si tienes una camara, puedes utilizar el sistema de reconocimiento de señas. Enciende la camara e imita la forma de la mano para las vocales (A, E, I, O y U).</p>
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