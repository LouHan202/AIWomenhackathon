import type { Brief, FragranceDirection, MediaProvider, VisualMediaKind } from './types'

const moodLexicon: Record<string, string> = {
  fresh: 'crisp daylight and cool translucent surfaces',
  clean: 'uncluttered compositions, pale linen and soft reflections',
  woody: 'warm timber grain and grounded earth tones',
  floral: 'soft botanical shadows and organic curves',
  warm: 'amber light moving over tactile natural materials',
  airy: 'spacious framing and sheer movement',
  playful: 'gentle rhythm and unexpected accents',
  elegant: 'restrained palette and quiet detail',
}

function buildFallbackSvg(title: string): string {
  const safeTitle = title.replace(/[&<>"']/g, '')
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="Generated visual direction placeholder">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#23372f"/>
      <stop offset="50%" stop-color="#6e593f"/>
      <stop offset="100%" stop-color="#8ea59a"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <rect x="72" y="72" width="540" height="210" fill="rgba(255,255,255,0.14)"/>
  <text x="96" y="120" fill="#ffffff" font-family="DM Sans, sans-serif" font-size="22" letter-spacing="3">VISUAL DIRECTION</text>
  <text x="96" y="190" fill="#ffffff" font-family="Tenor Sans, serif" font-size="62">${safeTitle}</text>
  <rect x="780" y="430" width="420" height="210" rx="20" fill="rgba(255,255,255,0.82)"/>
  <text x="812" y="478" fill="#252525" font-family="DM Sans, sans-serif" font-size="22" letter-spacing="2">THE SCENT IN SPACE</text>
  <text x="812" y="548" fill="#1f1f1f" font-family="Tenor Sans, serif" font-size="58">${safeTitle}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function buildVisualDirectionPrompt(brief: Brief, direction: FragranceDirection): string {
  const moodLines = direction.moodTags
    .map((tag) => moodLexicon[tag.toLowerCase()] || tag)
    .slice(0, 4)
    .join('; ')

  return `Create an 8-12 second cinematic architectural mood piece in 16:9.
Venue: ${brief.venueType}. Install context: ${brief.installType}.
Concept: ${brief.concept.value}.
Emotional intent: ${brief.emotionalIntent.value}.
Fragrance direction: ${direction.label}. ${direction.familyDescription}
Visual translation: ${moodLines || 'soft natural light, tactile surfaces, calm framing'}.
Use three connected moments: establish architecture, move into tactile detail, return to wide atmospheric scene.
No people speaking, no logos, no packaging, no product bottles, no text overlays. Atmosphere study only.`
}

interface GenerateResult {
  jobId: string
  kind: VisualMediaKind
  assetUrl: string
}

export async function generateVisualDirectionMedia(
  provider: MediaProvider,
  prompt: string,
  fallbackTitle: string,
): Promise<GenerateResult> {
  const apiBase = (import.meta.env.VITE_MEDIA_GEN_API_BASE || '').replace(/\/$/, '')
  const endpoint = `${apiBase}/api/visual-direction/generate`

  // If no backend is wired yet, keep the flow working with a deterministic placeholder.
  if (!import.meta.env.VITE_MEDIA_GEN_API_BASE) {
    await new Promise((resolve) => setTimeout(resolve, 1600))
    return {
      jobId: `mock-${Date.now()}`,
      kind: 'image',
      assetUrl: buildFallbackSvg(fallbackTitle),
    }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, prompt }),
  })

  if (!response.ok) {
    const msg = await response.text()
    throw new Error(msg || 'Generation request failed')
  }

  const result = (await response.json()) as { jobId: string }
  const statusEndpoint = `${apiBase}/api/visual-direction/status/${result.jobId}`

  for (let i = 0; i < 30; i += 1) {
    const statusRes = await fetch(statusEndpoint)
    if (!statusRes.ok) throw new Error('Failed to check generation status')
    const status = (await statusRes.json()) as {
      status: 'queued' | 'processing' | 'completed' | 'failed'
      assetUrl?: string
      kind?: VisualMediaKind
      error?: string
    }

    if (status.status === 'completed' && status.assetUrl) {
      return {
        jobId: result.jobId,
        kind: status.kind || 'image',
        assetUrl: status.assetUrl,
      }
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'Generation failed')
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  throw new Error('Generation timed out')
}
