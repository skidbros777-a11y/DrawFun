// ===== STEAL A BRAINROT — GAME DATA =====
// 13 zones (12 + bonus Void), 74 Brainrots across 7 rarity tiers.

const RARITY = {
  COMMON:    { name:'Common',    color:'#b0b6c9', value:[10,20],  glow:6 },
  UNCOMMON:  { name:'Uncommon',  color:'#2ed573', value:[25,40],  glow:10 },
  RARE:      { name:'Rare',      color:'#54a0ff', value:[50,80],  glow:16 },
  EPIC:      { name:'Epic',      color:'#a55eea', value:[100,160],glow:22 },
  LEGENDARY: { name:'Legendary', color:'#ffa502', value:[250,400],glow:30 },
  MYTHIC:    { name:'Mythic',    color:'#ff4757', value:[700,1000],glow:40 },
  SECRET:    { name:'Secret',    color:'#ff9ff3', value:[1500,1500],glow:52 }
};

// rarity egg weights per zone tier (C,U,R,E,L,M)
const TIER_WEIGHTS = [
  [80,20, 0, 0, 0, 0],   // t0 Meadow
  [55,32,13, 0, 0, 0],   // t1
  [32,34,24,10, 0, 0],   // t2
  [14,28,32,20, 6, 0],   // t3
  [ 4,14,30,32,16, 4],   // t4
  [ 0, 8,24,32,26,10]    // t5 Void
];

// Zones: 13. unlock = collection score needed. guard chases egg thieves!
const ZONES = [
  { id:'meadow',  name:'Meadow',          tier:0, x:1400, y:1200, w:1400, h:1200, col:'#7ec850', col2:'#5aa832', hub:true, unlock:0,    guard:null, gimmick:'Starter hub — Nest, Hatcher & Shops' },
  { id:'jungle',  name:'Jungle',          tier:1, x:0,    y:0,    w:1400, h:1200, col:'#2e8b57', col2:'#1f6e42', unlock:100,  guard:{name:'Vine Gorilla', spd:200}, gimmick:'Vine swings, mid-tier eggs' },
  { id:'cave',    name:'Cave',            tier:1, x:1400, y:0,    w:1400, h:1200, col:'#4a4a5e', col2:'#33333f', unlock:100,  guard:{name:'Lantern Bat', spd:215}, gimmick:'Dark zone — rare eggs' },
  { id:'volcano', name:'Volcano',         tier:2, x:2800, y:0,    w:1400, h:1200, col:'#e0562e', col2:'#a63a1a', unlock:400,  guard:{name:'Magma Brute', spd:250}, gimmick:'Lava jumps, high-value eggs' },
  { id:'frost',   name:'Frost Peak',      tier:1, x:4200, y:0,    w:1400, h:1200, col:'#a8d8ea', col2:'#7ab8d8', unlock:100,  guard:{name:'Ice Sentinel', spd:210}, gimmick:'Slippery ice, speed eggs' },
  { id:'sky',     name:'Sky Islands',     tier:2, x:0,    y:1200, w:1400, h:1200, col:'#87ceeb', col2:'#5aa9d6', unlock:400,  guard:{name:'Cloud Harpy', spd:245}, gimmick:'Floating platforms, flip routes' },
  { id:'ruins',   name:'Ruins',           tier:2, x:2800, y:1200, w:1400, h:1200, col:'#c2a05a', col2:'#97793d', unlock:400,  guard:{name:'Stone Warden', spd:255}, gimmick:'Crumbling walls, wall-run routes' },
  { id:'neon',    name:'Neon City',       tier:3, x:4200, y:1200, w:1400, h:1200, col:'#7a2bd6', col2:'#4a148c', unlock:1000, guard:{name:'Rooftop Drone', spd:285}, gimmick:'Rooftop parkour, dash-gated eggs' },
  { id:'sea',     name:'Underwater Dome', tier:2, x:0,    y:2400, w:1400, h:1200, col:'#1f7fae', col2:'#155a80', unlock:400,  guard:{name:'Angler Guard', spd:250}, gimmick:'Slow-motion currents, unique eggs' },
  { id:'haunt',   name:'Haunted Manor',   tier:3, x:1400, y:2400, w:1400, h:1200, col:'#3d2b52', col2:'#241636', unlock:1000, guard:{name:'Ghost Butler', spd:280}, gimmick:'Invisible walls, jumpscare eggs' },
  { id:'desert',  name:'Desert Temple',   tier:3, x:2800, y:2400, w:1400, h:1200, col:'#e8c878', col2:'#c1a04e', unlock:1000, guard:{name:'Pharaoh Jackal', spd:290}, gimmick:'Sand traps, timed doors' },
  { id:'space',   name:'Space Station',   tier:4, x:4200, y:2400, w:1400, h:1200, col:'#1b2440', col2:'#0d1226', unlock:2000, guard:{name:'Astro Enforcer', spd:315}, gimmick:'Low gravity — Mythic egg spawns!' },
  { id:'void',    name:'The Void',        tier:5, x:2800, y:3600, w:1400, h:1200, col:'#0a0a14', col2:'#000006', unlock:3000, guard:{name:'??VOIDLING??', spd:345}, gimmick:'MAX collection only. Exclusive Brainrots.' }
];

