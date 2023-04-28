
import Link from "next/link"
import { MdOutlineAccountCircle } from "react-icons/md"
import { BiLogOut } from "react-icons/bi"
import { cerrarSesion } from "../utilities/methods"

// añadir llamada=null cuando se implementen las llamadas de practica para las migas de pan.

export default function Navigation({ session, aqui, leccion=null, }) {

    const migaLeccion = (leccion) ? <pre className="font-sans italic select-none">    {">"}    [ {leccion} ]</pre> : null

    const opciones = (session) ? (<Menu/>) : (<Botones/>)
    const empresas = (aqui == "empresas") ? <Link href="/empresas" className="aqui">[ Para Empresas ]</Link> : <Link href="/empresas">Para Empresas</Link>
    const repositorio = (aqui == "repositorio") ? <Link href="/repositorio" className="aqui">[ Repositorio ]</Link> : <Link href="/repositorio">Repositorio</Link>
    const lecciones = (session && aqui == "lecciones") ? <div className="flex items-center"><Link href="/lecciones" className="aqui">[ Lecciones ]</Link>{migaLeccion}</div> : (session) ? <Link href="/lecciones">Lecciones</Link> : null
    const practica = (session && aqui == "practica") ? <Link href="/practica" className="aqui">Practica</Link> : (session) ? <Link href="/practica">Practica</Link> : null

    return (
        <nav className="top-0 sticky z-50 flex bg-fondo h-24 justify-between items-center border-solid border-negro border-2 px-5 shadow-lg">
            <div className="flex items-center gap-12">
                <Link href="/" className="w-36 h-16 bg-logo bg-contain bg-no-repeat bg-center transition-all duration-150 hover:w-40 hover:h-20"/>
                {empresas}
                {repositorio}
                {lecciones}
                {practica}
            </div>
            {opciones}
        </nav>
    )
}

function Botones() {
    return (
        <div className="flex items-center gap-6 mr-8">
            <Link href="/login" className="buttonLike bg-fondo">Acceder</Link>
            <Link href="/signup" className="buttonLike bg-azul">Registrarse</Link>
        </div>
    )
}

function Menu() {

    return (
        <div className="flex items-center gap-6 mr-8">
            <LogOut/>
            <Profile/>
        </div>
    )
}

function Profile() {
    return (
        <Link href={"/cuenta"}>
            <MdOutlineAccountCircle className="iconButton"/>
        </Link>
    )
}

function LogOut() {

    const handleClick = async () => {
        cerrarSesion()
    }

    return <BiLogOut id="logout" onClick={handleClick} className="iconButton"/>
}