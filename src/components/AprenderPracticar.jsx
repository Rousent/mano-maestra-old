
import Link from "next/link"
import Image from "next/image"

function SlideSection({ imagen, titulo, subtitulo, instruccion, direccion }) {
    return (
        <Link href={direccion} className="slideSection">
            <Image src={"/img/"+imagen} fill={true} className="w-full h-full brightness-40 object-cover z-0"/>
            <div className="z-10 overflow-clip flex flex-col gap-12 justify-center items-center w-full h-full inset-0 absolute">
                <h2 className="text-6xl font-semibold text-fondo text-center">{titulo}</h2>
                <p className="hidden opacity-0 text-4xl font-semibold text-fondo text-center transition-all duration-300">{subtitulo}</p>
                <p className="hidden opacity-0 text-3xl underline text-fondo text-center transition-all duration-300">{instruccion}</p>
            </div>
        </Link>
    )
}

export default function SlideSelector({ session }) {

    const aprender = (session) ? "Click para acceder a las lecciones" : "Click para iniciar sesión"
    const practicar = (session) ? "Click para acceder a las llamadas de practica" : "Click para iniciar sesión"
    const aprLink = (session) ? "/lecciones" : "/login"
    const pracLink = (session) ? "/practica" : "/login"

    return (
        <div className="flex gap-1 w-full h-[40vw]">
            <SlideSection
                imagen={"learn.jpg"}
                titulo={"Aprender"}
                subtitulo={"Revisa nuestras lecciones y prueba el sistema de reconocimiento de señas."}
                instruccion={aprender}
                direccion={aprLink}
            />
            <SlideSection
                imagen={"practice.jpg"}
                titulo={"Practicar"}
                subtitulo={"[PROXIMAMENTE]: Unete a sesiones publicas o privadas, o crea un lobby y practica con otras personas en linea."}
                instruccion={practicar}
                direccion={pracLink}
            />
        </div>
    )
}