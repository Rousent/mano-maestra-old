
import Link from "next/link"

function SlideSection({ imagen, titulo, subtitulo, instruccion, direccion }) {
    return (
        <Link href={direccion} className="slideSection">
            <img src={"/img/"+imagen} className="slideImage"/>
            <div className="slideText">
                <h2 className="tituloSlide">{titulo}</h2>
                <p className="subtituloSlide">{subtitulo}</p>
                <p className="instruccionSlide">{instruccion}</p>
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
        <div className="slideSelector">
            <SlideSection
                imagen={"placeholder.png"}
                titulo={"Aprender"}
                subtitulo={"Revisa nuestras lecciones y prueba el sistema de reconocimiento de señas."}
                instruccion={aprender}
                direccion={aprLink}
            />
            <SlideSection
                imagen={"placeholder.png"}
                titulo={"Practicar"}
                subtitulo={"[PROXIMAMENTE]: Unete a sesiones publicas o privadas, o crea un lobby y practica con otras personas en linea."}
                instruccion={practicar}
                direccion={pracLink}
            />
        </div>
    )
}