// ===== 74 BRAINROTS =====
// p = passive: none|spd|magnet|stealth|invis|dash|shield|camo|decoy|teleport|slowmo|instant|double|chase
const BRAINROTS = [
  // COMMON (20)
  {n:'Coin Goblin',r:'COMMON',p:'magnet'},{n:'Dust Bunny',r:'COMMON',p:'none'},{n:'Lil Potato',r:'COMMON',p:'none'},
  {n:'Crumb Snatcher',r:'COMMON',p:'none'},{n:'Basic Bean',r:'COMMON',p:'none'},{n:'Grey Mouse',r:'COMMON',p:'none'},
  {n:'Old Boot',r:'COMMON',p:'none'},{n:'Sad Rock',r:'COMMON',p:'none'},{n:'Sticker Slug',r:'COMMON',p:'none'},
  {n:'Penny Pincher',r:'COMMON',p:'none'},{n:'Mop Head',r:'COMMON',p:'none'},{n:'Box Cat',r:'COMMON',p:'none'},
  {n:'Static Sheep',r:'COMMON',p:'none'},{n:'Plain Jane',r:'COMMON',p:'none'},{n:'Damp Sponge',r:'COMMON',p:'none'},
  {n:'Sock Puppet',r:'COMMON',p:'none'},{n:'Brick Brack',r:'COMMON',p:'none'},{n:'Bland Bandit',r:'COMMON',p:'none'},
  {n:'Mud Pup',r:'COMMON',p:'none'},{n:'Ye Olde Crumb',r:'COMMON',p:'none'},
  // UNCOMMON (18)
  {n:'Magnet Mouse',r:'UNCOMMON',p:'magnet'},{n:'Speedy Sprout',r:'UNCOMMON',p:'spd'},{n:'Bubble Bat',r:'UNCOMMON',p:'none'},
  {n:'Lucky Leaf',r:'UNCOMMON',p:'none'},{n:'Tofu Titan',r:'UNCOMMON',p:'none'},{n:'Copper Crow',r:'UNCOMMON',p:'none'},
  {n:'Giga Gerbil',r:'UNCOMMON',p:'spd'},{n:'Snack Serpent',r:'UNCOMMON',p:'none'},{n:'Turbo Toast',r:'UNCOMMON',p:'spd'},
  {n:'Jolly Jumper',r:'UNCOMMON',p:'none'},{n:'Pixel Pigeon',r:'UNCOMMON',p:'none'},{n:'Choco Chunk',r:'UNCOMMON',p:'none'},
  {n:'Bouncy Ballerina',r:'UNCOMMON',p:'none'},{n:'Zesty Zombie',r:'UNCOMMON',p:'none'},{n:'Mint Moth',r:'UNCOMMON',p:'none'},
  {n:'Radar Rat',r:'UNCOMMON',p:'magnet'},{n:'Slick Sardine',r:'UNCOMMON',p:'none'},{n:'Waffle Wizard',r:'UNCOMMON',p:'none'},
  // RARE (15)
  {n:'Wall Crawler',r:'RARE',p:'dash'},{n:'Double Hopper',r:'RARE',p:'spd'},{n:'Phantom Finch',r:'RARE',p:'stealth'},
  {n:'Fog Ferret',r:'RARE',p:'stealth'},{n:'Coin Vacuum',r:'RARE',p:'magnet'},{n:'Shadow Shrimp',r:'RARE',p:'stealth'},
  {n:'Midas Mouse',r:'RARE',p:'none'},{n:'Ghost Guppy',r:'RARE',p:'invis'},{n:'Blink Bunny',r:'RARE',p:'invis'},
  {n:'Echo Gecko',r:'RARE',p:'none'},{n:'Volt Vole',r:'RARE',p:'spd'},{n:'Prism Prawn',r:'RARE',p:'none'},
  {n:'Silent Cicada',r:'RARE',p:'stealth'},{n:'Mirror Mantis',r:'RARE',p:'invis'},{n:'Phase Frog',r:'RARE',p:'none'},
  // EPIC (10)
  {n:'Dash Devourer',r:'EPIC',p:'dash'},{n:'Iron Iguana',r:'EPIC',p:'none'},{n:'Shield Shroom',r:'EPIC',p:'shield'},
  {n:'Blaze Badger',r:'EPIC',p:'dash'},{n:'Storm Stork',r:'EPIC',p:'spd'},{n:'Ninja Newt',r:'EPIC',p:'shield'},
  {n:'Comet Carp',r:'EPIC',p:'dash'},{n:'Gale Gator',r:'EPIC',p:'spd'},{n:'Frost Falcon',r:'EPIC',p:'shield'},{n:'Warp Weasel',r:'EPIC',p:'dash'},
  // LEGENDARY (6)
  {n:'Gravity Imp',r:'LEGENDARY',p:'teleport'},{n:'Decoy Dodo',r:'LEGENDARY',p:'decoy'},{n:'Camo Chameleon',r:'LEGENDARY',p:'camo'},
  {n:'Quantum Quokka',r:'LEGENDARY',p:'teleport'},{n:'Titan Toucan',r:'LEGENDARY',p:'decoy'},{n:'Illusion Ibex',r:'LEGENDARY',p:'camo'},
  // MYTHIC (3)
  {n:'Chrono Snail',r:'MYTHIC',p:'slowmo'},{n:'Teleport Tuna',r:'MYTHIC',p:'teleport'},{n:'Nest Ninja',r:'MYTHIC',p:'instant'},
  // SECRET (2)
  {n:'The Accountant',r:'SECRET',p:'double'},{n:'Void Vulture',r:'SECRET',p:'chase'}
];

