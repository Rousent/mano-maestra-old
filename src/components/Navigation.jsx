
import Link from "next/link"
import { useRouter } from "next/router"
import { MdOutlineAccountCircle } from "react-icons/md"
import { BiLogOut } from "react-icons/bi"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Navigation({ session }) {

    const opciones = (session) ? (<Menu/>) : (<Botones/>)
    const lecciones = (session) ? <Link href="/lecciones">Lecciones</Link> : null
    const practica = (session) ? <Link href="/practica">Practica</Link> : null

    return (
        <nav className="top-0 sticky z-50 flex bg-fondo h-24 justify-between items-center border-solid border-2 px-5 shadow-lg">
            <div className="flex items-center gap-12">
                <Link href="/" className="w-36 h-16 bg-logo bg-contain bg-no-repeat bg-center transition-all duration-150 hover:w-40 hover:h-20"/>
                <Link href="/empresas">Para Empresas</Link>
                <Link href="/repositorio">Repositorio</Link>
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
    const supabase = useSupabaseClient()
    const router = useRouter()

    const handleClick = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return <BiLogOut id="logout" onClick={handleClick} className="iconButton"/>
}