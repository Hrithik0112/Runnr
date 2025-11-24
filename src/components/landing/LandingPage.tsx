import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Hero from './Hero'
import Feature from './Feature'
import HowItworks from './HowItworks'
import Footer from './Footer'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleNavigateToBuilder = () => {
    navigate('/builder', { replace: true })
  }

  const handleNavigateToViewer = () => {
    navigate('/viewer', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-4xl mx-auto">
      <Header handleNavigateToBuilder={handleNavigateToBuilder} handleNavigateToViewer={handleNavigateToViewer} />
      <Hero handleNavigateToBuilder={handleNavigateToBuilder} handleNavigateToViewer={handleNavigateToViewer} />
      <Feature />
      <HowItworks />
      <Footer />
    </div>
  )
}





