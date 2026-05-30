import { useState, useEffect } from 'react';
import { LoomPanel } from './components/LoomPanel';
import { ConstellationMap } from './components/ConstellationMap';
import { ChronicleTerminal } from './components/ChronicleTerminal';
import type { ChronicleLog } from './components/ChronicleTerminal';
import { Codex } from './components/Codex';
import { AetherNetwork } from './components/AetherNetwork';

import { generateWorld } from './engine/worldGenerator';
import type { 
  WorldState, 
  WorldConfig, 
  NPC, 
  Landmark, 
  Item,
  Quest
} from './engine/worldGenerator';

import { 
  SECRET_FRAGMENTS,
  getCollectedFragments,
  collectFragment,
  rollForSecretFragment,
  resetSecretFragments,
  getExploredWorlds,
  saveExploredWorld
} from './engine/secretEngine';
import type { ExploredWorld } from './engine/secretEngine';

function App() {
  // Main World & UI States
  const [world, setWorld] = useState<WorldState | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [logs, setLogs] = useState<ChronicleLog[]>([]);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [customActionPending, setCustomActionPending] = useState(false);
  
  // Player Inventory & Standings
  const [inventory, setInventory] = useState<Item[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  
  // Credits Wallet and Active Patrol states
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('cosmogony_player_credits');
    return saved ? parseInt(saved) : 100;
  });
  const [activePatrol, setActivePatrol] = useState<{ factionId: string; toll: number; nodeId: string; factionName: string; previousNodeId: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('cosmogony_player_credits', credits.toString());
  }, [credits]);
  
  // Meta-Progression Secret Fragments state
  const [collectedFrags, setCollectedFrags] = useState<string[]>([]);
  const [showAetherNetwork, setShowAetherNetwork] = useState(false);
  const [lockedTitle, setLockedTitle] = useState(() => localStorage.getItem('cosmogony_locked_title') || '');
  const [isLoomExpanded, setIsLoomExpanded] = useState(true);
  const [exploredWorlds, setExploredWorlds] = useState<ExploredWorld[]>([]);
  
  // Gemini API configuration
  const [apiKey, setApiKey] = useState('');
  
  // Dev Mode cheat clicks
  const [devClicks, setDevClicks] = useState(0);

  // Player Name State
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('cosmogony_player_name') || 'Captain Ahab');

  const handlePlayerNameChange = (name: string) => {
    const cleanName = name || 'Anonymous Explorer';
    setPlayerName(cleanName);
    localStorage.setItem('cosmogony_player_name', cleanName);
  };

  // Dynamically compute player title based on active progression
  const getPlayerTitle = (): string => {
    if (collectedFrags.length >= 11) {
      return "The Multiverse Breacher";
    }
    if (collectedFrags.length >= 6) {
      return "Paradox Archivist";
    }
    if (collectedFrags.length >= 1) {
      return "Seeker of Whispers";
    }

    if (!world) return "Aetherial Wanderer";

    const visitedCount = world.nodes.filter(n => n.status !== 'unexplored').length;
    const questCount = activeQuests.filter(q => q.completed).length;

    // Calculate Faction maximum reputation standing
    const maxFaction = world.factions.reduce((max, f) => f.standing > max.standing ? f : max, world.factions[0]);
    
    if (maxFaction && maxFaction.standing >= 75) {
      const name = maxFaction.name.toLowerCase();
      if (name.includes('scribes') || name.includes('watchers')) return "Grand Archivist Sentinel";
      if (name.includes('spinners') || name.includes('architects')) return "Master Spindle Architect";
      if (name.includes('cultists') || name.includes('keepers')) return "Lunar Void Apostle";
      if (name.includes('megacorp') || name.includes('synapse')) return "Grid Overlord Director";
      if (name.includes('rebels') || name.includes('union')) return "Glitch-Net Cipher Rebel";
      if (name.includes('collective') || name.includes('botanist')) return "Chlorophyll Algae Warden";
      if (name.includes('reclaimer') || name.includes('reclamation')) return "Elite Iron Reclaimer";
      if (name.includes('raiders') || name.includes('scythe')) return "Scourge of the Scrap Dunes";
      if (name.includes('hydrologists') || name.includes('purifier')) return "Apex Hydro Purificator";
      return `Champion of the ${maxFaction.name.split(' ')[0]}`;
    }

    if (questCount >= 4) {
      return "Legendary Grid Courier";
    }
    if (questCount >= 1) {
      return "Aether Envoy";
    }
    if (visitedCount >= 7) {
      return "Constellation Cartographer";
    }
    if (visitedCount >= 3) {
      return "Starlit Wayfarer";
    }

    return "Timeline Recruit";
  };

  // Sync collected fragments and explored worlds on mount
  useEffect(() => {
    setCollectedFrags(getCollectedFragments());
    setExploredWorlds(getExploredWorlds());
  }, []);

  const handleForge = async (config: WorldConfig, providedKey: string) => {
    setIsForging(true);
    setApiKey(providedKey);
    setActiveNPC(null);
    setInventory([]);
    setActiveQuests([]);
    setCredits(100);
    setActivePatrol(null);

    // Decorative loading delay to simulate starlit calculations
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const newWorld = generateWorld(config);
      setWorld(newWorld);
      
      // Load any quest logs and initial travel logs
      const startNode = newWorld.nodes[0];
      const initialLogs: ChronicleLog[] = [
        {
          id: `log_init_${Date.now()}`,
          text: `Spindle calibrated. Seed: ${newWorld.seed}. Initializing grid sectors...`,
          timestamp: '00:00:00',
          type: 'system'
        },
        {
          id: `log_desc_${Date.now()}`,
          text: newWorld.description,
          timestamp: '00:00:01',
          type: 'system'
        }
      ];

      const profile = newWorld.characterProfile;
      if (profile) {
        initialLogs.push({
          id: `log_char_class_${Date.now()}`,
          text: `✦ EXPLORER ALIGNMENT IDENTIFIED: Class - ${profile.className} ✦`,
          timestamp: '00:00:01.2',
          type: 'quest'
        });
        initialLogs.push({
          id: `log_char_story_${Date.now()}`,
          text: `📜 BACKGROUND STORY: ${profile.sideStory}`,
          timestamp: '00:00:01.5',
          type: 'dialogue'
        });
      }

      initialLogs.push({
        id: `log_travel_${Date.now()}`,
        text: `You materialize inside starlit coordinates. Active Sector: ${startNode.name}. Biome: ${startNode.biome}. Landmark sensors detect anomalies.`,
        timestamp: '00:00:02',
        type: 'travel'
      });

      // Add custom legendary figures notification
      config.customCharacters.forEach((char) => {
        initialLogs.push({
          id: `log_legend_${Date.now()}_${char.name}`,
          text: `Legendary timeline entity detected: ${char.name} has been woven into Sector '${char.startingNodeName}'.`,
          timestamp: '00:00:03',
          type: 'quest'
        });
      });

      setLogs(initialLogs);
      
      // Load active quests from the world generator
      const quests: Quest[] = [];
      newWorld.nodes.forEach(n => {
        n.npcs.forEach(npc => {
          if (npc.quest) quests.push(npc.quest);
        });
      });
      setActiveQuests(quests);

      // Track this newly forged world in the archives!
      const initialExploredWorld: ExploredWorld = {
        id: `world_${Date.now()}`,
        name: newWorld.name,
        seed: newWorld.seed,
        genre: newWorld.genre,
        nodesVisited: 1,
        totalNodes: newWorld.nodes.length,
        timestamp: new Date().toLocaleDateString(),
        config: config
      };
      saveExploredWorld(initialExploredWorld);
      setExploredWorlds(getExploredWorlds());

    } catch (err) {
      console.error(err);
    } finally {
      setIsForging(false);
      setIsLoomExpanded(false);
    }
  };

  // 1. Direct Fetch Client-Side Gemini Integration
  const queryGemini = async (systemPrompt: string, userPrompt: string) => {
    if (!apiKey) return null;
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemPrompt}\n\nUser request:\n${userPrompt}` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to query Gemini API");
      }

      const resData = await response.json();
      const outputText = resData.candidates[0].content.parts[0].text;
      return JSON.parse(outputText);

    } catch (e) {
      console.error("Gemini API Error, falling back to local engine:", e);
      return null;
    }
  };

  // Evaluates secret fragments rolls
  const checkSecretRoll = (actionType: 'search' | 'travel' | 'talk') => {
    const rolledId = rollForSecretFragment(actionType);
    if (rolledId) {
      const newlyCollected = collectFragment(rolledId);
      if (newlyCollected) {
        setCollectedFrags(getCollectedFragments());
        
        // Add log
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [
          ...prev,
          {
            id: `secret_${Date.now()}`,
            text: "A Fragment of the Hidden World has been discovered.",
            timestamp,
            type: 'secret'
          }
        ]);
      }
    }
  };

  // 2. Travel Navigation Loop
  const handleTravel = async (nodeId: string) => {
    if (!world) return;
    
    if (activePatrol) {
      setLogs(prev => [
        ...prev,
        {
          id: `travel_patrol_lock_${Date.now()}`,
          text: `Error: Warp drive is locked by the hostile patrol blockade. Resolve the blockade first!`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);
      return;
    }

    const activeNode = world.nodes.find(n => n.id === world.activeNodeId);
    const targetNode = world.nodes.find(n => n.id === nodeId);
    if (!activeNode || !targetNode) return;

    // Verify connection path
    if (!activeNode.connections.includes(nodeId)) {
      return;
    }

    setCustomActionPending(true);
    setActiveNPC(null);
    
    // Simulate lag/starlit warp coordinates
    await new Promise(resolve => setTimeout(resolve, 800));

    const timestamp = new Date().toLocaleTimeString();

    // Check for local locked item gates (e.g. key items)
    const requiredItem = targetNode.items.find(i => i.type === 'key' && i.usableAtNodeId === targetNode.id);
    if (requiredItem) {
      const hasKey = inventory.some(i => i.name === requiredItem.name);
      if (!hasKey) {
        setLogs(prev => [
          ...prev,
          {
            id: `travel_fail_${Date.now()}`,
            text: `Warp failure. Sector ${targetNode.name} is locked by high-gravitational energy. Requires key item: [${requiredItem.name}].`,
            timestamp,
            type: 'system'
          }
        ]);
        setCustomActionPending(false);
        return;
      }
    }

    // HAZARD INTERCEPT AND RESOLUTION LAYER
    if (targetNode.hazard && !targetNode.hazardResolved) {
      const resolvingItem = inventory.find(i => i.type === 'consumable' && i.resolvesHazard === targetNode.hazard);
      if (resolvingItem) {
        targetNode.hazardResolved = true;
        setInventory(prev => prev.filter(item => item.id !== resolvingItem.id));
        
        const updatedNodes = world.nodes.map(n => {
          if (n.id === targetNode.id) return { ...n, hazardResolved: true };
          return n;
        });
        setWorld({
          ...world,
          nodes: updatedNodes
        });

        setLogs(prev => [
          ...prev,
          {
            id: `hazard_stabilized_${Date.now()}`,
            text: `✨ [HAZARD RESOLVED]: Upon entry, your scanners detect '${targetNode.hazard}'. You deploy [${resolvingItem.name}] from your pack, permanently neutralizing the localized hazard currents and stabilizing the sector coordinates!`,
            timestamp,
            type: 'system'
          }
        ]);
      } else {
        if (targetNode.hazard === "Eco-Toxic Corrosive Cloud" || targetNode.hazard === "Mana-Resonance Feedback Storm") {
          const reqName = targetNode.hazard === "Eco-Toxic Corrosive Cloud" ? "Enriched Bio-Algae Capsule" : "Vial of Astral Oil";
          setLogs(prev => [
            ...prev,
            {
              id: `travel_hazard_blocked_${Date.now()}`,
              text: `⚠️ WARP DRIVE CRITICAL: Entry to ${targetNode.name.split(' #')[0]} aborted. The coordinate sector is locked down by a violent '${targetNode.hazard}'! Warping here without deploying a resolving [${reqName}] will tear your vessel apart!`,
              timestamp,
              type: 'error'
            }
          ]);
          setCustomActionPending(false);
          return;
        }

        if (targetNode.hazard === "Irradiated Acid Rainstorm") {
          const actualToll = Math.min(20, credits);
          setCredits(prev => Math.max(0, prev - 20));
          setLogs(prev => [
            ...prev,
            {
              id: `travel_hazard_toll_${Date.now()}`,
              text: `⚠️ WARNING: Sector ${targetNode.name.split(' #')[0]} is engulfed in an '${targetNode.hazard}'! Severe atmospheric corrosion occurs during warp exit, costing you ${actualToll} Credits in scrap repairs. Deploy a [Purified Water Filter] to stabilize the zone.`,
              timestamp,
              type: 'error'
            }
          ]);
        }
      }
    }

    // Toggle unexplored -> visited status
    const updatedNodes = world.nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, status: 'active' as const };
      }
      if (n.id === world.activeNodeId) {
        return { ...n, status: 'visited' as const };
      }
      return n;
    });

    setWorld({
      ...world,
      nodes: updatedNodes,
      activeNodeId: nodeId
    });

    // Track travel progression in starlit history catalog!
    const visitedCount = updatedNodes.filter(n => n.status !== 'unexplored').length;
    const activeExploredWorld: ExploredWorld = {
      id: `world_${Date.now()}`,
      name: world.name,
      seed: world.seed,
      genre: world.genre,
      nodesVisited: visitedCount,
      totalNodes: world.nodes.length,
      timestamp: new Date().toLocaleDateString()
    };
    saveExploredWorld(activeExploredWorld);
    setExploredWorlds(getExploredWorlds());

    // Generate descriptive narrative (Gemini vs Procedural)
    let narrativeText = `Warp alignment complete. You enter the coordinates of ${targetNode.name}. The atmosphere is dense with a ${targetNode.biome.toLowerCase()} profile.`;
    
    if (apiKey) {
      const sysPrompt = `You are a text adventure RPG narrator. Describe the player arriving at a new location in a ${world.genre} world. Return JSON: { "narrative": "Paragraph detailing sights, sounds, smells, and visual vibes." }`;
      const userPrompt = `World prompt: "${world.description}". Biome: "${targetNode.biome}". Location name: "${targetNode.name}". Danger level: ${targetNode.danger}.`;
      const geminiRes = await queryGemini(sysPrompt, userPrompt);
      if (geminiRes && geminiRes.narrative) {
        narrativeText = geminiRes.narrative;
      }
    }

    setLogs(prev => [
      ...prev,
      {
        id: `travel_${Date.now()}`,
        text: narrativeText,
        timestamp,
        type: 'travel'
      }
    ]);

    // CHECK FOR FACTION PATROL BLOCKADE INTRUSION ON WARP COMPLETION
    const hostileNPC = targetNode.npcs.find(npc => {
      const faction = world.factions.find(f => f.id === npc.factionId);
      return faction && faction.standing < 35;
    });

    if (hostileNPC) {
      const factionName = world.factions.find(f => f.id === hostileNPC.factionId)?.name || 'Hostile Faction';
      const tollAmount = 25 + targetNode.danger * 5;
      
      setActivePatrol({
        factionId: hostileNPC.factionId,
        toll: tollAmount,
        nodeId: targetNode.id,
        factionName: factionName,
        previousNodeId: activeNode.id
      });
      
      setLogs(prev => [
        ...prev,
        {
          id: `patrol_intercept_${Date.now()}`,
          text: `🚨 EMERGENCY INTERCEPTION: Hostile ${factionName} patrol battle cruisers intercept your warp entry at ${targetNode.name.split(' #')[0]}! Coordinate locks deployed. You must bribe, evade, or combat to proceed!`,
          timestamp,
          type: 'error'
        }
      ]);
    }

    setCustomActionPending(false);
    checkSecretRoll('travel');
  };

  // 3. Search Landmark Actions
  const handleSearchLandmark = async (landmark: Landmark) => {
    if (!world) return;
    
    if (activePatrol) {
      setLogs(prev => [
        ...prev,
        {
          id: `search_patrol_lock_${Date.now()}`,
          text: `Error: Scanners are blocked by the hostile patrol. You cannot survey landmarks until the blockade is cleared!`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);
      return;
    }

    const activeNode = world.nodes.find(n => n.id === world.activeNodeId);
    if (!activeNode) return;

    if (activeNode.hazard === "Grid Security Firewall Lockout" && !activeNode.hazardResolved) {
      setLogs(prev => [
        ...prev,
        {
          id: `search_hazard_blocked_${Date.now()}`,
          text: `Error: Grid Security Firewall Lockout is active in this sector. Cyber scanners are completely jammed. Travel to a safe sector or deploy [Liquid Nitrogen Capsule] to resolve the firewall lockdown!`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);
      return;
    }

    setCustomActionPending(true);
    await new Promise(resolve => setTimeout(resolve, 900));

    const timestamp = new Date().toLocaleTimeString();

    // Mark searched
    const updatedNodes = world.nodes.map(n => {
      if (n.id === activeNode.id) {
        const updatedLandmarks = n.landmarks.map(l => {
          if (l.id === landmark.id) return { ...l, searched: true };
          return l;
        });
        return { ...n, landmarks: updatedLandmarks };
      }
      return n;
    });

    setWorld({ ...world, nodes: updatedNodes });

    // Handle reward item discovery
    let rewardText = '';
    let foundItem: Item | null = null;
    
    if (landmark.itemRewardId) {
      foundItem = activeNode.items.find(i => i.id === landmark.itemRewardId) || null;
      if (foundItem) {
        setInventory(prev => [...prev, foundItem!]);
        rewardText = ` Uncovered rare relic: [${foundItem.name} — ${foundItem.description}]. Added to your Codex.`;
      }
    }

    if (landmark.creditReward) {
      setCredits(prev => prev + landmark.creditReward!);
      rewardText += ` Found a stash of ${landmark.creditReward} starlit credits in the debris!`;
    }

    let searchNarrative = `You investigate the anomalies at ${landmark.name}. ${landmark.description}. ${landmark.loreReward}${rewardText}`;

    if (apiKey) {
      const sysPrompt = `You are a text adventure narrator. Describe the player searching a landmark. Return JSON: { "narrative": "Detailed narrative log." }`;
      const userPrompt = `World context: "${world.description}". Landmark name: "${landmark.name}". Landmark description: "${landmark.description}". Biome: "${activeNode.biome}". ${foundItem ? `Item found: [${foundItem.name}]` : ''}`;
      const geminiRes = await queryGemini(sysPrompt, userPrompt);
      if (geminiRes && geminiRes.narrative) {
        searchNarrative = geminiRes.narrative;
      }
    }

    setLogs(prev => [
      ...prev,
      {
        id: `search_${Date.now()}`,
        text: searchNarrative,
        timestamp,
        type: 'search'
      }
    ]);

    setCustomActionPending(false);
    checkSecretRoll('search');
  };

  // 4. NPC Dialog Interactions
  const handleTalkNPC = (npc: NPC) => {
    if (activePatrol) {
      setLogs(prev => [
        ...prev,
        {
          id: `talk_patrol_lock_${Date.now()}`,
          text: `Error: Faction interceptors are blocking communications. You cannot approach local residents!`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);
      return;
    }

    if (!world) return;
    const activeNode = world.nodes.find(n => n.id === world.activeNodeId);
    if (activeNode && activeNode.hazard === "Dimensional Gravity Singularity Tide" && !activeNode.hazardResolved) {
      setLogs(prev => [
        ...prev,
        {
          id: `talk_hazard_blocked_${Date.now()}`,
          text: `Error: Dimensional Gravity Singularity Tide is active. Citizen minds are collapsing into gravity wells. They refuse to communicate! Travel to another sector or consume [Insanity-Suppressant Draft] to stabilize the gravity coordinates.`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error'
        }
      ]);
      return;
    }

    setActiveNPC(npc);
    const timestamp = new Date().toLocaleTimeString();
    
    setLogs(prev => [
      ...prev,
      {
        id: `npc_init_${Date.now()}`,
        text: `You approach ${npc.name}. They adjust their equipment and look up.`,
        timestamp,
        type: 'dialogue'
      }
    ]);
  };

  const handleNPCAction = async (actionType: 'lore' | 'quest' | 'goodbye') => {
    if (!world || !activeNPC) return;
    const timestamp = new Date().toLocaleTimeString();

    if (actionType === 'goodbye') {
      setActiveNPC(null);
      setLogs(prev => [
        ...prev,
        {
          id: `npc_bye_${Date.now()}`,
          text: `"${activeNPC.name} nods. 'Stay safe in the coordinate channels.'" You step back.`,
          timestamp,
          type: 'dialogue'
        }
      ]);
      return;
    }

    setCustomActionPending(true);

    if (actionType === 'lore') {
      await new Promise(resolve => setTimeout(resolve, 850));
      
      let replyText = `"${activeNPC.name} shares: 'Our faction, the ${world.factions.find(f => f.id === activeNPC.factionId)?.name}, is tracking starlit resonance fields. There are rumors of 11 secret fragments linking to a hidden alternate story...'"`;

      if (apiKey) {
        const sysPrompt = `You are an NPC named ${activeNPC.name} (${activeNPC.role}) speaking to the explorer. Tell them local history/faction motives. Return JSON: { "dialogue": "Spoken character dialogue." }`;
        const userPrompt = `World context: "${world.description}". Biome: "${world.nodes.find(n => n.id === world.activeNodeId)?.biome}". Your faction motives: "${world.factions.find(f => f.id === activeNPC.factionId)?.description}".`;
        const geminiRes = await queryGemini(sysPrompt, userPrompt);
        if (geminiRes && geminiRes.dialogue) {
          replyText = `"${activeNPC.name}: '${geminiRes.dialogue}'"`;
        }
      }

      setLogs(prev => [
        ...prev,
        {
          id: `npc_lore_${Date.now()}`,
          text: replyText,
          timestamp,
          type: 'dialogue'
        }
      ]);

      checkSecretRoll('talk');

    } else if (actionType === 'quest') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activeQuest = activeQuests.find(q => q.id === activeNPC.quest?.id);
      if (!activeQuest || activeQuest.completed) {
        setCustomActionPending(false);
        return;
      }

      // Check quest completion criteria: for dispatch quest, user must have travelled to target node
      // We will simplify: user has to visit the target NPC's region to complete the dispatch!
      const targetNPCNode = world.nodes.find(n => n.npcs.some(npc => npc.id === activeQuest.targetNPCId));
      
      if (targetNPCNode && targetNPCNode.status !== 'unexplored') {
        // Complete quest!
        const updatedQuests = activeQuests.map(q => {
          if (q.id === activeQuest.id) return { ...q, completed: true };
          return q;
        });
        setActiveQuests(updatedQuests);

        // Adjust faction standing
        const updatedFactions = world.factions.map(f => {
          if (f.id === activeQuest.rewardFactionId) {
            return { ...f, standing: Math.min(100, f.standing + activeQuest.rewardReputation) };
          }
          return f;
        });

        setWorld({
          ...world,
          factions: updatedFactions
        });

        // Reward starlit credits
        if (activeQuest.rewardCredits) {
          setCredits(prev => prev + activeQuest.rewardCredits!);
        }

        setLogs(prev => [
          ...prev,
          {
            id: `quest_done_${Date.now()}`,
            text: `✓ Quest Complete: [${activeQuest.title}]. You secured the communications! ${activeQuest.rewardCredits ? `Rewarded ${activeQuest.rewardCredits} Credits.` : ''} Reputation with ${world.factions.find(f => f.id === activeQuest.rewardFactionId)?.name} increased by +${activeQuest.rewardReputation}.`,
            timestamp,
            type: 'quest'
          }
        ]);

      } else {
        // Not completed yet
        setLogs(prev => [
          ...prev,
          {
            id: `quest_fail_${Date.now()}`,
            text: `"${activeNPC.name} looks concerned. 'You haven't visited Sector ${targetNPCNode?.name.split(' #')[0] || 'Target'} yet to establish contacts. Travel there first.'"`,
            timestamp,
            type: 'dialogue'
          }
        ]);
      }
    }

    setCustomActionPending(false);
  };

  // Core text Action Command Parser Engine
  const handleExecuteCommand = async (commandStr: string) => {
    if (!world) return;
    const activeNode = world.nodes.find(n => n.id === world.activeNodeId);
    if (!activeNode) return;

    const timestamp = new Date().toLocaleTimeString();
    const cleanCmd = commandStr.trim();
    const lowerCmd = cleanCmd.toLowerCase();

    // Log the typed command first for authenticity
    setLogs(prev => [
      ...prev,
      {
        id: `typed_${Date.now()}`,
        text: `> ${cleanCmd}`,
        timestamp,
        type: 'system'
      }
    ]);

    // ----------------------------------------------------
    // BLOCKADE BYPASS MODE PARSING
    // ----------------------------------------------------
    if (activePatrol) {
      if (lowerCmd === 'combat') {
        setCustomActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const completedQuestsCount = activeQuests.filter(q => q.completed).length;
        const dimensionalResolve = 30 + (world.dangerLevel || 3) * 10 + completedQuestsCount * 10;
        const winProb = Math.min(0.9, dimensionalResolve / 150);
        
        if (Math.random() < winProb) {
          const updatedFactions = world.factions.map(f => {
            if (f.id === activePatrol.factionId) {
              return { ...f, standing: Math.max(0, f.standing - 15) };
            }
            return f;
          });
          setWorld({
            ...world,
            factions: updatedFactions
          });
          
          setLogs(prev => [
            ...prev,
            {
              id: `combat_win_${Date.now()}`,
              text: `⚔️ COMBAT SUCCESS! You engage the hostile patrol in high-stakes tactical space battle. Harnessing your Dimensional Resolve (${dimensionalResolve} rating), you obliterate their coordinate locking array. Standing with ${activePatrol.factionName} dropped by 15. The blockade is cleared!`,
              timestamp,
              type: 'quest'
            }
          ]);
          setActivePatrol(null);
        } else {
          setLogs(prev => [
            ...prev,
            {
              id: `combat_fail_${Date.now()}`,
              text: `⚔️ COMBAT FAILURE! The hostile patrol's dreadnoughts overwhelm your shields. Your warp drives trigger an emergency spatial displacement, forcing you back to safe coordinates!`,
              timestamp,
              type: 'error'
            }
          ]);
          
          const prevNode = world.nodes.find(n => n.id === activePatrol.previousNodeId);
          if (prevNode) {
            const updatedNodes = world.nodes.map(n => {
              if (n.id === prevNode.id) return { ...n, status: 'active' as const };
              if (n.id === world.activeNodeId) return { ...n, status: 'visited' as const };
              return n;
            });
            setWorld({
              ...world,
              nodes: updatedNodes,
              activeNodeId: prevNode.id
            });
          }
          setActivePatrol(null);
        }
        setCustomActionPending(false);
        return;
      }
      
      if (lowerCmd === 'evade') {
        setCustomActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const totalNodesExplored = exploredWorlds.reduce((acc, w) => acc + w.nodesVisited, 0);
        const completedQuestsCount = activeQuests.filter(q => q.completed).length;
        const chronosInsight = 10 + (totalNodesExplored * 8) + (completedQuestsCount * 15);
        const evadeProb = Math.min(0.9, chronosInsight / 150);
        
        if (Math.random() < evadeProb) {
          setLogs(prev => [
            ...prev,
            {
              id: `evade_win_${Date.now()}`,
              text: `🌀 EVASION SUCCESS! Leveraging your Chronos Insight (${chronosInsight} rating), you detect micro-rifts in their scanner nets. You slip past their patrols completely undetected! The blockade is bypassed.`,
              timestamp,
              type: 'travel'
            }
          ]);
          setActivePatrol(null);
        } else {
          setLogs(prev => [
            ...prev,
            {
              id: `evade_fail_${Date.now()}`,
              text: `🌀 EVASION FAILURE! The patrol's tachyonic sensors catch your temporal wake. Your ship is caught in a tractor beam, initiating an emergency jump back to previous coordinates!`,
              timestamp,
              type: 'error'
            }
          ]);
          
          const prevNode = world.nodes.find(n => n.id === activePatrol.previousNodeId);
          if (prevNode) {
            const updatedNodes = world.nodes.map(n => {
              if (n.id === prevNode.id) return { ...n, status: 'active' as const };
              if (n.id === world.activeNodeId) return { ...n, status: 'visited' as const };
              return n;
            });
            setWorld({
              ...world,
              nodes: updatedNodes,
              activeNodeId: prevNode.id
            });
          }
          setActivePatrol(null);
        }
        setCustomActionPending(false);
        return;
      }
      
      if (lowerCmd.startsWith('bribe')) {
        if (credits < activePatrol.toll) {
          setLogs(prev => [
            ...prev,
            {
              id: `bribe_fail_credits_${Date.now()}`,
              text: `Error: You do not possess enough starlit credits. The patrol demands a toll of ${activePatrol.toll} credits, but your wallet holds only ${credits} credits.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }
        
        setCustomActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCredits(prev => prev - activePatrol.toll);
        
        const updatedFactions = world.factions.map(f => {
          if (f.id === activePatrol.factionId) {
            return { ...f, standing: Math.min(100, f.standing + 8) };
          }
          return f;
        });
        setWorld({
          ...world,
          factions: updatedFactions
        });
        
        setLogs(prev => [
          ...prev,
          {
            id: `bribe_win_${Date.now()}`,
            text: `🪙 BRIBE SUCCESS! You wire ${activePatrol.toll} starlit credits to the patrol commanders. Their coordinate nets retract immediately. Standing with ${activePatrol.factionName} increased by 8! The blockade is cleared.`,
            timestamp,
            type: 'quest'
          }
        ]);
        setActivePatrol(null);
        setCustomActionPending(false);
        return;
      }
      
      if (lowerCmd === 'help' || lowerCmd === 'status' || lowerCmd === 'reset') {
        // Pass standard command logic
      } else {
        setLogs(prev => [
          ...prev,
          {
            id: `blockade_locked_${Date.now()}`,
            text: `Error: Warp coordinates are LOCKED by hostile ${activePatrol.factionName} patrols! Type 'combat', 'evade', or 'bribe' to resolve the blockade.`,
            timestamp,
            type: 'error'
          }
        ]);
        return;
      }
    }

    // ----------------------------------------------------
    // DIALOGUE SUB-MODE PARSING
    // ----------------------------------------------------
    if (activeNPC) {
      if (lowerCmd === 'goodbye' || lowerCmd === 'bye' || lowerCmd === 'leave' || lowerCmd === 'exit') {
        handleNPCAction('goodbye');
        return;
      }
      if (lowerCmd === 'quest' || lowerCmd === 'complete quest' || lowerCmd === 'finish quest' || lowerCmd === 'deliver') {
        handleNPCAction('quest');
        return;
      }
      if (lowerCmd.includes('ask') || lowerCmd.includes('history') || lowerCmd.includes('lore') || lowerCmd.includes('talk') || lowerCmd.includes('chat')) {
        handleNPCAction('lore');
        return;
      }

      // BUY ITEM PARSING
      if (lowerCmd.startsWith('buy ')) {
        if (!activeNPC.isMerchant || !activeNPC.inventoryForSale || !activeNPC.buyPrices) {
          setLogs(prev => [
            ...prev,
            {
              id: `buy_not_merchant_${Date.now()}`,
              text: `Error: ${activeNPC.name} is not a merchant and does not have items for sale.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }

        const query = lowerCmd.substring(4).trim();
        const purchasedItem = activeNPC.inventoryForSale.find(item => 
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase() === query
        );

        if (!purchasedItem) {
          setLogs(prev => [
            ...prev,
            {
              id: `buy_not_found_${Date.now()}`,
              text: `Error: Item matching '${query}' is not in ${activeNPC.name}'s shop catalogue.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }

        const price = activeNPC.buyPrices[purchasedItem.id] || 30;
        if (credits < price) {
          setLogs(prev => [
            ...prev,
            {
              id: `buy_insufficient_credits_${Date.now()}`,
              text: `Error: Insufficient funds. '${purchasedItem.name}' costs ${price} credits, but you only have ${credits} credits.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }

        setCustomActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        setCredits(prev => prev - price);
        setInventory(prev => [...prev, purchasedItem]);
        
        const updatedInventoryForSale = activeNPC.inventoryForSale.filter(item => item.id !== purchasedItem.id);
        const updatedNPC = { ...activeNPC, inventoryForSale: updatedInventoryForSale };
        setActiveNPC(updatedNPC);
        
        const updatedNodes = world.nodes.map(n => {
          if (n.id === world.activeNodeId) {
            const updatedNpcs = n.npcs.map(npc => {
              if (npc.id === activeNPC.id) return updatedNPC;
              return npc;
            });
            return { ...n, npcs: updatedNpcs };
          }
          return n;
        });
        setWorld({ ...world, nodes: updatedNodes });

        setLogs(prev => [
          ...prev,
          {
            id: `buy_success_${Date.now()}`,
            text: `🪙 PURCHASE SUCCESS: You purchase [${purchasedItem.name}] from ${activeNPC.name} for ${price} credits. The item has been transferred to your Codex Pack.`,
            timestamp,
            type: 'quest'
          }
        ]);
        setCustomActionPending(false);
        return;
      }

      // SELL ITEM PARSING
      if (lowerCmd.startsWith('sell ')) {
        if (!activeNPC.isMerchant) {
          setLogs(prev => [
            ...prev,
            {
              id: `sell_not_merchant_${Date.now()}`,
              text: `Error: ${activeNPC.name} is not interested in buying your items. Only Cartel Merchants purchase scrap gears or keys.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }

        const query = lowerCmd.substring(5).trim();
        const soldItem = inventory.find(item => 
          item.name.toLowerCase().includes(query)
        );

        if (!soldItem) {
          setLogs(prev => [
            ...prev,
            {
              id: `sell_not_found_${Date.now()}`,
              text: `Error: You do not have an item matching '${query}' in your pack inventory.`,
              timestamp,
              type: 'error'
            }
          ]);
          return;
        }

        setCustomActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const payout = soldItem.creditValue || 15;
        
        setInventory(prev => prev.filter(item => item.id !== soldItem.id));
        setCredits(prev => prev + payout);

        const updatedInventoryForSale = [...(activeNPC.inventoryForSale || []), soldItem];
        const updatedNPC = { 
          ...activeNPC, 
          inventoryForSale: updatedInventoryForSale,
          buyPrices: { ...(activeNPC.buyPrices || {}), [soldItem.id]: Math.round(payout * 1.5) } 
        };
        setActiveNPC(updatedNPC);

        const updatedNodes = world.nodes.map(n => {
          if (n.id === world.activeNodeId) {
            const updatedNpcs = n.npcs.map(npc => {
              if (npc.id === activeNPC.id) return updatedNPC;
              return npc;
            });
            return { ...n, npcs: updatedNpcs };
          }
          return n;
        });
        setWorld({ ...world, nodes: updatedNodes });

        setLogs(prev => [
          ...prev,
          {
            id: `sell_success_${Date.now()}`,
            text: `🪙 SALE SUCCESS: You sell [${soldItem.name}] to ${activeNPC.name} for a scrap reward of ${payout} credits. Your wallet balance has been updated.`,
            timestamp,
            type: 'quest'
          }
        ]);
        setCustomActionPending(false);
        return;
      }

      // If they type a custom dialogue and have Gemini API enabled
      if (apiKey) {
        setCustomActionPending(true);
        let customReply = `"${activeNPC.name} listens carefully and responds, but the dimensional frequencies are fading..."`;
        
        const sysPrompt = `You are an NPC named ${activeNPC.name} (${activeNPC.role}) speaking to the player in a ${world.genre} world. They said something open-ended to you. Respond directly in character, staying coherent to the world description: "${world.description}". Return JSON: { "dialogue": "Spoken character dialogue." }`;
        const userPrompt = `World prompt: "${world.description}". Explorer said to you: "${cleanCmd}".`;
        const geminiRes = await queryGemini(sysPrompt, userPrompt);
        if (geminiRes && geminiRes.dialogue) {
          customReply = `"${activeNPC.name}: '${geminiRes.dialogue}'"`;
        }

        setLogs(prev => [
          ...prev,
          {
            id: `npc_custom_${Date.now()}`,
            text: customReply,
            timestamp,
            type: 'dialogue'
          }
        ]);
        setCustomActionPending(false);
        checkSecretRoll('talk');
        return;
      }

      // Fallback dialogue error
      setLogs(prev => [
        ...prev,
        {
          id: `cmd_err_${Date.now()}`,
          text: `Error: Unrecognized dialogue action. Type 'ask history', 'complete quest', 'buy [item]', 'sell [item]', or 'goodbye'.`,
          timestamp,
          type: 'error'
        }
      ]);
      return;
    }

    // ----------------------------------------------------
    // NORMAL EXPLORATION NAVIGATION MODE PARSING
    // ----------------------------------------------------
    
    // A) Help Manual
    if (lowerCmd === 'help' || lowerCmd === 'manual' || lowerCmd === 'commands') {
      const helpText = `Available Command Operations:\n` +
        `• Travel node: 'go [Sector Name]' or 'travel [Sector Name]'\n` +
        `• Search landmark: 'search [Landmark Name]' or 'explore [Landmark Name]'\n` +
        `• Converse with citizen: 'talk [Citizen Name]' or 'approach [Citizen Name]'\n` +
        `• Check surroundings: 'status' or 'look'\n` +
        `• Reset active profile: 'reset'`;
      setLogs(prev => [
        ...prev,
        {
          id: `help_${Date.now()}`,
          text: helpText,
          timestamp,
          type: 'system'
        }
      ]);
      return;
    }

    // B) Status / Look
    if (lowerCmd === 'status' || lowerCmd === 'look' || lowerCmd === 'where') {
      const neighbors = activeNode.connections.map(cId => world.nodes.find(n => n.id === cId)?.name.split(' #')[0]).join(', ');
      const localLandmarks = activeNode.landmarks.map(l => `'${l.name.split("'s ")[1] || l.name}'${l.searched ? ' (Surveyed)' : ''}`).join(', ');
      const localNPCs = activeNode.npcs.map(npc => `'${npc.name}'`).join(', ');
      
      const statusText = `Active Sector: ${activeNode.name}\n` +
        `Biome: ${activeNode.biome}\n` +
        `Warp Corridors: [ ${neighbors} ]\n` +
        `Local Anomalies: [ ${localLandmarks || 'None'} ]\n` +
        `Local Citizens: [ ${localNPCs || 'None'} ]\n` +
        `Key Inventory: [ ${inventory.map(i => i.name).join(', ') || 'Empty'} ]`;
      
      setLogs(prev => [
        ...prev,
        {
          id: `status_${Date.now()}`,
          text: statusText,
          timestamp,
          type: 'system'
        }
      ]);
      return;
    }

    // C) Reset shortcut
    if (lowerCmd === 'reset') {
      handleResetWorld();
      return;
    }

    // D) Search Landmarks
    if (lowerCmd.startsWith('search ') || lowerCmd.startsWith('explore ') || lowerCmd.startsWith('investigate ')) {
      const prefixLength = lowerCmd.startsWith('search ') ? 7 : lowerCmd.startsWith('explore ') ? 8 : 12;
      const targetQuery = lowerCmd.substring(prefixLength).trim();
      
      const landmark = activeNode.landmarks.find(l => 
        l.name.toLowerCase().includes(targetQuery) || 
        (l.name.split("'s ")[1] || '').toLowerCase().includes(targetQuery)
      );

      if (landmark) {
        if (landmark.searched) {
          setLogs(prev => [
            ...prev,
            {
              id: `search_already_${Date.now()}`,
              text: `Error: Landmark '${landmark.name}' has already been fully surveyed.`,
              timestamp,
              type: 'error'
            }
          ]);
        } else {
          handleSearchLandmark(landmark);
        }
      } else {
        setLogs(prev => [
          ...prev,
          {
            id: `search_fail_${Date.now()}`,
            text: `Error: Landmark anomaly matching '${targetQuery}' is not detected in this sector's scanners.`,
            timestamp,
            type: 'error'
          }
        ]);
      }
      return;
    }

    // E) Approach Citizens (NPC Dialogue Trigger)
    if (lowerCmd.startsWith('talk to ') || lowerCmd.startsWith('talk ') || lowerCmd.startsWith('approach ') || lowerCmd.startsWith('speak to ') || lowerCmd.startsWith('speak ')) {
      let query = '';
      if (lowerCmd.startsWith('talk to ')) query = lowerCmd.substring(8);
      else if (lowerCmd.startsWith('speak to ')) query = lowerCmd.substring(9);
      else if (lowerCmd.startsWith('talk ')) query = lowerCmd.substring(5);
      else if (lowerCmd.startsWith('speak ')) query = lowerCmd.substring(6);
      else if (lowerCmd.startsWith('approach ')) query = lowerCmd.substring(9);
      
      const cleanQuery = query.trim();
      const npc = activeNode.npcs.find(npc => 
        npc.name.toLowerCase().includes(cleanQuery) || 
        npc.name.split(' ')[0].toLowerCase().includes(cleanQuery)
      );

      if (npc) {
        handleTalkNPC(npc);
      } else {
        setLogs(prev => [
          ...prev,
          {
            id: `npc_err_${Date.now()}`,
            text: `Error: Citizen matching '${cleanQuery}' is not registered in this sector coordinates.`,
            timestamp,
            type: 'error'
          }
        ]);
      }
      return;
    }

    // F) Travel Node (Constellation Warp)
    if (lowerCmd.startsWith('go to ') || lowerCmd.startsWith('go ') || lowerCmd.startsWith('travel to ') || lowerCmd.startsWith('travel ') || lowerCmd.startsWith('warp to ') || lowerCmd.startsWith('warp ')) {
      let query = '';
      if (lowerCmd.startsWith('travel to ')) query = lowerCmd.substring(10);
      else if (lowerCmd.startsWith('go to ')) query = lowerCmd.substring(6);
      else if (lowerCmd.startsWith('warp to ')) query = lowerCmd.substring(8);
      else if (lowerCmd.startsWith('travel ')) query = lowerCmd.substring(7);
      else if (lowerCmd.startsWith('go ')) query = lowerCmd.substring(3);
      else if (lowerCmd.startsWith('warp ')) query = lowerCmd.substring(5);
      
      const cleanQuery = query.trim();

      const targetNode = world.nodes.find(n => 
        n.name.toLowerCase().includes(cleanQuery) ||
        n.name.split(' #')[0].toLowerCase().includes(cleanQuery) ||
        n.biome.toLowerCase().includes(cleanQuery)
      );

      if (targetNode) {
        if (targetNode.id === activeNode.id) {
          setLogs(prev => [
            ...prev,
            {
              id: `travel_same_${Date.now()}`,
              text: `Error: Spindle matrix indicates you are already positioned in coordinates of '${targetNode.name.split(' #')[0]}'.`,
              timestamp,
              type: 'error'
            }
          ]);
        } else if (!activeNode.connections.includes(targetNode.id)) {
          setLogs(prev => [
            ...prev,
            {
              id: `travel_unconnected_${Date.now()}`,
              text: `Error: Frequencies disconnected. No starlit warp corridor exists between sector '${activeNode.name.split(' #')[0]}' and sector '${targetNode.name.split(' #')[0]}'. Check map paths.`,
              timestamp,
              type: 'error'
            }
          ]);
        } else {
          handleTravel(targetNode.id);
        }
      } else {
        setLogs(prev => [
          ...prev,
          {
            id: `travel_not_found_${Date.now()}`,
            text: `Error: Star coordinate sector matching '${cleanQuery}' is not mapped in this universe matrix.`,
            timestamp,
            type: 'error'
          }
        ]);
      }
      return;
    }

    // Default: completely unrecognized command
    setLogs(prev => [
      ...prev,
      {
        id: `cmd_unrecognized_${Date.now()}`,
        text: `Error: Command syntax unrecognized: '${cleanCmd}'. Type 'help' to review performable operations.`,
        timestamp,
        type: 'error'
      }
    ]);
  };

  // Dev mode bypass cheat (Click title cycle)
  const handleDevCheat = () => {
    const clicks = devClicks + 1;
    setDevClicks(clicks);
    if (clicks >= 5) {
      SECRET_FRAGMENTS.forEach(f => collectFragment(f.id));
      setCollectedFrags(getCollectedFragments());
      setDevClicks(0);
      
      setLogs(prev => [
        ...prev,
        {
          id: `dev_${Date.now()}`,
          text: "🔧 [DEVELOPER PROTOCOL ACTIVATED]: All 11 secret fragments have been generated in LocalStorage. Aether Multiverse Gateway Sync complete.",
          timestamp: new Date().toLocaleTimeString(),
          type: 'secret'
        }
      ]);
    }
  };

  const handleResetWorld = () => {
    resetSecretFragments();
    localStorage.removeItem('cosmogony_locked_title');
    localStorage.removeItem('cosmogony_player_credits');
    setCredits(100);
    setActivePatrol(null);
    setLockedTitle('');
    setCollectedFrags([]);
    setWorld(null);
    setLogs([]);
    setShowAetherNetwork(false);
    setIsLoomExpanded(true);
  };

  const handleBreachMultiverse = () => {
    let currentLocked = localStorage.getItem('cosmogony_locked_title');
    if (!currentLocked) {
      const activeTitle = getPlayerTitle();
      localStorage.setItem('cosmogony_locked_title', activeTitle);
      setLockedTitle(activeTitle);
    } else {
      setLockedTitle(currentLocked);
    }
    setShowAetherNetwork(true);
  };

  const handleReWeaveWorld = (archive: ExploredWorld) => {
    const targetConfig: WorldConfig = archive.config || {
      prompt: `An archived universe of ${archive.genre}`,
      genre: archive.genre as any,
      seed: archive.seed,
      worldSize: archive.totalNodes || 8,
      dangerLevel: 3,
      techRatio: 50,
      magicRatio: 50,
      customLore: '',
      customCharacters: []
    };
    handleForge(targetConfig, apiKey);
  };

  // Active node logic
  const activeNode = world ? world.nodes.find(n => n.id === world.activeNodeId) : null;

  return (
    <div 
      className="app-container"
      style={{
        background: showAetherNetwork ? '#05030a' : 'var(--bg-deep)',
        transition: 'all 0.5s ease',
        gridTemplateColumns: showAetherNetwork 
          ? '1fr' 
          : isLoomExpanded 
            ? '320px 1fr 400px' 
            : '1fr 400px'
      }}
    >
      {/* Sleek Floating Weave Spindle Toggle */}
      {!isLoomExpanded && !showAetherNetwork && (
        <button 
          onClick={() => setIsLoomExpanded(true)}
          className="btn-cosmic btn-outline animate-pulse-glow"
          style={{ 
            position: 'absolute', 
            top: '24px', 
            left: '24px', 
            zIndex: 100, 
            padding: '6px 12px', 
            fontSize: '11px',
            height: 'auto',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-glow)',
            borderRadius: '6px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
          }}
        >
          🌌 Weave Spindle
        </button>
      )}
      
      {/* 1. CONFIG sidebar loom */}
      {!showAetherNetwork && isLoomExpanded && (
        <LoomPanel 
          onForge={handleForge} 
          isForging={isForging} 
          playerName={playerName}
          onPlayerNameChange={handlePlayerNameChange}
          showCollapse={world !== null}
          onCollapse={() => setIsLoomExpanded(false)}
        />
      )}

      {/* 2. MAIN CENTER: Constellation Map & Codex */}
      {showAetherNetwork ? (
        <div style={{ gridColumn: '1 / span 3', height: '100%' }}>
          <AetherNetwork onReturn={() => setShowAetherNetwork(false)} playerName={playerName} lockedTitle={lockedTitle} />
        </div>
      ) : world && activeNode ? (
        <div className="center-column" style={{ gap: '16px' }}>
          <ConstellationMap 
            nodes={world.nodes} 
            activeNodeId={world.activeNodeId} 
            onNodeClick={handleTravel} 
          />
          <Codex 
            inventory={inventory} 
            factions={world.factions} 
            loreTimeline={world.loreTimeline} 
            activeQuests={activeQuests}
            playerName={playerName}
            playerTitle={getPlayerTitle()}
            exploredWorlds={exploredWorlds}
            onReWeave={handleReWeaveWorld}
            magicRatio={world.magicRatio}
            techRatio={world.techRatio}
            dangerLevel={world.dangerLevel}
            collectedFragmentsCount={collectedFrags.length}
            credits={credits}
          />
        </div>
      ) : (
        // Spectacular Intro Welcome Forge Screen
        <div className="glass-panel center-column glass-panel-glow-teal animate-float" style={{ flex: 1, padding: '40px', justifyContent: 'center', alignItems: 'center', gap: '20px', minHeight: '400px' }}>
          <h1 className="heading-glow serif-title" style={{ fontSize: '48px', color: 'var(--text-primary)', textShadow: '0 0 25px var(--color-teal-glow)' }}>
            COSMOGONY
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px', lineHeight: '1.6', textAlign: 'center' }}>
            A starlit space-fantasy loom. Weave custom galaxies, define historical records, inject legendary figures, and warp across glowing node constellations.
          </p>
          <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>🌟 Enter a prompt concept in the left panel to weave your first star sector.</span>
          </div>
          
          {/* Secret meta indicators */}
          {collectedFrags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(155, 81, 224, 0.08)', border: '1px dashed var(--color-purple)', padding: '12px', borderRadius: '6px', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-purple)', fontWeight: 600 }}>COSMIC FRAGMENT RESONANCE</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>You have gathered {collectedFrags.length} / 11 shards of the Hidden World.</span>
              {collectedFrags.length >= 11 && (
                <button onClick={handleBreachMultiverse} className="btn-cosmic btn-purple animate-pulse-glow" style={{ padding: '4px 10px', fontSize: '10px', marginTop: '4px' }}>
                  ⚡ BREACH MULTIVERSE GATEWAY
                </button>
              )}
            </div>
          )}

          {/* Galactic Archives explored worlds tracker */}
          {exploredWorlds.length > 0 && (
            <div 
              style={{ 
                width: '100%', 
                maxWidth: '480px', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-light)', 
                borderRadius: '8px', 
                padding: '16px', 
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                textAlign: 'left'
              }}
            >
              <h3 style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                🌌 Galactic Archive ({exploredWorlds.length} Wefts Surveyed)
              </h3>
              <div 
                className="terminal-scroll"
                style={{ 
                  maxHeight: '160px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  paddingRight: '4px'
                }}
              >
                {exploredWorlds.map(w => {
                  const pct = Math.round((w.nodesVisited / w.totalNodes) * 100);
                  const isDone = w.nodesVisited === w.totalNodes;
                  
                  return (
                    <div 
                      key={w.seed}
                      className="glass-card" 
                      style={{ 
                        padding: '8px 10px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '11px',
                        borderLeft: isDone ? '2px solid var(--color-success)' : '1px solid var(--border-light)',
                        background: 'rgba(255, 255, 255, 0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, marginRight: '8px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{w.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                          Genre: <span style={{ color: 'var(--color-teal)' }}>{w.genre}</span> | Seed: {w.seed} | {w.timestamp}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ color: isDone ? 'var(--color-success)' : 'var(--color-amber)', fontWeight: 'bold' }}>
                            {w.nodesVisited} / {w.totalNodes} Nodes ({pct}%)
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className={`indicator-dot ${isDone ? 'indicator-active' : 'indicator-inactive'}`} style={{ width: '6px', height: '6px', background: isDone ? 'var(--color-success)' : 'var(--color-amber)' }} />
                            <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              {isDone ? 'COMPLETED' : 'EXPLORING'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleReWeaveWorld(w)}
                          className="btn-cosmic btn-outline"
                          style={{
                            padding: '4px 8px',
                            fontSize: '9px',
                            height: 'auto',
                            borderRadius: '4px',
                            border: '1px solid var(--border-glow)'
                          }}
                          title="Re-weave Spindle into this timeline"
                        >
                          🌌 Spin
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RIGHT COLUMN: Narration logs & Context Actions */}
      {!showAetherNetwork && world && activeNode && (
        <ChronicleTerminal 
          logs={logs}
          activeNode={activeNode}
          activeNPC={activeNPC}
          onExecuteCommand={handleExecuteCommand}
          isCustomActionPending={customActionPending}
          activePatrol={activePatrol}
          stats={{
            aetherResonance: Math.min(150, (world.magicRatio || 50) + (collectedFrags.length * 5)),
            technoCognition: Math.min(150, (world.techRatio || 50) + (inventory.length * 4)),
            chronosInsight: 10 + (exploredWorlds.reduce((acc, w) => acc + w.nodesVisited, 0) * 8) + (activeQuests.filter(q => q.completed).length * 15),
            dimensionalResolve: 30 + ((world.dangerLevel || 3) * 10) + (activeQuests.filter(q => q.completed).length * 10)
          }}
          credits={credits}
          characterProfile={world.characterProfile}
        />
      )}

      {/* Persistent Meta Header overlays for active universes */}
      {!showAetherNetwork && world && (
        <div 
          style={{
            position: 'absolute',
            top: '24px',
            right: '440px', // next to narration column
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 100,
            background: 'var(--bg-panel)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{world.name}</span>
            <span style={{ fontSize: '9px', color: 'var(--color-teal)', letterSpacing: '1px' }}>ACTIVE UNIVERSE</span>
          </div>

          {/* Trigger Multiverse breach if active */}
          {collectedFrags.length >= 11 ? (
            <button 
              onClick={handleBreachMultiverse} 
              className="btn-cosmic btn-purple animate-pulse-glow" 
              style={{ padding: '6px 12px', fontSize: '10px', height: 'auto' }}
            >
              ⚡ BREACH MULTIVERSE
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', background: 'var(--bg-card)', padding: '2px 6px', borderRadius: '4px' }}>
              <span className="indicator-dot indicator-active" style={{ width: '6px', height: '6px', background: 'var(--color-purple)' }} />
              <span style={{ color: 'var(--color-purple)' }}>{collectedFrags.length} Shards Resonance</span>
            </div>
          )}
        </div>
      )}

      {/* Footer & Dev Cheat Triggers */}
      <div 
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          fontSize: '10px',
          color: 'var(--text-muted)',
          zIndex: 10
        }}
      >
        <span onClick={handleDevCheat} style={{ cursor: 'default', userSelect: 'none' }}>
          Cosmogony World Weave Engine v1.0.3
        </span>
        {world && (
          <span onClick={handleResetWorld} style={{ cursor: 'pointer', color: 'var(--color-crimson)', textDecoration: 'underline' }}>
            Reset Profile Data
          </span>
        )}
      </div>

    </div>
  );
}

export default App;
