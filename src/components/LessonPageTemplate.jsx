
import Navigation from "./Navigation"
import LessonNavigation from "./LessonNavigation"

export default function LessonPageTemplate({ initialSession, user, actual, anterior, siguiente, children }) {
    return (
        <>
        <Navigation session={initialSession}/>
        <div className="flexCol p40 gap1">
            <LessonNavigation user={user} actual={actual} anterior={anterior} siguiente={siguiente}/>
            <div className="pagina gap1 textCenter center">
                {children}
            </div>
            <LessonNavigation user={user} actual={actual} anterior={anterior} siguiente={siguiente}/>
        </div>
        </>
    )
}