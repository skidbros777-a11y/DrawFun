// ===== PARKOUR RUSH — 60 STAGES / 10 WORLDS =====
const WORLDS=[
 {name:'Grasslands',theme:{sky:0x87ceeb,fog:0xbfe3ff,ground:0x7ec850,block:0x8fbc5a}},
 {name:'Lava Caves',theme:{sky:0x2b0f0f,fog:0x551111,ground:0x3d1515,block:0x8c2f1e}},
 {name:'Frost Peaks',theme:{sky:0xd8f0ff,fog:0xe6f6ff,ground:0xcfe9f5,block:0x9fd4ee}},
 {name:'Sky Islands',theme:{sky:0x9fd8ff,fog:0xcfeaff,ground:0x8fc3e8,block:0xd9ecff}},
 {name:'Desert Temple',theme:{sky:0xffe8b0,fog:0xf5dfa8,ground:0xd9b56a,block:0xc79a45}},
 {name:'Neon City',theme:{sky:0x12082b,fog:0x2a1259,ground:0x1a0f3d,block:0x7a2bd6}},
 {name:'Toxic Swamp',theme:{sky:0x1a2e0e,fog:0x2c4a1a,ground:0x3d5a22,block:0x6a8f3d}},
 {name:'Candy Land',theme:{sky:0xffd6e8,fog:0xffe3f0,ground:0xff9fc4,block:0xffb7d5}},
 {name:'Space Station',theme:{sky:0x050510,fog:0x101024,ground:0x181830,block:0x3d3d6b}},
 {name:'THE VOID',theme:{sky:0x000005,fog:0x05050f,ground:0x0a0a18,block:0x1a1a3d}}
];
// stage gimmicks cycle: g=static jump run, s=spinners, p=jump pads, m=moving platforms, n=narrow, x=mixed chaos
const GIMMICKS=['g','s','p','m','n','x'];
function stageDef(i){
 const w=Math.floor(i/6), s=i%6;
 return {world:w,index:s, gimmick:GIMMICKS[s%6], diff:1+s*0.35+w*0.5};
}
// ===== THE 50 FEATURES =====
const FEATURES=[
'1. 60 stages across 10 themed worlds',
'2. True 3D graphics (Three.js WebGL)',
'3. Roblox-style blocky avatar with face',
'4. Checkpoint flags (respawn points)',
'5. Death = respawn at last checkpoint',
'6. Double jump',
'7. Sprint (SHIFT) with FOV kick',
'8. Coyote time (late jump still works)',
'9. Jump buffering',
'10. Jump pads with launch VFX',
'11. Spinning hazard bars',
'12. Moving platforms',
'13. Narrow beam balance sections',
'14. Kill bricks (lava/red) with flash',
'15. Green win portal per stage',
'16. Spinning coins to collect',
'17. Coins persist per stage',
'18. Stage timer + best time saved',
'19. Death counter per stage',
'20. Full progress save (localStorage)',
'21. Stage select map with lock icons',
'22. World theming: sky, fog, colors',
'23. Animated world skybox gradient',
'24. Clouds floating in the sky',
'25. Particle burst on landing',
'26. Particle burst on death',
'27. Coin sparkle pickup VFX',
'28. Jump pad ring shockwave',
'29. Portal swirl animation',
'30. Checkpoint flag wave + chime',
'31. WebAudio SFX (jump, land, coin, death, win)',
'32. Win fanfare jingle',
'33. Ambient wind hum',
'34. Red screen flash on death',
'35. Camera shake on landing hard',
'36. Smooth follow camera with look control',
'37. Third-person camera collision-free view',
'38. Mobile joystick + JUMP button',
'39. Touch camera drag',
'40. Pause menu (ESC)',
'41. Restart stage (R)',
'42. Avatar color picker',
'43. Mute toggle',
'44. Feature list (this!)',
'45. Reset progress option',
'46. FPS-optimized instanced blocks',
'47. Directional sun + shadows',
'48. Animated avatar run cycle (legs/arms swing)',
'49. Player shadow blob under avatar',
'50. Auto-progress: next stage button on win'
];
