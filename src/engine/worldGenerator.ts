// Procedural World Generator Engine for Cosmogony - Rich Sandbox Complexity Edition
export type GenreType = 'fantasy' | 'cyberpunk' | 'solarpunk' | 'cosmic' | 'apocalyptic';

export interface WorldConfig {
  prompt: string;
  genre: GenreType;
  seed: number;
  worldSize: number; // 8 to 24 locations
  dangerLevel: number; // 1 to 5
  techRatio: number; // 0 to 100
  magicRatio: number; // 0 to 100
  customLore: string;
  customCharacters: CustomCharConfig[];
}

export interface CustomCharConfig {
  name: string;
  role: string;
  startingNodeName: string;
  factionName: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  dialogue: string[];
  factionId: string;
  reputationRequired: number;
  isMerchant?: boolean;
  inventoryForSale?: Item[];
  buyPrices?: Record<string, number>; // Item ID -> Credits price
  quest?: Quest;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'key' | 'lore' | 'relic' | 'consumable';
  usableAtNodeId?: string;
  resolvesHazard?: string; // Links to node environmental hazards!
  creditValue?: number; // How much it sells for
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  searched: boolean;
  itemRewardId?: string;
  loreReward?: string;
  threatLevel: number;
  creditReward?: number; // Credits hidden in ruins!
}

export interface WorldNode {
  id: string;
  name: string;
  biome: string;
  description: string;
  danger: number;
  x: number;
  y: number;
  connections: string[];
  npcs: NPC[];
  items: Item[];
  landmarks: Landmark[];
  status: 'unexplored' | 'visited' | 'active';
  hazard?: string; // Environmental conditions that alter gameplay rules!
  hazardResolved?: boolean;
  layer: 'core' | 'outer' | 'void'; // Node layer ring depth
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  alignment: string;
  standing: number; // Player's standing (0 to 100)
  motive: string;
  isHostileInitially?: boolean;
}

export interface LoreEvent {
  id: string;
  era: string;
  title: string;
  description: string;
  isCustom?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetNPCId?: string;
  targetLandmarkId?: string;
  requiredItemId?: string;
  rewardItemId?: string;
  rewardFactionId?: string;
  rewardReputation: number;
  rewardCredits?: number;
  completed: boolean;
  stage: number; // Chains support: 1 = Active, 2 = Completed
  details?: string;
}

export interface CharacterProfile {
  className: string;
  sideStory: string;
  baseHealth: number;
  baseStrength: number;
  baseAgility: number;
  baseIntellect: number;
}

export interface WorldState {
  name: string;
  description: string;
  seed: number;
  genre: GenreType;
  nodes: WorldNode[];
  factions: Faction[];
  loreTimeline: LoreEvent[];
  activeNodeId: string;
  magicRatio?: number;
  techRatio?: number;
  dangerLevel?: number;
  characterProfile?: CharacterProfile;
}

// Pseudo-random number generator based on a seed
class SeededRandom {
  private m_w: number;
  private m_z: number;

  constructor(seed: number) {
    this.m_w = (seed || 1) & 0xffffffff;
    this.m_z = 987654321 & 0xffffffff;
  }

