import Link from "next/link";

export default function LobbyAccess({ href, image, message }) {

    const bg = `bg-${image}`

    return (
        <Link href={href} className={bg+" w-[300px] h-[500px] bg-cover bg-no-repeat bg-center decoration-naranja rounded-3xl hover:w-[400px] hover:h-[600px] transition-all duration-200 text-white"}>
            <div className="grid backdrop-brightness-40 rounded-3xl w-full h-full place-items-center">
                <div className="font-semibold text-4xl p-8 text-center">{message}</div>
            </div>
        </Link>
    )
}