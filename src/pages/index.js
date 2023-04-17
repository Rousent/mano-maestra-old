
import Navigation from "../components/Navigation"
import SlideSelector from "../components/AprenderPracticar"
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function Home({ initialSession }) {

  return (
    <>
    <Navigation session={initialSession}/>
    <SlideSelector session={initialSession}/>
    </>
  )
}

export const getServerSideProps = async (ctx) => {

  const supabase = createServerSupabaseClient(ctx)
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session)
    return {
      props: {
        initialSession: null,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}