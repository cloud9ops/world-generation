// Secret Meta-Progression Engine for Cosmogony

export interface SecretFragment {
  id: string;
  name: string;
  description: string;
  type: 'item' | 'lore';
  rarityText: string;
}

export const SECRET_FRAGMENTS: SecretFragment[] = [
  {
    id: "frag_1",
    name: "Astral Chronometer",
    description: "An ancient brass clock face that measures stellar lifetimes instead of hours. The gears turn in reverse.",
    type: "item",
    rarityText: "Mythic Origin Item"
  },
  {
    id: "frag_2",
    name: "Whisper-Coded Gear",
    description: "A golden cogwheel inscribed with mechanical prayers. It vibrates softly when held near ancient machinery.",
    type: "item",
    rarityText: "Lost Technology"
  },
  {
    id: "frag_3",
    name: "Sliver of the First Mirror",
    description: "A crystalline shard that does not reflect your face, but an alternate sky filled with purple nebulae.",
    type: "item",
    rarityText: "Dimensional Anchor"
  },
  {
    id: "frag_4",
    name: "Sigil of the Broken Spindle",
    description: "A cracked obsidian rune that hums with low gravitational frequencies, warping the air around it.",
    type: "lore",
    rarityText: "Forbidden Sign"
  },
  {
    id: "frag_5",
    name: "Cinder-Seed of the Dying Sun",
    description: "A microscopic spark locked in a sphere of pressurized stellar glass. It radiates absolute silence.",
    type: "item",
    rarityText: "Stellar Relic"
  },
  {
    id: "frag_6",
    name: "Null-Space Cipher",
    description: "An ancient scroll detailing mathematical proofs that successfully divide by zero. It hurts to look at.",
    type: "lore",
    rarityText: "Paradox Scripture"
  },
  {
    id: "frag_7",
    name: "Echo of the Void Bells",
    description: "A resonant soundwave captured and frozen within a chunk of metallic deep-space amber.",
    type: "lore",
    rarityText: "Acoustic Singularity"
  },
  {
    id: "frag_8",
    name: "Loom-Weaver's Needle",
    description: "A metallic needle made of compacted stellar iron, used to stitch the magnetic field lines of baby planets.",
    type: "item",
    rarityText: "Cosmic Implement"
  },
  {
    id: "frag_9",
    name: "Scribe's Redacted Chronicle",
    description: "A historical scroll where every third word is written in glowing particles of pure energy. It tells a forbidden history.",
    type: "lore",
    rarityText: "Redacted Codex"
  },
  {
    id: "frag_10",
    name: "Aetherial Prismatic Compass",
    description: "A floating compass needle made of glass. It does not point north, but towards the center of the multiverse.",
    type: "item",
    rarityText: "Multiversal Compass"
  },
  {
    id: "frag_11",
    name: "Key to the Origin Arch",
    description: "An ornate key composed entirely of heavy, compacted gravity. It distorts nearby light rays.",
    type: "item",
    rarityText: "Arch Key"
  }
];

// LocalStorage Keys
const COLLECTED_FRAGMENTS_KEY = "cosmogony_collected_meta_fragments";
const AETHER_CHAT_LOGS_KEY = "cosmogony_aether_chat_logs";

export interface AetherMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'enlightened' | 'multiverse' | 'system';
}

// Preset immersive conversations from other explorers who crossed the threshold
export const INITIAL_AETHER_MESSAGES: AetherMessage[] = [
  {
    id: "msg_1",
    sender: "Oracle of the Clockwork Spires",
    content: "The spindle was never meant to hold single threads. I created a world where the stars are fueled by copper oils, and yet the Void bells still echo. Who else listens?",
    timestamp: "Chronos Cycle 72",
    type: "enlightened"
  },
  {
    id: "msg_2",
    sender: "Solaris_Drifter_09",
    content: "I found my 11th fragment in a burning toxic sea. The Scribe's Redacted Chronicle burned my fingers, but the gateway opened. The multiverse is... incredibly quiet.",
    timestamp: "Era of the Red Giant",
    type: "multiverse"
  },
  {
    id: "msg_3",
    sender: "SYSTEM_VOICE",
    content: "Warning: Origin Breaker blueprint coordinates detected in sector 4. Multiverse synchronization level: 99.8%. Beware of Harbingers.",
    timestamp: "Sync Epoch 0",
    type: "system"
  },
  {
    id: "msg_4",
    sender: "Aether_Weaver_Anya",
    content: "Wait, Solaris_Drifter, did you see the architecture? The cities aren't just built; they are woven from prompt seeds. We are all living in a grand tapestry.",
    timestamp: "Third Nebula Bloom",
    type: "enlightened"
  },
  {
    id: "msg_5",
    sender: "The_Origin_Seeker",
    content: "If you obtain the Origin Breaker, do not cross. The boundaries are fragile. I saw a Harbinger tear through my floating archipelago last night. The clouds turned to black script...",
    timestamp: "Epoch of the Broken Sky",
    type: "enlightened"
  }
];