  next(): number {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & 0xffffffff;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & 0xffffffff;
    let result = ((this.m_z << 16) + this.m_w) >>> 0;
    return result / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

// Rich Procedural Generators Vocabularies
const WORLD_NAMES: Record<GenreType, { prefixes: string[], suffixes: string[] }> = {
  fantasy: {
    prefixes: ["Aetheria", "Eldoria", "Valerion", "Celestia", "Sylvanor", "Gloomhaven", "Myriddia", "Solaris", "Chronos", "Astral"],
    suffixes: ["of the High Spires", "Realm of Crystal Currents", "the Arcane Canopy", "under Eternal Stars", "the Gilded Vale", "of the Frozen Timeline", "of the Weave Spindle"]
  },
  cyberpunk: {
    prefixes: ["Neo-Chiba", "Sector-9", "Aether-Grid", "Chrono-Metropolis", "Synapse-City", "Holo-Kyoto", "Glitch-Net", "Cipher-Core", "Matrix", "Megacorp"],
    suffixes: ["Grid-7", "under the Neon Fog", "the Cyberscape", "District Eleven", "Core-Omega", "of the Blackened Clouds", "of memory shards"]
  },
  solarpunk: {
    prefixes: ["Aero-Archipelago", "Helios-Villas", "Chlorophyll-Spires", "Verdant-Glass", "Zephyr-Isles", "Terra-Nova", "Ecotopia", "Photosynth", "Canopy"],
    suffixes: ["in the Radiant Stratosphere", "the Photosynthetic Canopy", "the Glass Haven", "of Infinite Breezes", "of recycled grids", "the Verdant Weft"]
  },
  cosmic: {
    prefixes: ["Carcosa", "Void-Grave", "Rlyeh-Reach", "Null-Sphere", "Nebula-Abyss", "Stellar-Horror", "Eldritch-Deep", "Yogg-Chamber", "Singularity"],
    suffixes: ["of the Blind Stars", "the Writhing Horizon", "the Sleeping Dimension", "of Non-Euclidean Depths", "of Gravity Wells", "the Void Threshold"]
  },
  apocalyptic: {
    prefixes: ["Dust-Haven", "Scrap-Canyon", "Cinder-Reach", "Oasis-Zero", "Iron-Wasteland", "Ashen-Spires", "Rust-Basin", "Scorched-Flat", "Fallout"],
    suffixes: ["of the Scorched Age", "the Rust Dunes", "under the Dead Sky", "the Fallout Citadel", "Sector Zero", "of the Irradiated Horizon"]
  }
};

const BIOMES: Record<GenreType, string[]> = {
  fantasy: ["Mana-Infused Forest", "Floating Sky-Spire", "Glittering Crystal Cave", "Ancient Whispering Grove", "Sunken Arcane ruins", "Resonance Plateau", "Astral Caldera"],
  cyberpunk: ["Underbelly Slums", "Neon Skyline Spires", "Smog-Choked Server Farms", "Holographic Bazaar", "Industrial Grid Core", "Cipher-Block District", "Fiber-Optic Sewer"],
  solarpunk: ["Solar Glass Domes", "Bio-Mechanical Gardens", "Wind-Spindle Archipelago", "Algae Power Lagoons", "Terraced Canopy Terrariums", "Photosynthetic Terraces", "Kinetic Spire Flats"],
  cosmic: ["Writhing Starlight Crags", "Gravitational Sink-Holes", "Non-Euclidean Void Chambers", "Silent Singularity Reefs", "Madness-Infused Ruins", "Event Horizon Slabs", "Void-Shell Spindle"],
  apocalyptic: ["Acid-Rusted Scrap Yards", "Scorched Salt Flats", "Subterranean Vault Shelters", "Ashen Obsidian Canyons", "Irradiated Swamps", "Rust-Ship Valley", "Shattered Fallout Dome"]
};

// 4 detailed factions per genre
const FACTIONS: Record<GenreType, { name: string, desc: string, alignment: string, motive: string, hostile?: boolean }[]> = {
  fantasy: [
    { name: "Order of Astral Scribes", desc: "A guild of ancient mages cataloging stellar timelines and locking away gravity runic equations.", alignment: "Lawful Neutral", motive: "To catalog and lock away dangerous cosmic magic." },
    { name: "Sun-Spinners Guild", desc: "Artisans weaving solar light into key items, relics, and sails for aetherial sky ships.", alignment: "Chaotic Good", motive: "To bring light energy to all free settlements." },
    { name: "Lunar Void Keepers", desc: "A fanatical, hostile sect seeking to break the solar grid locks and collapse coordinate barriers.", alignment: "Neutral Evil", motive: "To break the sun's locks and let the dark moon govern.", hostile: true },
    { name: "Aether-Core Consortium", desc: "A neutral trade assembly managing arcane merchants and supply networks across floating swards.", alignment: "True Neutral", motive: "Trading resources and relics to secure credits capital." }
  ],
  cyberpunk: [
    { name: "Synapse Megacorp", desc: "The authoritarian corporate grid controller that surveils citizen minds and memory blocks.", alignment: "Lawful Evil", motive: "Complete digital cataloging and surveillance of all minds." },
    { name: "Glitch-Net Rebels", desc: "Underground deckers trying to bypass firewalls and distribute corporation memory files.", alignment: "Chaotic Good", motive: "To overthrow the megacorp and distribute the grid memory." },
    { name: "Memory Brokers Union", desc: "Neutral information dealers trading encrypted cyber-logs, black logs, and scrambler relics.", alignment: "True Neutral", motive: "Securing capital and trading rare historical secrets." },
    { name: "Cyber-Gear Cartel", desc: "A neutral syndicate running holographic shops and selling keycards and memory drives.", alignment: "True Neutral", motive: "Controlling local market credit systems." }
  ],
  solarpunk: [
    { name: "Wind-Spindle Architects", desc: "High architects coordinating skyward kinetic towers and aether-wind energy grids.", alignment: "Lawful Good", motive: "Expanding clean aether-wind energy grids to other floating islands." },
    { name: "Bio-Algae Collective", desc: "Green alchemists growing photosynthetic bio-fuel reservoirs and domed flora sanctuaries.", alignment: "Neutral Good", motive: "To merge human architecture completely with plant life." },
    { name: "Rust Reclamation League", desc: "Scavengers who dismantle ancient corporate towers to recycle toxic parts into solar converters.", alignment: "Chaotic Neutral", motive: "Recycling old machinery and preventing eco-collapses." },
    { name: "Archipelago Trade Cooperative", desc: "A league of merchants managing wind sails and cargo caravans to coordinate resource distribution.", alignment: "True Neutral", motive: "Distributing bio-agricultural components fairly." }
  ],
  cosmic: [
    { name: "Watchers of the Blank Eye", desc: "Boundary scholars constructing focal lenses to detect dimensional cracks and shield sectors.", alignment: "Lawful Neutral", motive: "To construct shields preventing cosmic entities from entering." },
    { name: "Keepers of the Writhing Maw", desc: "A terrifying, hostile cult trying to summon void leviathans to feed on active timelines.", alignment: "Chaotic Evil", motive: "To trigger a dimensional collapse to feed the void gods.", hostile: true },
    { name: "Void-Farers Concord", desc: "Seasoned star sailors mapping black-hole gravity corridors and shipping singularity fuels.", alignment: "True Neutral", motive: "Navigating dimensional hazards safely for rare resources." },
    { name: "Eldritch Trade Syndicate", desc: "Illegal black-market smugglers selling focus lenses and suppression reagents.", alignment: "True Neutral", motive: "Securing dimensional relics for the highest credit bidders." }
  ],
  apocalyptic: [
    { name: "Rust-Scythe Raiders", desc: "A heavily armed scrap scavenger militia that intercepts traveler warps and blockades dunes.", alignment: "Chaotic Evil", motive: "Demanding heavy scrap-tolls and raiding weak shelters.", hostile: true },
    { name: "Oasis-Zero Hydrologists", desc: "Scientists protecting water reservoirs and purifying toxic acid pools.", alignment: "Lawful Good", motive: "Distributing water fairly and defending the reservoir." },
    { name: "Scrap-Forge Alliance", desc: "Hardy mechanics welding scrap metal into welding torches and navigation coordinates.", alignment: "True Neutral", motive: "Securing rare scrap blueprints and trading parts." },
    { name: "Dune-Wanderer Caravans", desc: "A traveling alliance running scrap marketplaces and selling protective filter devices.", alignment: "True Neutral", motive: "Trading water filters and scrap gears across the ruins." }
  ]
};

const LANDMARKS: Record<GenreType, { name: string, desc: string }[]> = {
  fantasy: [
    { name: "Whispering Arch", desc: "A towering granite arch. Standing near it projects faint acoustic resonance logs from old eras." },
    { name: "Obelisk of the Third Star", desc: "A massive crystal monolith humming in key harmonic magic registers." },
    { name: "Sunken Library of Sylvan", desc: "Flooded stone chambers storing waterlogged scrolls and glowing parchment chronicles." },
    { name: "Astral Forge Cauldron", desc: "An open active magical furnace baring solar lights to smelt components." },
    { name: "Obsidian Void Spindle", desc: "A cracked dark tower that acts as a gravitational anchor for the coordinate weft." }
  ],
  cyberpunk: [
    { name: "Central Grid Pylon", desc: "A mega-skyscraper broadcasting neon arrays, housing high-security corporation databases." },
    { name: "Underground Memory Bazaar", desc: "A narrow, dark alley packed with digital kiosks and black-market scrambler shops." },
    { name: "Decommissioned Holo-Theater", desc: "A collapsing theatre dome showing flickering historical memories logs." },
    { name: "Server Tower Alpha Core", desc: "A freezing high-security vault storing digital mind hashes, chilled by liquid nitrogen." },
    { name: "Cipher-Block Terminal", desc: "A terminal interface covered in interface cables, tracking grid telemetry." }
  ],
  solarpunk: [
    { name: "Spindle Wind Turbine Core", desc: "A titanic wind generator with sails made of canvas and solar fiber, humming softly." },
    { name: "Helios Algae Power Reservoir", desc: "A glass dome containing glowing green bio-luminescent algae fuel pools." },
    { name: "Canopy Glass Greenhouse", desc: "A floating high-oxygen sanctuary where vertical gardens grow without gravity." },
    { name: "Recycled Scrap Spire", desc: "A beautiful sculpture constructed from corporate wreckage, repurposed as a solar panel array." },
    { name: "Zephyr Kinetic Battery Hub", desc: "A central terminal recharging copper batteries from wind movements." }
  ],
  cosmic: [
    { name: "Non-Euclidean Archways", desc: "Stone arches whose physical angles warp refractions and visually distress observers." },
    { name: "Silent Singularity Pit", desc: "A massive depression in the crust where all local acoustic wave forms are instantly absorbed." },
    { name: "Writhing Nebula Prism", desc: "A gargantuan focusing lens baring space shadows and shifting dimensional layers." },
    { name: "Shrine of the Blank Star", desc: "An ancient stone altar tracking the location of a missing coordinates sector." },
    { name: "Gravity-Well Sinking Pillar", desc: "An obelisk that vibrates in tune with stellar black holes." }
  ],
  apocalyptic: [
    { name: "Rust Ship Graveyard", desc: "A sand basin filled with ancient rusted steel freighters stranded in dry dunes." },
    { name: "Subterranean Shelter-3", desc: "A heavy steel blast hatch leading to dark, evacuated bunker levels." },
    { name: "Acid Refinery Vault", desc: "An industrial ruins venting toxic chemical vapors, storing clean copper pipes." },
    { name: "Scrap Welder's Lookout Spire", desc: "A lookout tower constructed from welded car hulls and scrap sheets." },
    { name: "Oasis Reservoir Dam", desc: "A concrete wall safeguarding the region's final purified freshwater reservoir." }
  ]
};

const ITEMS: Record<GenreType, { name: string, desc: string, type: 'key' | 'lore' | 'relic' | 'consumable', value: number }[]> = {
  fantasy: [
    { name: "Starlight Decipher Key", desc: "A magnifying lens made of crystal that deciphers encrypted runes.", type: "key", value: 30 },
    { name: "Vial of Astral Oil", desc: "Glowing lubricant that resolves Mana-Resonance Feedback Storm hazards.", type: "consumable", value: 15 },
    { name: "Eldorian Chronicle Shard", desc: "An ancient scripture containing memories of high spires.", type: "lore", value: 20 },
    { name: "Sylvan Chrono-Rune", desc: "A runic device boosting Aether Resonance by +10.", type: "relic", value: 60 }
  ],
  cyberpunk: [
    { name: "Synapse Decryption Drive", desc: "A USB chip containing code to override Grid Security Lockouts.", type: "key", value: 30 },
    { name: "Liquid Nitrogen Capsule", desc: "Cooling fluid used to bypass Grid security firewall locks.", type: "consumable", value: 15 },
    { name: "Redacted Corporate Log", desc: "A database disk showing evidence of corporate surveillance plans.", type: "lore", value: 20 },
    { name: "Anti-Surge Scrambler Matrix", desc: "A cyberware modification boosting Techno-Cognition by +10.", type: "relic", value: 60 }
  ],
  solarpunk: [
    { name: "Wind-Spindle Torque Key", desc: "A key tool required to realign kinetic turbine sectors.", type: "key", value: 30 },
    { name: "Enriched Bio-Algae Capsule", desc: "A filtration agent resolving Eco-Toxic Corrosive Cloud hazards.", type: "consumable", value: 15 },
    { name: "Eco-Restoration Blueprint", desc: "A schema detailing methods to turn scrap dunes into green fields.", type: "lore", value: 20 },
    { name: "Zephyr Kinetic Battery", desc: "An infinite solar-wind capacitor boosting Techno-Cognition by +10.", type: "relic", value: 60 }
  ],
  cosmic: [
    { name: "Blank Eye Focusing Lens", desc: "A lens designed to focus and clear non-euclidean angle refractions.", type: "key", value: 30 },
    { name: "Insanity-Suppressant Draft", desc: "A chemical compound resolving Gravity Singularity Tide hazards.", type: "consumable", value: 15 },
    { name: "Tome of Redacted Coordinates", desc: "An astronomer's ledger detailing coordinates that have vanished.", type: "lore", value: 20 },
    { name: "Singularity Gravity Heart", desc: "A magnetic containment sphere hosting a miniature black hole (+10 Aether Resonance).", type: "relic", value: 60 }
  ],
  apocalyptic: [
    { name: "Scrap Welder welding torch", desc: "A high-temperature torch to melt locked hatch valves.", type: "key", value: 30 },
    { name: "Purified Water Filter", desc: "A filter element resolving Irradiated Acid Rainstorm hazards.", type: "consumable", value: 15 },
    { name: "Vault Operations Manual", desc: "A log detailing the final evacuated panic days in Shelter-3.", type: "lore", value: 20 },
    { name: "Heavy scrap Armor vest", desc: "Welded titanium chest plating boosting Dimensional Resolve by +12.", type: "relic", value: 60 }
  ]
};

const HAZARDS: Record<GenreType, { name: string, desc: string, resolvesWith: string }[]> = {
  fantasy: [{ name: "Mana-Resonance Feedback Storm", desc: "High arcane feedback currents. Warp searches require [Vial of Astral Oil] to stabilize containment, otherwise sector threat level is doubled!", resolvesWith: "Vial of Astral Oil" }],
  cyberpunk: [{ name: "Grid Security Firewall Lockout", desc: "Mega-server locks. Grid coordinates cannot be searched without deploying [Liquid Nitrogen Capsule] to freeze core servers!", resolvesWith: "Liquid Nitrogen Capsule" }],
  solarpunk: [{ name: "Eco-Toxic Corrosive Cloud", desc: "High sulfur cloud. Traversal and search blocked unless [Enriched Bio-Algae Capsule] is dispersed to purify the zone!", resolvesWith: "Enriched Bio-Algae Capsule" }],
  cosmic: [{ name: "Dimensional Gravity Singularity Tide", desc: "Singularity coordinates. Faction citizens refuse dialog unless you consume [Insanity-Suppressant Draft] to anchor your mind!", resolvesWith: "Insanity-Suppressant Draft" }],
  apocalyptic: [{ name: "Irradiated Acid Rainstorm", desc: "Irradiated sky rain. Travel warp exit costs 20 credits scrap toll unless [Purified Water Filter] is deployed!", resolvesWith: "Purified Water Filter" }]
};

const NPC_NAMES: Record<GenreType, string[]> = {
  fantasy: ["Archmage Zephyrus", "Kaelen the Loom-Spinner", "Elder Lyra", "Elara the Sun-Watcher", "Mirela the Rogue", "Garrick the Shield", "Consul Thorne", "Vanya the Weaver"],
  cyberpunk: ["Net-Scrapper Jax", "Executive Chen", "Broker Vex", "Deck-Head Kira", "Dr. Hannes", "Memory-Scrapper Zero", "Cipher-Master Kael", "Vanguard Lin"],
  solarpunk: ["Finn the Windspindle Architect", "Meadow the Botanist", "Kiri the Scrapper", "Aero-Pilot Sol", "Green-Keeper Cael", "Silas the Reclaimer", "Architect Vance", "Tula the Weaver"],
  cosmic: ["Astronomer Dr. Aris", "High Priest Yogg", "Captain Anya", "The Silent Watcher", "Lorekeeper Koth", "Void-Stalker Cass", "Navigator Vohn", "Scribe Moros"],
  apocalyptic: ["Magnus the Scrap King", "Maya the Hydrologist", "Jolt the Scrapper", "Ghor the Raider Boss", "Cole the Merchant", "Otis the Tinker", "Sentinel Ward", "Mara the Scourge"]
};

/**
 * Generates a deeply complex, procedurally rich, multilayered WorldState
 */
export function generateWorld(config: WorldConfig): WorldState {
  const rand = new SeededRandom(config.seed);
  
  // 1. Procedurally Forge World Names
  const namePrefix = rand.pick(WORLD_NAMES[config.genre].prefixes);
  const nameSuffix = rand.pick(WORLD_NAMES[config.genre].suffixes);
  const worldName = `${namePrefix} ${nameSuffix}`;
  
  const generatedDesc = `A highly complex ${config.genre} universe forged from prompt: "${config.prompt}". Technology index stands at ${config.techRatio}%, and aetherial magic index at ${config.magicRatio}%. Class-${6 - config.dangerLevel} safety catalog.`;

  // 2. Generate Rich Competing Factions
  const factionPresets = FACTIONS[config.genre];
  const factions: Faction[] = factionPresets.map((f, index) => ({
    id: `faction_${index + 1}`,
    name: f.name,
    description: f.desc,
    alignment: f.alignment,
    standing: f.hostile ? 20 : 50, // Starting hostiles low!
    motive: f.motive,
    isHostileInitially: f.hostile
  }));

  // 3. Multi-Layer Coordinate Placement (Core, Outer, Void layers!)
  const totalLocations = Math.max(8, config.worldSize);
  const nodes: WorldNode[] = [];
  const biomePresets = BIOMES[config.genre];
  
  for (let i = 0; i < totalLocations; i++) {
    // Distribute coordinates across Core (0-30%), Outer (30-70%), and Void (70%+) rings!
    let ring: 'core' | 'outer' | 'void' = 'core';
    let minRadius = 140;
    let maxRadius = 190;
    
    if (i >= Math.floor(totalLocations * 0.75)) {
      ring = 'void';
      minRadius = 320;
      maxRadius = 380;
    } else if (i >= Math.floor(totalLocations * 0.35)) {
      ring = 'outer';
      minRadius = 220;
      maxRadius = 290;
    }

    const angle = (i / totalLocations) * 2 * Math.PI;
    const radius = minRadius + rand.nextInt(0, maxRadius - minRadius);
    // Center at (400, 300)
    const x = Math.round(400 + Math.cos(angle) * radius);
    const y = Math.round(300 + Math.sin(angle) * radius);

    const baseBiome = biomePresets[i % biomePresets.length];
    const nodeName = `${baseBiome} #${rand.nextInt(100, 999)}`;

    nodes.push({
      id: `node_${i + 1}`,
      name: nodeName,
      biome: baseBiome,
      description: `A highly complex coordinate sector cataloged within the ${ring} sector layers. The environment exhibits ${baseBiome.toLowerCase()} factors with dynamic structural currents.`,
      danger: rand.nextInt(1, config.dangerLevel + (ring === 'void' ? 2 : ring === 'outer' ? 1 : 0)),
      x,
      y,
      connections: [],
      npcs: [],
      items: [],
      landmarks: [],
      status: i === 0 ? 'active' : 'unexplored',
      layer: ring
    });
  }

  // 4. Advanced Constellation Path Matrix Mapping
  // Form ring paths
  for (let i = 0; i < totalLocations; i++) {
    const nextIdx = (i + 1) % totalLocations;
    nodes[i].connections.push(nodes[nextIdx].id);
    nodes[nextIdx].connections.push(nodes[i].id);

    // Core-to-Outer-to-Void bridges!
    if (i % 3 === 0) {
      const bridgeIdx = (i + Math.floor(totalLocations / 3)) % totalLocations;
      if (bridgeIdx !== i && !nodes[i].connections.includes(nodes[bridgeIdx].id)) {
        nodes[i].connections.push(nodes[bridgeIdx].id);
        nodes[bridgeIdx].connections.push(nodes[i].id);
      }
    }
  }

  // 5. Procedural Hazards Placement
  const hazardPool = HAZARDS[config.genre];
  nodes.forEach((node, idx) => {
    // Void and Outer sectors have 60% chance of environmental hazards!
    if ((node.layer === 'void' || node.layer === 'outer') && (idx % 2 === 1)) {
      const picked = rand.pick(hazardPool);
      node.hazard = picked.name;
      node.description += ` WARNING: The coordinates are warped by active '${picked.name}'. ${picked.desc}`;
    }
  });

  // 6. Spawn NPCs, Landmark Ruins, and Marketplace Merchants
  const npcNamePool = NPC_NAMES[config.genre];
  const itemPresets = ITEMS[config.genre];
  const landmarkPresets = LANDMARKS[config.genre];

  nodes.forEach((node, nodeIdx) => {
    // A) Landmark Ruins & Loot
    const landmarkPreset = landmarkPresets[nodeIdx % landmarkPresets.length];
    const itemRewardPreset = itemPresets[nodeIdx % itemPresets.length];

    const rewardItem: Item = {
      id: `item_${node.id}_reward`,
      name: itemRewardPreset.name,
      description: itemRewardPreset.desc,
      type: itemRewardPreset.type,
      usableAtNodeId: itemRewardPreset.type === 'key' ? `node_${(nodeIdx + 3) % totalLocations + 1}` : undefined,
      resolvesHazard: itemRewardPreset.type === 'consumable' ? itemRewardPreset.name : undefined,
      creditValue: itemRewardPreset.value
    };
    node.items.push(rewardItem);

    const isVoid = node.layer === 'void';
    const landmark: Landmark = {
      id: `landmark_${node.id}`,
      name: `${node.name.split(' #')[0]}'s ${landmarkPreset.name}`,
      description: landmarkPreset.desc,
      searched: false,
      itemRewardId: rewardItem.id,
      loreReward: `Survey complete. Decrypted data reveals historical logs from Scribe archives concerning early dimensional spindles.`,
      threatLevel: node.danger,
      creditReward: rand.nextInt(15, isVoid ? 75 : 40)
    };
    node.landmarks.push(landmark);

    // B) NPCs & Merchant Cartel coordinates!
    // Faction 4 is always the trade alliance! Core nodes 1 & 4 host dedicated Merchants!
    const isTradeNode = nodeIdx === 0 || nodeIdx === 3 || nodeIdx === 5;
    const factionIdx = isTradeNode ? 3 : nodeIdx % factions.length;
    const selectedFaction = factions[factionIdx];

    const npcName = npcNamePool[nodeIdx % npcNamePool.length];
    const dialoguePool = [
      `Welcome traveler. Safe coordinate warping is rare these days.`,
      `We, the ${selectedFaction.name}, track structural balance. Keep an eye on local grid hazards.`
    ];

    const npc: NPC = {
      id: `npc_${node.id}`,
      name: npcName,
      role: isTradeNode ? "Cartel Merchant" : rand.pick(["Archivist", "Vanguard", "Chronos Sailor", "Scrap Welder", "Glitch Deck-head"]),
      description: isTradeNode ? `A registered trader running a structural coordinate marketplace.` : `A citizen representing ${selectedFaction.name}.`,
      dialogue: dialoguePool,
      factionId: selectedFaction.id,
      reputationRequired: node.layer === 'void' ? 60 : 50
    };

    // If marked as Merchant, supply shop items!
    if (isTradeNode) {
      npc.isMerchant = true;
      npc.dialogue.unshift(`"Looking to buy navigation keycards or protective filters? Spend your starlit credits here!"`);
      
      // Select 3 random products to sell
      const forSale: Item[] = [];
      const buyPrices: Record<string, number> = {};

      for (let s = 0; s < 3; s++) {
        const itemPreset = itemPresets[(nodeIdx + s) % itemPresets.length];
        const shopItem: Item = {
          id: `item_shop_${node.id}_${s}`,
          name: itemPreset.name,
          description: itemPreset.desc,
          type: itemPreset.type,
          usableAtNodeId: itemPreset.type === 'key' ? `node_${rand.nextInt(1, totalLocations)}` : undefined,
          resolvesHazard: itemPreset.type === 'consumable' ? itemPreset.name : undefined,
          creditValue: Math.round(itemPreset.value * 0.4)
        };
        forSale.push(shopItem);
        buyPrices[shopItem.id] = itemPreset.value; // Shop price matches base value
      }
      
      npc.inventoryForSale = forSale;
      npc.buyPrices = buyPrices;
    }

    // C) Multi-Stage Procedural Chained Quest Chains!
    // Setup chains for outer sectors
    if (nodeIdx > 1 && nodeIdx % 3 === 1 && !isTradeNode) {
      const destNode = nodes[(nodeIdx - 2 + totalLocations) % totalLocations];
      const targetNPC = `npc_${destNode.id}`;
      const questRewardCredits = rand.nextInt(20, 60);

      npc.quest = {
        id: `quest_chain_${node.id}`,
        title: `Securing Treaties with ${destNode.name.split(' #')[0]}`,
        description: `Deliver starlit blueprints to ${destNode.name.split(' #')[0]} to bypass local hostile blockades.`,
        targetNPCId: targetNPC,
        completed: false,
        rewardFactionId: npc.factionId,
        rewardReputation: 20,
        rewardCredits: questRewardCredits,
        stage: 1,
        details: `Phase 1: Travel to target coordinates and establish warp credentials with local resident.`
      };
    }

    node.npcs.push(npc);
  });

  // 7. Inject Cosmic Loom Settings (Custom Lore & Legendary figures)
  config.customCharacters.forEach((char, idx) => {
    let matchedNode = nodes.find(n => n.name.toLowerCase().includes(char.startingNodeName.toLowerCase()));
    if (!matchedNode) matchedNode = nodes[idx % nodes.length];

    let matchedFaction = factions.find(f => f.name.toLowerCase().includes(char.factionName.toLowerCase()));
    if (!matchedFaction) matchedFaction = factions[idx % factions.length];

    const customNPC: NPC = {
      id: `custom_npc_${idx}`,
      name: char.name,
      role: char.role,
      description: `A legendary coordinate figure custom-woven from prompt configs. Faction: ${matchedFaction.name}.`,
      dialogue: [
        `Greetings. I am ${char.name}, a custom timeline entity. I maintain local structural parameters.`,
        `Be wary of coordinate hazards in the void sectors.`
      ],
      factionId: matchedFaction.id,
      reputationRequired: 50
    };
    matchedNode.npcs.unshift(customNPC);
  });

  // 8. Generate History Timeline Chronicles
  const loreTimeline: LoreEvent[] = [
    { id: "lore_1", era: "First Era (Cycle 1)", title: "Stitching the Loom Spindle", description: `The timeline coordinates were calibrated from prompt: "${config.prompt}". Magic index set to ${config.magicRatio}%, technology index to ${config.techRatio}%.` },
    { id: "lore_2", era: "Second Era (Cycle 430)", title: "The Factions Blockades", description: `Major Factions expanded their sector parameters, constructing warp blockades and local credit cartels.` },
    { id: "lore_3", era: "Third Era (Cycle 810)", title: "Vanishing Void Anomalies", description: `Several coordinates collapsed into void sectors, spawning environmental feedback singularities.` }
  ];

  if (config.customLore && config.customLore.trim().length > 0) {
    loreTimeline.push({
      id: "lore_custom",
      era: "Current Cycle (Timeline Wefts)",
      title: "Injected Historical Record (Custom Loom)",
      description: config.customLore,
      isCustom: true
    });
  } else {
    loreTimeline.push({
      id: "lore_4",
      era: "Current Cycle",
      title: "The Multiverse Explorations",
      description: "Travelers breach the starlit coordinate pathways, trading relics and scanning landmarks to secure stellar history shards."
    });
  }

  // 9. Generate Procedural Character Class & Background Side Story
  const classesList: Record<GenreType, string[]> = {
    fantasy: ["Aether Chronomancer", "Sun-Weaver Sage", "Astral Rune-Blade", "Spindle Sentinel"],
    cyberpunk: ["Glitch Runner", "Synapse Deck-head", "Memory Scrapper", "Cipher Saboteur"],
    solarpunk: ["Kinetic Turbine Engineer", "Bio-Algae Botanist", "Verdant Reclaimer", "Zephyr Pilot"],
    cosmic: ["Void-Farer Navigator", "Blank Eye Occultist", "Singularity Star-sailor", "Eldritch Scribe"],
    apocalyptic: ["Ashen Scrap Welder", "Oasis Purifier", "Dune Wanderer", "Vault Mechanic"]
  };

  const pickedClass = rand.pick(classesList[config.genre]);

  const storiesList: Record<GenreType, string[]> = {
    fantasy: [
      `Exiled from the High Spires of Astral Scribes, you carry a fluctuating magic ratio of ${config.magicRatio}% flowing directly through your veins. Marked by the spindle loom, you search parallel coordinate paths to locate the 11 shards before the Lunar Void Keepers break the solar anchors.`,
      `Born under the crystal currents, you are the last of the Spindle Sentinels. Bearing ${config.magicRatio}% arcane resonance, you carry a chronos key linked to the vanished floating islands. Your mission is to bypass magical blockades and restore balance to the constellation network.`
    ],
    cyberpunk: [
      `A rogue cyberware decker from Neo-Chiba. After Synapse Megacorp fried part of your cerebral memory blocks, you salvaged a decrypted database chip detailing the Aether Network. With a techno-cognition rating of ${config.techRatio}%, you jack into secure servers, dodging cartel blockades to decrypt timelines.`,
      `A memory broker who discovered corporate logs concerning multi-world coordinate overlays. Running on ${config.techRatio}% tech indexes, you bypassed local locks to scan ancient server ruins. Now the corporate security grid patrols hunt you down across neon slums.`
    ],
    solarpunk: [
      `A wind-sail aeronaut who grew up in the Aero-Archipelago domes. Commissioned by the Wind-Spindle Architects to repair broken wind turbine sectors, you found that turbine frequencies align with the aetheric grid codes. Armed with enriched algaes, you sail toxic clouds to secure structural fragments.`,
      `A green alchemist dedicated to reclaiming ancient rust ruins. Armed with recycled kinetic batteries, you purify toxic wastes to save local biodomes. In the wreckage of corporate towers, you scanned spatial distortions indicating paths to alternative universes.`
    ],
    cosmic: [
      `A star navigator whose mind was fractured by gravity wells near Yogg-Chamber. Haunted by whisperings of a blind star, you constructed focal lenses to detect non-euclidean distortions. You trace the coordinate cracks, ignoring faction cult blockades to anchor the reality weft.`,
      `A boundary scholar researching silent black-hole tides. Carrying a gravity-containment heart, you decipher astronomers' log books. You venture beyond core quadrants, shielding your sanity to witness the simulated multiplayer breaches.`
    ],
    apocalyptic: [
      `A salvage mechanic traversing scorch-flat rust dunes. Equipped with a scrap welding torch and heavy titanium chest plates, you excavated Shelter-3. Seeking purified water filters, you bypass raider blockades to track down coordinates to the Oasis Zero.`,
      `A dune wanderer protecting freshwater reservoirs. Escaping radioactive acid storms, you scavenged coordinate gears from stranding rust ships. You map out the ruins, trading relics with cartel merchants to assemble the multiversal timeline bridges.`
    ]
  };

  const pickedStory = rand.pick(storiesList[config.genre]);

  const characterProfile: CharacterProfile = {
    className: pickedClass,
    sideStory: pickedStory,
    baseHealth: 100,
    baseStrength: rand.nextInt(10, 15),
    baseAgility: rand.nextInt(10, 15),
    baseIntellect: rand.nextInt(10, 15)
  };

  return {
    name: worldName,
    description: generatedDesc,
    seed: config.seed,
    genre: config.genre,
    nodes,
    factions,
    loreTimeline,
    activeNodeId: nodes[0].id,
    magicRatio: config.magicRatio,
    techRatio: config.techRatio,
    dangerLevel: config.dangerLevel,
    characterProfile
  };
}
