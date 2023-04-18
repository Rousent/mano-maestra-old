
import Link from "next/link"
import { useRouter } from "next/router"
import { MdOutlineAccountCircle } from "react-icons/md"
import { BiLogOut } from "react-icons/bi"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function Navigation({ session }) {

    const opciones = (session) ? (<Menu/>) : (<Botones/>)

    return (
        <div className="navigationGroup">
            <nav className="navigationBar">
                <div className="navigationLeftOptions">
                    <Link href="/" className="botonHome"/>
                    <Link href="/">Para Empresas</Link>
                    <Link href="/">Repositorio</Link>
                </div>
                {opciones}
            </nav>
        </div>
    )
}

function Botones() {
    return (
        <div>
            <Link href="/login" className="botonLike fondo margin-right-2">Acceder</Link>
            <Link href="/signup" className="botonLike azul">Registrarse</Link>
        </div>
    )
}

function Menu() {

    return (
        <div className="menuNavBar">
            <LogOut/>
            <Profile/>
        </div>
    )
}

function Profile() {
    return (
        <Link href={"/cuenta"}>
            <MdOutlineAccountCircle className="botonIcon"/>
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

    return <BiLogOut onClick={handleClick} className="botonIcon"/>
}