/**
 * Gets the list of collected meta fragment IDs from LocalStorage
 */
export function getCollectedFragments(): string[] {
  const data = localStorage.getItem(COLLECTED_FRAGMENTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Adds a fragment to the collection if not already present
 * Returns true if it was newly added
 */
export function collectFragment(id: string): boolean {
  const current = getCollectedFragments();
  if (current.includes(id)) return false;
  
  const updated = [...current, id];
  localStorage.setItem(COLLECTED_FRAGMENTS_KEY, JSON.stringify(updated));
  return true;
}

/**
 * Clears the collected fragments (for debugging/resets)
 */
export function resetSecretFragments(): void {
  localStorage.removeItem(COLLECTED_FRAGMENTS_KEY);
  localStorage.removeItem(AETHER_CHAT_LOGS_KEY);
  clearExploredWorldsHistory();
}

/**
 * Micro-probability evaluator.
 * The user requested a chance of 0.00000000000000000000001% (which is 1e-23).
 * To make this fun but playable over time, we will define two probabilities:
 * 1. The LUCK ROLL: A very small chance (e.g. 1 in 4000 actions, which is 0.00025) of rolling a secret fragment when exploring landmarks.
 * 2. The Easter-Egg Roll: We check if Math.random() is less than 1e-23. If the user hits that, we unlock ALL fragments instantly!
 */
export function rollForSecretFragment(actionType: 'search' | 'travel' | 'talk'): string | null {
  const collected = getCollectedFragments();
  
  // If all are already collected, no need to roll
  if (collected.length >= SECRET_FRAGMENTS.length) return null;
  
  // 1. Check for the absolute god-like roll (1e-23)
  if (Math.random() < 1e-23) {
    // Unbelievable luck! Returns the first uncollected fragment
    const uncollected = SECRET_FRAGMENTS.filter(f => !collected.includes(f.id));
    if (uncollected.length > 0) return uncollected[0].id;
  }
  
  // 2. Playable rate: a highly restrictive base chance (e.g. 0.0001% or 1 in 1,000,000 actions)
  // Uniform chance across all actions
  let baseChance = 0.000001; 
  if (actionType === 'search') baseChance = 0.000001;
  if (actionType === 'talk') baseChance = 0.000001;
  
  if (Math.random() < baseChance) {
    const uncollected = SECRET_FRAGMENTS.filter(f => !collected.includes(f.id));
    if (uncollected.length > 0) {
      // Pick a random uncollected fragment
      const picked = uncollected[Math.floor(Math.random() * uncollected.length)];
      return picked.id;
    }
  }
  
  return null;
}

/**
 * Gets local chat messages for the Aether Network
 */
export function getAetherMessages(): AetherMessage[] {
  const data = localStorage.getItem(AETHER_CHAT_LOGS_KEY);
  if (!data) {
    localStorage.setItem(AETHER_CHAT_LOGS_KEY, JSON.stringify(INITIAL_AETHER_MESSAGES));
    return INITIAL_AETHER_MESSAGES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_AETHER_MESSAGES;
  }
}

/**
 * Sends a custom message to the Aether Network
 */
export function sendAetherMessage(sender: string, content: string): AetherMessage[] {
  const current = getAetherMessages();
  const newMessage: AetherMessage = {
    id: `custom_${Date.now()}`,
    sender: sender || "Anonymous Scribe",
    content: content,
    timestamp: "Current Timeline Cycle",
    type: "multiverse"
  };
  
  const updated = [...current, newMessage];
  localStorage.setItem(AETHER_CHAT_LOGS_KEY, JSON.stringify(updated));
  return updated;
}

import type { WorldConfig } from './worldGenerator';

export interface ExploredWorld {
  id: string;
  name: string;
  seed: number;
  genre: string;
  nodesVisited: number;
  totalNodes: number;
  timestamp: string;
  config?: WorldConfig;
}

const EXPLORED_WORLDS_KEY = "cosmogony_explored_worlds_history";

export function getExploredWorlds(): ExploredWorld[] {
  const data = localStorage.getItem(EXPLORED_WORLDS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveExploredWorld(world: ExploredWorld): void {
  const current = getExploredWorlds();
  const idx = current.findIndex(w => w.seed === world.seed);
  
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...world };
  } else {
    current.unshift(world);
  }
  
  localStorage.setItem(EXPLORED_WORLDS_KEY, JSON.stringify(current));
}

export function clearExploredWorldsHistory(): void {
  localStorage.removeItem(EXPLORED_WORLDS_KEY);
}
