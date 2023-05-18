
import Navigation from "./Navigation"
import LessonNavigation from "./LessonNavigation"

export default function LessonPageTemplate({ initialSession, user, titulo, actual, anterior, siguiente, children }) {
    return (
        <>
        <Navigation session={initialSession} aqui={"lecciones"} leccion={titulo}/>
        <div className="flex flex-col p-40 gap-4">
            <LessonNavigation user={user} actual={actual} anterior={anterior} siguiente={siguiente}/>
            <div className="flex flex-col py-10 px-20 rounded-3xl bg-blanco shadow-2xl gap-4">
                {children}
            </div>
            <LessonNavigation user={user} actual={actual} anterior={anterior} siguiente={siguiente}/>
        </div>
        </>
    )
}