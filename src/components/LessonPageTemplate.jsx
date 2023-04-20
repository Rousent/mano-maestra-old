
import Navigation from "./Navigation"

export default function LessonPageTemplate({ initialSession, children }) {
    return (
        <>
        <Navigation session={initialSession}/>
        <div className="p40">
            <div className="pagina gap1">
                {children}
            </div>
        </div>
        </>
    )
}