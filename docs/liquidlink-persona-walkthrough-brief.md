# LiquidLink Protocol Intent Editor — Persona Walkthrough Brief

Brief for an expert heuristic walkthrough of the LiquidLink protocol intent editor, carried out from the point of view of three personas.

## Target
- URL: https://test-ll-2.demo.stg.liquidlink.visionize.com/v2/protocol-intent-editor?new=true
- Login: read from environment variables `LL_USERNAME` / `LL_PASSWORD`. Never write them to files, screenshots, or reports.
- Prerequisite: the environment's network access must allow `*.visionize.com`.

## Product context
- LiquidLink is Eppendorf's protocol **intent** editor. Users describe the steps of a protocol once. Later, the system will generate a device-specific protocol for whatever the lab has: an Eppendorf liquid handler (epMotion, a new low-throughput handler), another vendor's device, or a single-channel pipette.
- **The current prototype has no device selection.** Evaluate it as a step editor, effectively for manual pipetting.
- **Rules:** do not save or run anything, and do not create data on staging. Stop before the Save or Run action and record what it would do.

## Personas
1. **Manual pipettor.** Bench scientist who pipettes by hand, has had little exposure to automation, and has no programming skills.
2. **Experienced low-throughput automation user.** Bench scientist who has used several liquid handler software packages but does no programming.
3. **Power user.** Intermediate Python. Compares the editor with current market tools, e.g. Opentrons Protocol Designer (no-code) and the Opentrons Python API, among others. Focus on the editor experience, not robot hardware. (Not epBlue.)

## Test scenario — PCR Setup (48 samples)
1. Add 10 µL of master mix to 48 wells of an Eppendorf 96-well PCR plate (skirted). The master mix is in a 1.5 mL tube in an Eppendorf tube rack.
2. Transfer 10 µL of each DNA sample from a 96-well Eppendorf microplate (V-bottom) to the PCR plate.
3. Mix both components by pipetting up and down.

Each persona completes the whole workflow, from a new protocol up to (not including) save or run.

## Per-finding log fields
Persona · Step / screen · Issue type (functionality / usability / extra/unnecessary step / unmet expectation) · Description · Evidence (what was observed) · Annotated screenshot · Severity (Nielsen 0–4) · Recommendation

Nielsen severity: 0 not a problem · 1 cosmetic · 2 minor · 3 major · 4 usability catastrophe.

## Deliverables
1. **Designer:** web report with annotated screenshots, step by step per persona.
2. **PO:** spreadsheet issue log (.xlsx), sortable by severity, persona and step.
3. **Business owner:** HTML summary that leads with reasoning, impact, evidence and recommendations.
