# 🌌 Cosmogony — The Interactive Seeded World Forge & Text RPG

Cosmogony is a premium, starlit space-fantasy text adventure and procedural world-building engine. Initiated players can weave completely custom universes, forge ancient timelines, inject custom legendary figures, warp across glowing constellation vector maps, trade with merchants, and bypass hostile patrols using an immersive keyboard narrative console prompter.

👉 **Play the Live Deployed Production Build Immediately**:  
**[https://world-generation-ten.vercel.app](https://world-generation-ten.vercel.app)**

---

## 📖 Deep System Documentation
For an exhaustive, multi-dimensional technical review of Cosmogony's engine algorithms, coordinate projection mathematics, RPG stat calculations, atmospheric hazards, and architectural layouts, please explore the primary documentation ledger:

👉 **[View system documentation & developer guide](./documentation.md)**

---

## 🌟 Key Gameplay Features

### 1. The Cosmic Loom (Foldable Sidebar)
*   Configure prompts (e.g. *Copper sanctuaries floating in toxic neon clouds*), seeds, threat ratios, magic vs tech ratios, and timeline custom lore.
*   Weave customized legendary characters, roles, and starting coordinates directly into the generated coordinate space lanes.
*   Once generated, the Loom collapses automatically into a beautiful dual-panel exploration layout.

### 2. High-Tech Login & Signup Matrix
*   Register a custom **Consciousness Designation Name** and **Initial Explorer Title** (e.g. *Star Drifter*, *Grid Wanderer*) inside our frosted glass registration console.
*   Session caching keeps timeline connections alive so you are always restored in the same coordinate universe on returning.

### 3. Sleek Floating Explorer Soul Panel Overlay
*   Projects your user details, active profile orb, and **dynamically mutating progression titles** in real-time in the top-right of your screen.
*   Titles mutate automatically as you traverse nodes, complete quests, find fragments, or build faction reputations.
*   Includes a `Disconnect` button to safely log out of your session.

### 4. Interactive RPG Attributes & Stats HUD
*   Click the compact HUD bar at the top of the narrative console or the `📊 Explorer Stats` button in the header to reveal your frosted **Explorer Bio & Attributes Modal**.
*   **Dynamic Visual Gauges**: Tracks VIT (Health), STR (Strength), AGI (Agility), and INT (Intellect) with beautiful custom bars.
*   **Procedural Chronicle Origin**: Read the procedurally compiled alignment class and chronicled origins backstory unique to your seed and genre config.
*   **Attributes calculations**: Scaled dynamically based on active gameplay parameters (e.g. Strength is derived from Dimensional Resolve, Intellect is derived from Aether Resonance).

### 5. SVG Star Constellations Vector Map
*   Travel along connected path channels between nodes. Nodes render custom hover-detailing cards projecting threat levels, biomes, and NPC summaries.

### 6. Narrative Command Console & Error Prompter
*   Exploration is strictly command-driven! Type natural text actions (e.g. `go Neon Skyline`, `search ancient pylon`, `talk to Finn`, `complete quest`, `status`, `help`).
*   **Plausible Scanner Dossier**: A collapsible scanner ledger highlights valid neighbor star nodes, landmarks, and resident handles to help you type.
*   **Stylized System Prompts**: Trying impossible warps or speaking to absent citizens outputs structured error alerts (e.g. `⚠️ Error: Frequencies disconnected...`).

### 7. Concentric Rings, Hazards & Blockades
*   **Sector Ring Circles**: Travel across Core, Outer, and Void Rings where danger levels scale and rewards surge.
*   **Atmospheric Hazards**: outer sectors spawn anomalies (Mana Storms, Eco-Clouds, Scanners lockouts, Singularity tides) that block entry or searches until neutralized by specialized filters from your Codex pack.
*   **Hostile Patrol Blockades**: Entering coordinate lanes controlled by factions with low standing (< 35) triggers emergency blockades. Players must run console overrides: `combat`, `evade`, or `bribe [credits]` to pass.
*   **Cartel Credits Marketplace**: Scavenge credits, or trade reliquaries, filters, and items with Cartel Merchants using simple `buy [item]` and `sell [item]` console protocols.

---

## 🛠️ Local Installation & Development

To clone, modify, and run the starlit world forge engine locally on your machine, follow these steps:

### 1. Prerequisities
Make sure you have Node.js installed (v18+ recommended) and npm.

### 2. Install Dependencies
Clone the repository and install packages:
```bash
npm install
```

### 3. Run Dev Server
Launch Vite's hot-reloading development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build Production Bundle
To compile TypeScript and build a highly optimized client bundle:
```bash
npm run build
```
Production assets will compile successfully into the `dist/` directory, ready to be served statically.

---

## 🔮 Future Horizon Roadmap Teasers
*   **Higher-Order Relics**: Ancient items of immense reality-bending power accessible in the Hidden World.
*   **The "Origin Breaker" (Invasions)**: Breach absolute coordinate barriers to invade other active players' generated timelines as dimensional harbingers!
*   **Sentient Aetheric Intelligence**: An agentic cognitive system that gives NPCs autonomous goal-planning and vector-retrieval reasoning profiles.

---
*Developed by Google DeepMind Advanced Agentic Coding Pair-Programming Teams.*
