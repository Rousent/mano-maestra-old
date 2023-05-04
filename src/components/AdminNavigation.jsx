
import Link from "next/link"
import { BiLogOut } from "react-icons/bi"
import { useState } from "react"
import LogOutConfirmation from "./Confirmation"

export default function Navigation() {

    return (
        <nav className="top-0 sticky z-50 flex bg-fondo h-24 justify-between items-center border-solid border-negro border-2 px-5 shadow-lg">
            <div className="flex items-center gap-12">
                <div className="w-36 h-16 bg-logo bg-contain bg-no-repeat bg-center"/>
            </div>
            <LogOut/>
        </nav>
    )
}

function LogOut() {
    const [open, setOpen] = useState(false)

    const handleClick = async () => {
        setOpen(true)
    }

    return (
        <div>
            <BiLogOut id="logout" onClick={handleClick} className="iconButton"/>
            <LogOutConfirmation open={open} setOpen={setOpen}/>
        </div>
    )
}