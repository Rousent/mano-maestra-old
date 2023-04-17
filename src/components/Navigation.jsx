
import Link from "next/link"
import { useRouter } from "next/router"
import { BiMenu } from "react-icons/bi"
import { MdOutlineAccountCircle } from "react-icons/md"
import { BiLogOut } from "react-icons/bi"
import { useState } from "react"
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
    
    const [open, setOpen] = useState(false)
    const profile = (open) ? (<Profile/>) : null
    const logout = (open) ? (<LogOut/>) : null

    return (
        <div className="menuNavBar">
            {logout}
            {profile}
            <BiMenu className="botonIcon" onClick={() => setOpen(!open)}/>
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