// Passive descriptions for the DEX
const PASSIVE_INFO = {
  none:'No passive — pure filler value.',
  spd:'Small permanent speed boost while carried.',
  magnet:'Pulls nearby Shell Coins to you.',
  stealth:'25% chance guards do NOT aggro when you grab an egg.',
  invis:'Brief invisibility after you steal — victims lose your trail.',
  dash:'Improves your DASH distance & lowers cooldown.',
  shield:'Gain a 3s steal shield after being robbed.',
  camo:'Your train fades — rivals steal from you half as often.',
  decoy:'Spawns a decoy Brainrot that guards & rivals chase.',
  teleport:'Upgrades dash into a long-range blink.',
  slowmo:'Time-slow aura — guards & rivals near you move 40% slower.',
  instant:'Once per round: bank your whole train from ANYWHERE (X).',
  double:'DOUBLES all value banked into your Nest. 💰',
  chase:'+30% speed while a guard is actively chasing you.'
};

// Trail cosmetics (meta shop)
const TRAILS = [
  {id:'default', name:'Rainbow Sparkle', cost:0,   col:'rainbow'},
  {id:'fire',    name:'Fire Trail',      cost:20,  col:'#ff4757'},
  {id:'ice',     name:'Frost Trail',     cost:20,  col:'#54d1ff'},
  {id:'void',    name:'Void Trail',      cost:50,  col:'#a55eea'},
  {id:'gold',    name:'Golden Trail',    cost:100, col:'#ffd93d'}
];

const BOT_NAMES = ['Rizz Raccoon','Sigma Steve','NPC Nathan','Gyatt Gary'];

// Shop stock
const SPEED_SHOP = [
  {id:'boots',  name:'Speed Boots',   cost:30,  desc:'+8% speed this round (stacks ×3)', max:3},
  {id:'shield', name:'Steal Shield',  cost:40,  desc:'6s immunity from stealing', max:9},
  {id:'dash',   name:'Unlock DASH',   cost:60,  desc:'Enables SHIFT-dash ability', max:1},
  {id:'decoy',  name:'Decoy Brainrot',cost:25,  desc:'Drop a fake that fools chasers (×3)', max:9}
];
const DUMBELL_COST = 50; // each dumbbell: -0.8% debuff per carried pet, max 5
const NEST_SLOT_COST = 80; // +1 nest slot, max 10
