
import Link from "next/link"

export default function Standby(){

    return (
        <div className="w-full h-full bg-sign_languaje bg-no-repeat bg-cover bg-center">
            <div className="flex gap-40 w-full h-full justify-center items-center backdrop-brightness-40">
                <div className="h-fit flex flex-col gap-6 bg-fondo rounded-lg p-10 w-form">
                    <h2 className="text-center">Cuenta creada</h2>
                    <div className="text-center">Su perfil ha sido completado, ya puede acceder a las funciones del sistema.</div>
                    <Link href={"/"} className="text-center">Regresar a la pagina principal</Link>
                </div>
            </div>
        </div>
    )
}