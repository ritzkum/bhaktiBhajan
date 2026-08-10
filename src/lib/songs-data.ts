export interface SongData {
  title: string;
  artist: string;
  youtubeId: string;
  category: string;
  mood: "devotional" | "celebratory" | "meditative" | "kirtan" | "chanting";
  spotifyUrl?: string;
  ytMusicUrl?: string;
}

export const songsData: SongData[] = [
  // ═══ INDRESH UPADHYAY JI — BhaktiPath Channel ═══
  { title: "Radha Gori Gori", artist: "Indresh Upadhyay & B Praak", youtubeId: "xVU2UDaFOfE", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Pyaro Vrindavan", artist: "Indresh Upadhyay", youtubeId: "kNK7XYZcyBM", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Mero Mann Vrindavan Mein Atko", artist: "Indresh Upadhyay", youtubeId: "3o95qn8BjdQ", category: "indresh-upadhyay", mood: "meditative" },
  { title: "Radhika Rani Ji", artist: "Indresh Upadhyay", youtubeId: "FW5Aj9z0Slw", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Radha Ramanam Hare Hare", artist: "Indresh Upadhyay", youtubeId: "_CWcBWSKItk", category: "indresh-upadhyay", mood: "meditative" },
  { title: "Mai Bairagan Hongi", artist: "Indresh Upadhyay", youtubeId: "LLAvgTeXXy8", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Mai Bairagan (New)", artist: "Indresh Upadhyay", youtubeId: "O4bde1yPgxo", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Sun Radhika Dulari", artist: "Indresh Upadhyay", youtubeId: "-MrHeOioBC4", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Radha Rani Lage - Mithe Ras Se Bharyo", artist: "Indresh Upadhyay", youtubeId: "dNIGPhpkbLQ", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Nainan Me Rakhu", artist: "Indresh Upadhyay", youtubeId: "59zYbAeBLeM", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Jaadu Karke", artist: "Indresh Upadhyay", youtubeId: "yzLLQVm4k2o", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Braj Raj Ko Upasi", artist: "Indresh Upadhyay", youtubeId: "iLyRDdZjDkE", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Geet Govind", artist: "Indresh Upadhyay", youtubeId: "8TEnQKs2pdo", category: "indresh-upadhyay", mood: "meditative" },
  { title: "Vrindavan Rasamrit", artist: "Indresh Upadhyay", youtubeId: "jU3V0n0MP_g", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Bhishma Stuti", artist: "Indresh Upadhyay", youtubeId: "fA76NNJK16s", category: "indresh-upadhyay", mood: "meditative" },
  { title: "Holi Ke Rasiya", artist: "Indresh Upadhyay", youtubeId: "DFglwH8WW8w", category: "indresh-upadhyay", mood: "celebratory" },
  { title: "Non-Stop Radha Rani Bhajans", artist: "Indresh Upadhyay", youtubeId: "mWXuaHY2ALs", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Radha Raman Vrindavan Vare", artist: "Indresh Upadhyay", youtubeId: "1Ity1KZA_OQ", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Teri Sharan Mein Aake", artist: "Indresh Upadhyay", youtubeId: "OU_4DDjVHdE", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Radha Ramanam (Lyrics)", artist: "Indresh Upadhyay", youtubeId: "UFjxOjUJexU", category: "indresh-upadhyay", mood: "meditative" },
  { title: "Bhaktipath Bhajans Collection", artist: "Indresh Upadhyay", youtubeId: "GatkQIXgYTY", category: "indresh-upadhyay", mood: "devotional" },
  { title: "Jagannath Chaka Nain Lilachal Vare", artist: "Indresh Upadhyay", youtubeId: "5B2N7zYO1b8", category: "indresh-upadhyay", mood: "devotional" },

  // ═══ RADHIKA DAS ═══
  { title: "Hare Krishna — Union Chapel London", artist: "Radhika Das", youtubeId: "9P7HcLbRp8M", category: "radhika-das", mood: "kirtan" },
  { title: "Radhe Govinda — Union Chapel", artist: "Radhika Das", youtubeId: "A859CeMM31U", category: "radhika-das", mood: "kirtan" },
  { title: "Om Namah Shivaya — Union Chapel", artist: "Radhika Das", youtubeId: "JOkWSfdoO34", category: "radhika-das", mood: "meditative" },
  { title: "Shri Ram — Union Chapel", artist: "Radhika Das", youtubeId: "hpjRC0bqRZQ", category: "radhika-das", mood: "devotional" },
  { title: "Hare Krishna — New Years Eve", artist: "Radhika Das", youtubeId: "hu7V6y7wXow", category: "radhika-das", mood: "kirtan" },
  { title: "Hare Krishna — O2 Shepherds Bush", artist: "Radhika Das & Jahnavi Harrison", youtubeId: "XHAWruvOFgs", category: "radhika-das", mood: "kirtan" },
  { title: "Hare Krishna — EARTH Hackney", artist: "Radhika Das & Jahnavi Harrison", youtubeId: "cBmpasCxlNI", category: "radhika-das", mood: "kirtan" },
  { title: "Radhe Shyam — Vrindavan Temple", artist: "Radhika Das", youtubeId: "RjTqw4l7Bz8", category: "radhika-das", mood: "devotional" },
  { title: "Radhe Govinda — Mumbai DOME", artist: "Radhika Das", youtubeId: "u6OeOGQdFg0", category: "radhika-das", mood: "kirtan" },
  { title: "Radhe Govinda — O2 Shepherds Bush", artist: "Radhika Das", youtubeId: "wldeiuANeJk", category: "radhika-das", mood: "kirtan" },
  { title: "Shri Krishna Govinda — Union Chapel 2025", artist: "Radhika Das", youtubeId: "UCktk4CcrjI", category: "radhika-das", mood: "kirtan" },
  { title: "Sita Ram — Union Chapel 2025", artist: "Radhika Das", youtubeId: "Ir3AqCTe-6c", category: "radhika-das", mood: "devotional" },
  { title: "Hara Hara Mahadeva — O2 Shepherds Bush", artist: "Radhika Das", youtubeId: "KaXJnrkwTUQ", category: "radhika-das", mood: "kirtan" },
  { title: "Om Namah Shivaya — Adler Hall New York", artist: "Radhika Das", youtubeId: "gYFOazgULuk", category: "radhika-das", mood: "meditative" },
  { title: "Kirtan Rasa 2025 — Dubai", artist: "Radhika Das", youtubeId: "SUkoLXojUN4", category: "radhika-das", mood: "kirtan" },

  // ═══ KRISHNA DAS ═══
  { title: "Best of Krishna Das Mashup", artist: "Krishna Das", youtubeId: "F7KiWHSUJoI", category: "krishna-das", mood: "kirtan" },
  { title: "Om Namah Shivaya", artist: "Krishna Das", youtubeId: "PTc8X37oJBE", category: "krishna-das", mood: "meditative" },
  { title: "Radhe Govinda — Live NYC", artist: "Krishna Das", youtubeId: "LEeMdzKSFp8", category: "krishna-das", mood: "kirtan" },
  { title: "Radhe Govinda (Album)", artist: "Krishna Das", youtubeId: "l79XVpZMQBU", category: "krishna-das", mood: "kirtan" },
  { title: "Hare Krishna Hare Rama", artist: "Krishna Das", youtubeId: "10d07QtAQwU", category: "krishna-das", mood: "kirtan" },

  // ═══ CHITRA VICHITRA JI MAHARAJ — Official Channel ═══
  { title: "Meri Vinti Yahi Hai Radha Rani", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "IeAk_jl4OuI", category: "chitra-vichitra", mood: "devotional" },
  { title: "मोहे तो भरोसो है तिहारो री किशोरी राधे", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "uo37qfbD1Xw", category: "chitra-vichitra", mood: "devotional" },
  { title: "Kali Kamli Wala Mera Yaar Hai", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "ukA42YfiMEs", category: "chitra-vichitra", mood: "celebratory" },
  { title: "Tu Radhe Radhe Bol Jara", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "yz-a6kJ2fYQ", category: "chitra-vichitra", mood: "devotional" },
  { title: "Tamanna Yahi Hai Barsane Aaun", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "_BlR8tppLVo", category: "chitra-vichitra", mood: "devotional" },
  { title: "Radha Rani Ko Bhayo Avtar", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "NX2eNaBVuUA", category: "chitra-vichitra", mood: "celebratory" },
  { title: "Hame Radha Rani Tere Naam Ka Sahara", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "IaeM5A9N9I0", category: "chitra-vichitra", mood: "devotional" },
  { title: "Barsana Laage Mohe Pyara", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "DFCrg6I4IoI", category: "chitra-vichitra", mood: "devotional" },
  { title: "Super Hit Bhajans Non-Stop", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "CYhteqfelxY", category: "chitra-vichitra", mood: "celebratory" },
  { title: "Top 25 Bhajans Collection", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "lnmkCc73hZ8", category: "chitra-vichitra", mood: "devotional" },
  { title: "Mere Banke Bihari Sarkas Ka Danka", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "j6MYGgklJvM", category: "chitra-vichitra", mood: "celebratory" },
  { title: "Shri Radha Rasik Bihari", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "i_hsJeSf1zw", category: "chitra-vichitra", mood: "devotional" },
  { title: "Jab Se Banke Bihari Ji Se Pyar", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "cd97T74rQuQ", category: "chitra-vichitra", mood: "devotional" },
  { title: "Mere Banke Bihari Ke Naina", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "zCayxHsjFd8", category: "chitra-vichitra", mood: "devotional" },
  { title: "Chadh Gayi Shyam Naam Ki Masti", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "zL_EQCF796w", category: "chitra-vichitra", mood: "celebratory" },
  { title: "Likh Di Ye Zindagani", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "Fd9iWmvS3WI", category: "chitra-vichitra", mood: "devotional" },
  { title: "Saare Braj Mein Halla", artist: "Chitra Vichitra Ji Maharaj", youtubeId: "mrP0bhDCJQs", category: "chitra-vichitra", mood: "celebratory" },

  // ═══ MORE BHAJANS ═══
  { title: "Radha Kaise Na Jale (Lagaan)", artist: "Asha Bhosle & Udit Narayan", youtubeId: "OTaYCjy9vXg", category: "More", mood: "devotional" },
  { title: "Achyutam Keshavam", artist: "Various", youtubeId: "btOdAtmJBbw", category: "More", mood: "meditative" },
  { title: "Hey Gopal Krishna Karu Aarti", artist: "Bhajan India", youtubeId: "rlGlJJHe3pg", category: "More", mood: "devotional" },
  { title: "Mere To Girdhar Gopal", artist: "Chitra Singh", youtubeId: "cb-2JvLiQt8", category: "More", mood: "meditative" },
  { title: "Mohe Rang Do Laal", artist: "Shreya Ghoshal", youtubeId: "L-blmZxRgJk", category: "More", mood: "devotional" },
  { title: "Hey Girdhar Gopal Shyam", artist: "Saurabh Madhukar", youtubeId: "tl5Y2EkwtE4", category: "More", mood: "devotional" },
  { title: "Non Stop Krishna Bhajans", artist: "Various", youtubeId: "iW16WWmWZL4", category: "More", mood: "devotional" },
  { title: "Hare Krishna Maha Mantra", artist: "Traditional", youtubeId: "Zdcth9NndEA", category: "More", mood: "kirtan" },
  { title: "Best of ISKCON Kirtan", artist: "ISKCON", youtubeId: "GOVRkg9yhe0", category: "More", mood: "kirtan" },
  { title: "Hare Krishna ISKCON Original Maha Mantra by Swami Prabhupada", artist: "ISKCON", youtubeId: "MNzH-emA3Sk", category: "More", mood: "chanting" },
  { title: "Hare Krishna Hare Rama", artist: "Jubin Nautiyal", youtubeId: "miJXSrm3gz4", category: "More", mood: "devotional" },
  { title: "Shri Krishna Govind Hare Murari", artist: "Jubin Nautiyal", youtubeId: "1qmPNot9NJs", category: "More", mood: "devotional" },
  { title: "Ram Aayenge", artist: "Vishal Mishra,Payal Dev", youtubeId: "lc54LDZjon8", category: "More", mood: "devotional" },
  { title: "Raghunandana |HanuMan(Hindi)", artist: "Prasanth Varma, GowraHari, Saicharan, Lokeshwar, Harshavardhan, Kalyana", youtubeId: "LCI2OZiV5UQ", category: "More", mood: "meditative" },
  { title: "श्री हनुमान चालीसा", artist: "Rasraj Ji Maharaj - Lo-fi Version", youtubeId: "BLlTFapgvOo", category: "More", mood: "meditative" },
  { title: "Jaikal Mahakal", artist: "Amitabh Bachchan, Rashmika Mandanna", youtubeId: "oOl7VtdPCpU", category: "More", mood: "meditative" },
  { title: "Har Har Gange", artist: "Arijit Singh", youtubeId: "Njyx5ZuwEHI", category: "More", mood: "meditative" },
  { title: "Namo Namo", artist: "Arijit Singh", youtubeId: "dx4Teh-nv3A", category: "More", mood: "meditative" },
  { title: "Ganga Ke Kinare", artist: " Bunny | Sagar ", youtubeId: "ocRzt5NvI7A", category: "More", mood: "meditative" },
  { title: "Oonchi Oonchi Waadi", artist: " Hansraj Raghuwanshi", youtubeId: "YT8rY_o5VhY", category: "More", mood: "meditative" },
  { title: "Tum Prem Ho - Reprise", artist: "MOhit Lalwani | Bharat Kamal", youtubeId: "Feoea8FQTI0", category: "More", mood: "meditative" },
  { title: "Om Namo Bhagavate Vasudevaya", artist: "Mahavtar Narsimha", youtubeId: "2yhvCgpNJiA", category: "More", mood: "meditative" },
  { title: "Shish Nawata Hoon", artist: "Jubin Nautiyal | Payal Dev | Aditya Dev", youtubeId: "7-kcEa0eeYA", category: "More", mood: "meditative" },
];

export const categories = [
  { id: "all", name: "All", color: "from-amber-500 to-orange-500" },
  { id: "indresh-upadhyay", name: "Indresh Upadhyay Ji", color: "from-orange-500 to-red-500" },
  { id: "radhika-das", name: "Radhika Das", color: "from-purple-500 to-pink-500" },
  { id: "krishna-das", name: "Krishna Das", color: "from-blue-500 to-indigo-500" },
  { id: "chitra-vichitra", name: "Chitra Vichitra Ji", color: "from-green-500 to-teal-500" },
  { id: "More", name: "More", color: "from-pink-500 to-rose-500" },
];

export const artistLinks = {
  "indresh-upadhyay": { spotify: "https://open.spotify.com/search/Indresh%20Upadhyay", ytMusic: "https://music.youtube.com/channel/UC4P-PPCYp_RVddMkUZpVMtA" },
  "radhika-das": { spotify: "https://open.spotify.com/artist/4XVxXXnVhJJcqfHR5vLDnP", ytMusic: "https://music.youtube.com/channel/UCVQJkXpFLHlRAoRAYS7jCUg" },
  "krishna-das": { spotify: "https://open.spotify.com/artist/45W8VWGNBBNPQJSYXG1AY5", ytMusic: "https://music.youtube.com/channel/UCB18R6I8zYFQs6IUi-MNy8g" },
  "chitra-vichitra": { spotify: "https://open.spotify.com/search/Chitra%20Vichitra", ytMusic: "https://music.youtube.com/search?q=Chitra+Vichitra" },
  "More": { spotify: "https://open.spotify.com/search/Radha%20Krishna%20Bhajan", ytMusic: "https://music.youtube.com/search?q=Radha+Krishna+Bhajan" },
};
