import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type {
  Brief,
  Classification,
  ClassificationSource,
  CommercialTerm,
  ControlZone,
  ExpertSignoff,
  FragranceDirection,
  Project,
  RoleView,
  ScreenId,
} from './types'
import { generateDirectionCandidates } from './fragrance-directions'
import { recommendMachine } from './machines'

interface AppState {
  screen: ScreenId
  role: RoleView
  today: number
  project: Project | null
  customerRequestedExpertReview: boolean
}

const initialZones = (deploymentScope: Project['brief']['deploymentScope']): ControlZone[] => {
  const count = deploymentScope.value === 'Multi-site' ? 3 : deploymentScope.value === 'Multi-room' ? 2 : 1
  return Array.from({ length: count }, (_, i) => ({
    id: `zone-${i + 1}`,
    name: count === 1 ? 'Main zone' : `Zone ${i + 1}`,
    intensity: 55,
    on: true,
    intervalMinutes: 15,
  }))
}

type Action =
  | { type: 'SUBMIT_BRIEF'; brief: Brief }
  | { type: 'UPDATE_FIELD'; field: keyof Brief; value: unknown }
  | { type: 'OVERRIDE_CLASSIFICATION'; classification: Classification }
  | { type: 'GENERATE_SUGGESTIONS' }
  | { type: 'SELECT_MACHINE'; machineId: string }
  | { type: 'SELECT_DIRECTION'; directionId: string }
  | { type: 'EDIT_DIRECTION'; directionId: string; patch: Partial<FragranceDirection>; authoredBy: ClassificationSource }
  | { type: 'ADD_DIRECTION'; direction: FragranceDirection }
  | { type: 'REQUEST_EXPERT_REVIEW' }
  | { type: 'TOGGLE_SIGNOFF'; key: keyof ExpertSignoff }
  | { type: 'CONFIRM_SETUP' }
  | { type: 'SET_COMMERCIAL_TERM'; term: CommercialTerm }
  | { type: 'CONFIRM_INSTALL' }
  | { type: 'UPDATE_ZONE'; zoneId: string; patch: Partial<ControlZone> }
  | { type: 'ADVANCE_DAY' }
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'SET_ROLE'; role: RoleView }
  | { type: 'RESET' }

const emptySignoff: ExpertSignoff = { technicalConsultantReviewed: false, fragranceConsultantReviewed: false }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SUBMIT_BRIEF': {
      const project: Project = {
        brief: action.brief,
        selectedMachineId: null,
        machineAuthoredBy: 'ai',
        directions: [],
        selectedDirectionId: null,
        commercialTerm: 'rental',
        signoff: emptySignoff,
        zones: [],
        installedAtDay: null,
      }
      return { ...state, project, screen: 'ai-analysis', customerRequestedExpertReview: false }
    }
    case 'UPDATE_FIELD': {
      if (!state.project) return state
      return {
        ...state,
        project: { ...state.project, brief: { ...state.project.brief, [action.field]: action.value } },
      }
    }
    case 'OVERRIDE_CLASSIFICATION': {
      if (!state.project) return state
      return {
        ...state,
        project: {
          ...state.project,
          brief: { ...state.project.brief, classification: action.classification, classificationSource: 'expert' },
        },
      }
    }
    case 'GENERATE_SUGGESTIONS': {
      if (!state.project) return state
      const { brief } = state.project
      const machine = recommendMachine(brief.spaceSizeSqm.value, brief.visibility.value)
      const directions = generateDirectionCandidates(brief.concept.value, brief.emotionalIntent.value, 3, 'ai')
      // Suggestion is the one shared fragrance-direction screen for both paths (PRD §11): simple
      // briefs land here unlocked, complex briefs land here read-only/"awaiting expert".
      return {
        ...state,
        screen: 'suggestion',
        project: { ...state.project, selectedMachineId: machine.id, directions },
      }
    }
    case 'SELECT_MACHINE': {
      if (!state.project) return state
      return { ...state, project: { ...state.project, selectedMachineId: action.machineId, machineAuthoredBy: 'expert' } }
    }
    case 'SELECT_DIRECTION': {
      if (!state.project) return state
      return { ...state, project: { ...state.project, selectedDirectionId: action.directionId } }
    }
    case 'EDIT_DIRECTION': {
      if (!state.project) return state
      return {
        ...state,
        project: {
          ...state.project,
          directions: state.project.directions.map((d) =>
            d.id === action.directionId ? { ...d, ...action.patch, authoredBy: action.authoredBy } : d,
          ),
        },
      }
    }
    case 'ADD_DIRECTION': {
      if (!state.project) return state
      return { ...state, project: { ...state.project, directions: [...state.project.directions, action.direction] } }
    }
    case 'REQUEST_EXPERT_REVIEW': {
      // Flags the project for the internal team; the customer stays on Suggestion, which now
      // renders its "awaiting expert" state. Reaching the internal view is a role switch, not a screen jump.
      return { ...state, customerRequestedExpertReview: true }
    }
    case 'TOGGLE_SIGNOFF': {
      if (!state.project) return state
      return {
        ...state,
        project: {
          ...state.project,
          signoff: { ...state.project.signoff, [action.key]: !state.project.signoff[action.key] },
        },
      }
    }
    case 'CONFIRM_SETUP': {
      // Expert-side action: confirms the record both views share (PRD §11 — status flips,
      // visibility doesn't). Stays on the internal view; the customer sees it next time they
      // load Suggestion and drives their own handoff to Commercial Summary from there.
      if (!state.project || !state.project.selectedDirectionId) return state
      return {
        ...state,
        project: {
          ...state.project,
          directions: state.project.directions.map((d) =>
            d.id === state.project!.selectedDirectionId ? { ...d, status: 'confirmed' } : d,
          ),
        },
      }
    }
    case 'SET_COMMERCIAL_TERM': {
      if (!state.project) return state
      return { ...state, project: { ...state.project, commercialTerm: action.term } }
    }
    case 'CONFIRM_INSTALL': {
      if (!state.project) return state
      return {
        ...state,
        screen: 'control-dashboard',
        project: {
          ...state.project,
          installedAtDay: state.today,
          zones: initialZones(state.project.brief.deploymentScope),
        },
      }
    }
    case 'UPDATE_ZONE': {
      if (!state.project) return state
      return {
        ...state,
        project: {
          ...state.project,
          zones: state.project.zones.map((z) => (z.id === action.zoneId ? { ...z, ...action.patch } : z)),
        },
      }
    }
    case 'ADVANCE_DAY': {
      return { ...state, today: state.today + 1 }
    }
    case 'NAVIGATE': {
      return { ...state, screen: action.screen }
    }
    case 'SET_ROLE': {
      if (!state.project) return { ...state, role: action.role }
      if (action.role === 'expert') return { ...state, role: 'expert', screen: 'expert-review' }
      // Returning to the customer view: land wherever the customer's own progress allows.
      const customerScreen: ScreenId =
        state.screen === 'control-dashboard'
          ? 'control-dashboard'
          : state.project.installedAtDay !== null
            ? 'control-dashboard'
            : state.project.directions.length > 0
              ? 'suggestion'
              : 'ai-analysis'
      return { ...state, role: 'customer', screen: customerScreen }
    }
    case 'RESET': {
      return { screen: 'brief-upload', role: 'customer', today: 0, project: null, customerRequestedExpertReview: false }
    }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    screen: 'brief-upload',
    role: 'customer',
    today: 0,
    project: null,
    customerRequestedExpertReview: false,
  })
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
