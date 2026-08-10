"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { songsData, categories, artistLinks, type SongData } from "@/lib/songs-data";

declare global {
  interface Window {
    YT: { Player: new (id: string, c: Record<string, unknown>) => YTP; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady: () => void;
  }
}
interface YTP { playVideo(): void; pauseVideo(): void; getCurrentTime(): number; getDuration(): number; seekTo(s: number, a: boolean): void; destroy(): void; getPlayerState(): number; }

function Eq({ color = "bg-amber-400" }: { color?: string }) {
  return <div className="flex items-end gap-[2px] h-3.5"><div className={`w-[2.5px] rounded-full ${color} eq-1`}/><div className={`w-[2.5px] rounded-full ${color} eq-2`}/><div className={`w-[2.5px] rounded-full ${color} eq-3`}/></div>;
}

function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-grad)"/>
      <text x="32" y="45" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="38" fill="white">b</text>
    </svg>
  );
}

export default function Home() {
  const [songs, setSongs] = useState<SongData[]>(songsData);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [online, setOnline] = useState<number | null>(null);
  const [prog, setProg] = useState(0);
  const [dur, setDur] = useState(0);
  const [time, setTime] = useState(0);
  const [ytOk, setYtOk] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [direction, setDirection] = useState(1);
  const [listOpen, setListOpen] = useState(false);
  const [listCat, setListCat] = useState("all");
  const [listQuery, setListQuery] = useState("");
  const [clock, setClock] = useState("");

  const pl = useRef<YTP | null>(null);
  const tk = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionId = useRef("");
  const song = songs[idx] || songs[0];

  // filtered list for drawer
  const filteredList = useMemo(() => songs.filter(s => {
    if (listCat !== "all" && s.category !== listCat) return false;
    if (listQuery) { const q = listQuery.toLowerCase(); if (!s.title.toLowerCase().includes(q) && !s.artist.toLowerCase().includes(q)) return false; }
    return true;
  }), [songs, listCat, listQuery]);

  useEffect(() => { let id = ""; try { id = localStorage.getItem("bb-sid") || ""; } catch {/* */} if (!id) { id = `bb_${Date.now()}_${Math.random().toString(36).slice(2,10)}`; try { localStorage.setItem("bb-sid", id); } catch {/* */} } sessionId.current = id; }, []);

  useEffect(() => {
    const hb = async () => { if (!sessionId.current) return; try { const r = await fetch("/api/online", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sessionId.current }) }); const d = await r.json(); if (typeof d.count === "number") setOnline(d.count); } catch {/* */} };
    hb(); const iv = setInterval(hb, 10000); return () => clearInterval(iv);
  }, []);

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setClock(`${h}:${m} ${ampm}`);
    };
    updateClock();
    const iv = setInterval(updateClock, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { if (typeof window === "undefined") return; if (window.YT) { setYtOk(true); return; } const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s); window.onYouTubeIframeAPIReady = () => setYtOk(true); }, []);
  useEffect(() => { try { const s = localStorage.getItem("bb-fav"); if (s) setFavs(new Set(JSON.parse(s))); } catch {/* */} }, []);
  useEffect(() => { try { localStorage.setItem("bb-fav", JSON.stringify([...favs])); } catch {/* */} }, [favs]);

  useEffect(() => {
    if (!ytOk || !started) return;
    if (pl.current) { pl.current.destroy(); pl.current = null; }
    const el = document.getElementById("yt-slot"); if (!el) return;
    el.innerHTML = "<div id='yt-p'></div>";
    pl.current = new window.YT.Player("yt-p", { height:"0", width:"0", videoId: song.youtubeId, playerVars:{ autoplay:1, controls:0, disablekb:1, fs:0, rel:0 }, events: {
      onReady:(e:{target:YTP})=>{ e.target.playVideo(); setDur(e.target.getDuration()); },
      onStateChange:(e:{data:number;target:YTP})=>{ const S=window.YT.PlayerState; if(e.data===S.ENDED) goNext(); else if(e.data===S.PLAYING){setPlaying(true);setDur(e.target.getDuration());} else if(e.data===S.PAUSED) setPlaying(false); if(e.data===-1) setTimeout(()=>{try{const st=pl.current?.getPlayerState?.();if(st===-1||st===5){rm(song.youtubeId);goNext();}}catch{/* */}},6000); },
      onError:()=>{rm(song.youtubeId);goNext();},
    }} as unknown as Record<string,unknown>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytOk, started, song.youtubeId]);

  useEffect(() => { if(tk.current)clearInterval(tk.current); if(!playing)return; tk.current=setInterval(()=>{try{const p=pl.current;if(!p)return;const t=p.getCurrentTime(),d=p.getDuration();setTime(t);setDur(d);if(d>0)setProg((t/d)*100);}catch{/* */}},300); return()=>{if(tk.current)clearInterval(tk.current);}; }, [playing]);

  const rm = useCallback((id:string)=>setSongs(v=>{const n=v.filter(s=>s.youtubeId!==id);return n.length?n:v;}),[]);
  const playSong = useCallback((s:SongData)=>{ const i=songs.findIndex(x=>x.youtubeId===s.youtubeId); if(i>=0){setIdx(i);setStarted(true);setPlaying(true);setProg(0);setTime(0);setDirection(1);} },[songs]);
  const goNext = useCallback(()=>{setDirection(1);setProg(0);setTime(0);if(shuffle)setIdx(Math.floor(Math.random()*songs.length));else setIdx(p=>(p+1)%songs.length);},[shuffle,songs.length]);
  const goPrev = useCallback(()=>{setDirection(-1);setProg(0);setTime(0);if(shuffle)setIdx(Math.floor(Math.random()*songs.length));else setIdx(p=>(p-1+songs.length)%songs.length);},[shuffle,songs.length]);
  const togglePlay = useCallback(()=>{ if(!started){setStarted(true);setPlaying(true);return;} if(pl.current){playing?pl.current.pauseVideo():pl.current.playVideo();} setPlaying(!playing); },[started,playing]);
  const toggleFav = useCallback((id:string)=>{setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});},[]);
  const seek = useCallback((pct:number)=>{if(pl.current&&dur>0){const t=(pct/100)*dur;pl.current.seekTo(t,true);setProg(pct);setTime(t);}},[dur]);
  const fmt = (s:number) => (!s||isNaN(s)) ? "0:00" : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;
  const lnk = (c:string) => artistLinks[c as keyof typeof artistLinks] || artistLinks.More;
  const isFav = favs.has(song.youtubeId);

  const slideV = {
    enter:(d:number)=>({x:d>0?280:-280,opacity:0,scale:.88,rotateY:d>0?20:-20}),
    center:{x:0,opacity:1,scale:1,rotateY:0},
    exit:(d:number)=>({x:d>0?-280:280,opacity:0,scale:.88,rotateY:d>0?-20:20}),
  };

  return (
      <div className="flex-1 overflow-y-auto drawer-scroll px-5 sm:px-7 py-4">
      <div id="yt-slot" className="hidden"/>

      {/* BG */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="orb-a absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/[.04] blur-[150px]"/>
        <div className="orb-b absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full bg-orange-600/[.03] blur-[160px]"/>
        <div className="orb-c absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-400/[.02] blur-[130px]"/>
        {[{top:"10%",left:"6%",size:55,delay:0,dur:14},{top:"72%",left:"88%",size:70,delay:2,dur:16},{top:"18%",left:"80%",size:38,delay:4,dur:13},{top:"82%",left:"10%",size:48,delay:6,dur:15},{top:"50%",left:"4%",size:30,delay:8,dur:12},{top:"30%",left:"94%",size:42,delay:3,dur:17}].map((s,i)=>(
          <div key={i} className="float-shape absolute rounded-xl border border-amber-500/[.07] bg-white/[.008]" style={{top:s.top,left:s.left,width:s.size,height:s.size,animationDelay:`${s.delay}s`,animationDuration:`${s.dur}s`}}/>
        ))}
      </div>

      {/* ═══ HEADER ═══ */}
      <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="relative z-20 px-5 sm:px-8 pt-5 pb-3">
        <div className="flex items-center justify-between">
          {/* Left — Logo + Online */}
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-none">bhakti<span className="text-amber-400">Bhajan</span></h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"/><span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500"/></span>
                <AnimatePresence mode="wait">
                  <motion.span key={online??0} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}} transition={{duration:.25}} className="text-[11px] text-zinc-500 tabular-nums">
                    {online !== null ? `${online} listening now` : "connecting…"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Center — Clock */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block">
            <AnimatePresence mode="wait">
              <motion.span key={clock} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} transition={{duration:.3}}
                className="text-sm font-semibold text-zinc-400 tabular-nums tracking-wide">{clock}</motion.span>
            </AnimatePresence>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=>setListOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[.06] hover:bg-white/[.1] text-zinc-300 text-sm font-medium transition border border-white/[.08] hover:border-white/[.15]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/></svg>
              <span className="hidden sm:inline">{songs.length} Songs</span>
              <span className="sm:hidden">List</span>
            </motion.button>
            <a href="https://open.spotify.com/search/Radha%20Krishna%20Bhajan" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] text-sm font-medium transition border border-[#1DB954]/10">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              Spotify
            </a>
            <a href="https://music.youtube.com/search?q=Radha+Krishna+Bhajan" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 text-sm font-medium transition border border-red-500/10">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>
              YT Music
            </a>
          </div>
        </div>
      </motion.header>

      {/* ═══ CENTER STAGE ═══ */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-5 py-4 sm:py-6" style={{perspective:"1200px"}}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={song.youtubeId} custom={direction} variants={slideV} initial="enter" animate="center" exit="exit"
            transition={{duration:.5,ease:[.23,1,.32,1]}} style={{transformStyle:"preserve-3d"}} className="flex flex-col items-center">
            <div className="relative mb-8">
              {playing && <div className="absolute inset-0 -m-8 rounded-full bg-amber-500/10 blur-3xl animate-pulse"/>}
              <div className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full shadow-2xl shadow-black/50 ${playing?"vinyl-spinning":"vinyl-paused vinyl-spinning"}`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/[.06]"/>
                <div className="absolute inset-3 rounded-full border border-white/[.04]"/>
                <div className="absolute inset-6 rounded-full border border-white/[.03]"/>
                <div className="absolute inset-9 rounded-full border border-white/[.03]"/>
                <div className="absolute inset-12 rounded-full border border-white/[.02]"/>
                <div className="absolute inset-[25%] rounded-full overflow-hidden border-2 border-zinc-700 shadow-inner">
                  <img src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover"/>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#08060e] border border-zinc-700"/>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center leading-tight max-w-md">{song.title}</h2>
            <p className="mt-2 text-sm text-zinc-500 text-center">{song.artist}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="w-full max-w-sm mt-8">
          <div className="progress-wrap h-1 bg-white/[.08] rounded-full cursor-pointer relative group"
            onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seek(((e.clientX-r.left)/r.width)*100);}}>
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative transition-all" style={{width:`${prog}%`}}>
              <div className="prog-thumb absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-amber-500/40"/>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-zinc-600 font-mono tabular-nums"><span>{fmt(time)}</span><span>{fmt(dur)}</span></div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <motion.button whileHover={{scale:1.15}} whileTap={{scale:.9}} onClick={()=>setShuffle(!shuffle)} className={`p-2 rounded-full transition ${shuffle?"text-amber-400":"text-zinc-600 hover:text-zinc-300"}`} title="Shuffle">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </motion.button>
          <motion.button whileHover={{scale:1.15}} whileTap={{scale:.85}} onClick={goPrev} className="p-2.5 text-zinc-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </motion.button>
          <motion.button whileHover={{scale:1.08}} whileTap={{scale:.92}} onClick={togglePlay}
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black shadow-xl ${playing?"play-glow":"shadow-amber-500/20"}`}>
            {playing?<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>:<svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
          </motion.button>
          <motion.button whileHover={{scale:1.15}} whileTap={{scale:.85}} onClick={goNext} className="p-2.5 text-zinc-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </motion.button>
          <motion.button whileHover={{scale:1.2}} whileTap={{scale:.8}} onClick={()=>toggleFav(song.youtubeId)}
            className={`p-2 rounded-full transition ${isFav?"text-red-500":"text-zinc-600 hover:text-zinc-300"}`}>
            <svg className="w-4 h-4" fill={isFav?"currentColor":"none"} stroke="currentColor" strokeWidth={isFav?0:1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </motion.button>
        </div>
        {playing && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex items-end gap-[3px] h-5 mt-5"><div className="w-[3px] rounded-full bg-amber-500/60 eq-1"/><div className="w-[3px] rounded-full bg-amber-400/50 eq-2"/><div className="w-[3px] rounded-full bg-orange-500/60 eq-3"/><div className="w-[3px] rounded-full bg-amber-400/50 eq-4"/><div className="w-[3px] rounded-full bg-orange-400/60 eq-5"/></motion.div>}
      </div>

      {/* ═══ FOOTER ═══ */}
            <motion.footer
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:.4}}
        className="relative z-20 grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-0 px-5 sm:px-8 py-4 text-center">
          <div className="justify-self-center sm:justify-self-start">

          <a
            href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-600 hover:text-red-400 transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Watch on YouTube
          </a>
        </div>

        <p className="justify-self-center text-[10px] sm:text-[11px] text-zinc-600 text-center">
          © {new Date().getFullYear()} Reserved by <span className="text-zinc-400 font-medium">Ritesh Sharma</span>
        </p>

        <div className="justify-self-center sm:justify-self-end">
          <a
            href={lnk(song.category).spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-600 hover:text-[#1DB954] transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Find on Spotify
          </a>
        </div>
      </motion.footer>

      {/* ═══ SONG LIST DRAWER ═══ */}
      <AnimatePresence>
        {listOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setListOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"/>
            <motion.div
              initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",stiffness:280,damping:32}}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl overflow-hidden"
              style={{maxHeight:"88vh", background:"linear-gradient(180deg, rgba(18,16,24,0.97) 0%, rgba(12,10,18,0.99) 100%)", borderTop:"1px solid rgba(255,255,255,0.07)"}}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-zinc-600"/>
              </div>

              {/* Header area */}
              <div className="px-6 sm:px-8 pt-2 pb-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Song Library</h3>
                    <p className="text-xs text-zinc-500 mt-1">{filteredList.length} of {songs.length} songs</p>
                  </div>
                  <motion.button whileHover={{scale:1.1,rotate:90}} whileTap={{scale:.9}} onClick={()=>setListOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[.06] text-zinc-400 hover:text-white hover:bg-white/[.1] transition">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </motion.button>
                </div>

                {/* Search */}
                <div className="relative mb-5">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Search songs or artists…" value={listQuery} onChange={e=>setListQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-white/[.05] border border-white/[.08] rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/15 focus:bg-white/[.07] transition-all"/>
                  {listQuery && (
                    <button onClick={()=>setListQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/[.08] text-zinc-400 hover:text-white hover:bg-white/[.15] transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>

                {/* Filter pills */}
                <div className="flex gap-2.5 pb-1 overflow-x-auto overscroll-x-contain" style={{perspective:"600px"}}>
                  {categories.map((c,i)=>(
                    <motion.button key={c.id}
                      initial={{opacity:0,y:10,rotateX:-15}}
                      animate={{opacity:1,y:0,rotateX:0}}
                      transition={{delay:i*0.04,duration:.35,ease:[.23,1,.32,1]}}
                      onClick={()=>setListCat(c.id)}
                      className={`filter-pill px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                        listCat===c.id
                          ? "bg-gradient-to-r " + c.color + " text-white shadow-lg shadow-amber-500/10"
                          : "bg-white/[.05] text-zinc-400 hover:text-white hover:bg-white/[.1] border border-white/[.07]"
                      }`}
                    >{c.name}</motion.button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[.06] to-transparent mx-6 sm:mx-8 flex-shrink-0"/>

              {/* Song list */}
              <div className="flex-1 overflow-y-auto drawer-scroll px-5 sm:px-7 py-4" style={{perspective:"800px"}}>
                {filteredList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                    <svg className="w-12 h-12 mb-4 text-zinc-700" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <p className="text-base font-medium">No songs found</p>
                    <button onClick={()=>{setListQuery("");setListCat("all");}} className="mt-3 text-sm text-amber-500 hover:text-amber-400 transition font-medium">Clear all filters</button>
                  </div>
                ) : (
                  filteredList.map((s, i) => {
                    const active = song.youtubeId === s.youtubeId;
                    const fav = favs.has(s.youtubeId);
                    return (
                      <motion.div
                        key={s.youtubeId}
                        initial={{opacity:0,x:-20,rotateY:-5}}
                        animate={{opacity:1,x:0,rotateY:0}}
                        transition={{delay:Math.min(i*0.02,0.5),duration:.4,ease:[.23,1,.32,1]}}
                        onClick={()=>{playSong(s);setListOpen(false);}}
                        className={`drawer-row group flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer mb-1.5 ${
                          active ? "active-row-glow bg-amber-500/[.06]" : "hover:bg-white/[.03]"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 shadow-lg shadow-black/30">
                          <img src={`https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" loading="lazy"/>
                          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-200 ${
                            active&&playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}>
                            {active&&playing ? <Eq/> : (
                              <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                          </div>
                          {active && <div className="absolute inset-0 ring-2 ring-amber-500/40 rounded-xl"/>}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate leading-snug ${active?"text-amber-400":"text-zinc-200 group-hover:text-white"}`}>{s.title}</p>
                          <p className="text-xs text-zinc-500 truncate mt-1">{s.artist}</p>
                        </div>

                        {/* Mood */}
                        <span className="hidden sm:inline-flex px-3 py-1 text-[11px] text-zinc-600 capitalize font-medium bg-white/[.03] rounded-lg">{s.mood}</span>

                        {/* Favorite */}
                        <motion.button
                          whileHover={{scale:1.25}} whileTap={{scale:.8}}
                          onClick={e=>{e.stopPropagation();toggleFav(s.youtubeId);}}
                          className={`p-2 rounded-xl transition-colors ${fav?"text-red-500":"text-zinc-700 hover:text-zinc-400"}`}
                        >
                          <svg className="w-5 h-5" fill={fav?"currentColor":"none"} stroke="currentColor" strokeWidth={fav?0:1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </motion.button>
                      </motion.div>
                    );
                  })
                )}
                <div className="h-8"/>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
