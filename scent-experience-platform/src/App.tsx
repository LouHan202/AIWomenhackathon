import { AppProvider, useApp } from './lib/state'
import { TopNav } from './components/TopNav'
import { BriefUpload } from './screens/BriefUpload'
import { AiAnalysisResults } from './screens/AiAnalysisResults'
import { SuggestionScreen } from './screens/SuggestionScreen'
import { ExpertReviewScreen } from './screens/ExpertReviewScreen'
import { CommercialSummary } from './screens/CommercialSummary'
import { ControlDashboard } from './screens/ControlDashboard'

function Screen() {
  const { state } = useApp()
  if (!state.project) return <BriefUpload />
  switch (state.screen) {
    case 'brief-upload':
      return <BriefUpload />
    case 'ai-analysis':
      return <AiAnalysisResults />
    case 'suggestion':
      return <SuggestionScreen />
    case 'expert-review':
      return <ExpertReviewScreen />
    case 'commercial-summary':
      return <CommercialSummary />
    case 'control-dashboard':
      return <ControlDashboard />
    default:
      return <BriefUpload />
  }
}

function Shell() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <TopNav />
      <Screen />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
