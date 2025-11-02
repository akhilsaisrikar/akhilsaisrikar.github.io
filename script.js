/* Zero Protocol — Polished Player + Mini mode (fixed scroll behavior)
   - Auto-minimizes when main player leaves viewport
   - Persistent mini stays until reload
   - Full WebAudio visualizer + CSS fallback
*/

document.addEventListener('DOMContentLoaded', () => {
  const log = (...a)=>{try{console.log('[ZP]',...a);}catch(e){}};

  const loader=document.getElementById('loader');
  setTimeout(()=>{ if(loader) loader.remove(); },1200);

  /* === DOM refs === */
  const sideMenu = document.getElementById('sideMenu'); // FEATURE 9
  const smToggle = document.getElementById('smToggle'); // FEATURE 9
  const guestSlider=document.getElementById('guestSlider');
  const episodeRow=document.getElementById('episodeRow');
  const guestPrev=document.getElementById('guestPrev'); // FEATURE 11
  const guestNext=document.getElementById('guestNext'); // FEATURE 11
  const mainAudio=document.getElementById('mainAudio');
  const mainAudioSource=document.getElementById('mainAudioSource');
  const fullPlayer=document.getElementById('fullPlayer');
  const playerGuestImg=document.getElementById('playerGuestImg');
  const playerGuestName=document.getElementById('playerGuestName');
  const playerEpisodeName=document.getElementById('playerEpisodeName');
  // const nextInfo=document.getElementById('nextInfo'); // REMOVED per user request
  const waveformDiv=document.getElementById('waveform');
  const seek=document.getElementById('seek');
  const curTime=document.getElementById('curTime');
  const durTime=document.getElementById('durTime');
  const playPauseBtn=document.getElementById('playPauseBtn');
  const prevBtn=document.getElementById('prevBtn');
  const nextBtn=document.getElementById('nextBtn');
  const muteBtn=document.getElementById('muteBtn');
  const volume=document.getElementById('volume');
  const miniPlayer=document.getElementById('miniPlayer');
  const miniGuestImg=document.getElementById('miniGuestImg');
  const miniEpisodeTitle=document.getElementById('miniEpisodeTitle');
  const miniGuest=document.getElementById('miniGuest');
  const miniPlay=document.getElementById('miniPlay');
  const miniPrev=document.getElementById('miniPrev');
  const miniNext=document.getElementById('miniNext');
  const miniSeek=document.getElementById('miniSeek');
  const miniMute=document.getElementById('miniMute');
  const yearSpan = document.getElementById('year'); // FEATURE 15
  // const transcriptToggle = document.getElementById('transcriptToggle'); // REMOVED per user request
  // const transcriptContent = document.getElementById('transcriptContent'); // REMOVED per user request
  const episodeSearch = document.getElementById('episodeSearch'); // FEATURE 7
  // --- NEW VOICE MESSAGE REFS (Add this section) ---
  const voiceMessageForm = document.getElementById('voiceMessageForm');
  const recordBtn = document.getElementById('recordBtn');
  const recordTimer = document.getElementById('recordTimer');
  const submitVoiceBtn = document.querySelector('.submit-voice-btn'); 
  const recordControl = document.getElementById('recordControl'); // Left container
  const submitControl = document.getElementById('submitControl'); // Right container
// ------------------------------
 
  if(!mainAudio) return;

  /* === FEATURE 15: Auto-Update Footer Year === */
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* === data === */
  const episodes = Array.from({length:15},(_,i)=>{
    const id=i+1;
    return{
      id,
      title:`Episode ${String(id).padStart(2,'0')} — Topic ${id}`,
      guest:`Guest ${id}`,
      guestTitle:(id%3===0)?'Writer':(id%3===1)?'Actor':'Singer',
      img:'images/demopic.jpg',
      audio:`audio/episode${id}.mp3`,
      // nextInfo:`Next ep ${Math.min(id+1,15)} • Fri`, // REMOVED per user request
      transcript: `This is the detailed show transcript for Episode ${id}, discussing ${id % 3 === 0 ? 'creative writing and the future of storytelling' : id % 3 === 1 ? 'modern filmmaking techniques and independent cinema' : 'ancient philosophy and its relevance in the digital age'}.`
    };
  });

  /* === state === */
  let current=episodes[0];
  let isPlaying=false;
  let isMini=false;
  let userVolume=1;

  /* FEATURE 1: Load State from Local Storage */
  function loadPlayerState() {
    const savedId = localStorage.getItem('zp_current_ep_id');
    const savedTime = parseFloat(localStorage.getItem('zp_current_time')) || 0;
    const savedVolume = parseFloat(localStorage.getItem('zp_user_volume'));

    if (savedId) {
      const ep = episodes.find(x => x.id === parseInt(savedId));
      if (ep) {
        current = ep;
      }
    }

    if (!isNaN(savedVolume)) {
      userVolume = savedVolume;
      mainAudio.volume = userVolume;
      volume.value = userVolume;
    }
    
    // Load episode before seeking
    loadEpisode(current, false);

    if (savedTime > 1 && savedTime < mainAudio.duration) {
      mainAudio.currentTime = savedTime;
    }
  }

  function savePlayerState() {
    localStorage.setItem('zp_current_ep_id', current.id);
    localStorage.setItem('zp_current_time', mainAudio.currentTime);
    localStorage.setItem('zp_user_volume', mainAudio.volume);
  }

  const fmtTime=s=>{
    const m=Math.floor(s/60),ss=Math.floor(s%60);
    return `${m}:${String(ss).padStart(2,'0')}`;
  };

  /* === populate === */
  function populateGuests(list=episodes){
    guestSlider.innerHTML='';
    list.forEach(ep=>{
      const c=document.createElement('div');
      c.className='guest-card';
      c.innerHTML=`
        <img src="${ep.img}" alt="${ep.guest}">
        <div class="g-title">${ep.guest}</div>
        <div class="g-desc">${ep.guestTitle}</div>
        <button class="g-play" data-id="${ep.id}">Play</button>`;
      guestSlider.appendChild(c);
    });
  }
  function populateEpisodes(list=episodes){
    episodeRow.innerHTML='';
    list.forEach(ep=>{
      const el=document.createElement('div');
      el.className='ep-card';
      el.innerHTML=`
        <img src="${ep.img}" alt="${ep.title}">
        <div class="ep-meta">
          <div class="ep-title">${ep.title}</div>
          <div class="ep-sub">${ep.guest} • ${ep.guestTitle}</div>
        </div>
        <button class="g-play btn sm" data-id="${ep.id}">Play</button>`;
      episodeRow.appendChild(el);
    });
  }

  /* === load/play === */
  function loadEpisode(ep,auto=true){
    current=ep;
    if(mainAudioSource){ mainAudioSource.src=ep.audio; mainAudio.load(); }
    else mainAudio.src=ep.audio;
    playerGuestImg.src=ep.img;
    playerEpisodeName.textContent=ep.title;
    playerGuestName.textContent=`${ep.guest} • ${ep.guestTitle}`;
    // nextInfo.textContent=ep.nextInfo; // REMOVED per user request
    miniGuestImg.src=ep.img;
    miniEpisodeTitle.textContent=ep.title;
    miniGuest.textContent=ep.guest;
    // transcriptContent.querySelector('p').textContent = ep.transcript; // REMOVED per user request
    if(auto) mainAudio.play().catch(()=>{});
    savePlayerState(); // FEATURE 1
  }

  /* === controls === */
  function togglePlay(){ mainAudio.paused?mainAudio.play():mainAudio.pause(); }
  function step(dir){
    const idx=episodes.indexOf(current);
    const next=episodes[(idx+dir+episodes.length)%episodes.length];
    loadEpisode(next,true);
  }
  playPauseBtn.onclick=miniPlay.onclick=togglePlay;
  prevBtn.onclick=miniPrev.onclick=()=>step(-1);
  nextBtn.onclick=miniNext.onclick=()=>step(1);

  muteBtn.onclick=miniMute.onclick=()=>{mainAudio.muted=!mainAudio.muted;updateMuteUI();};
  volume.oninput=e=>{userVolume=parseFloat(e.target.value);mainAudio.volume=userVolume;updateMuteUI();savePlayerState();};

  function updateMuteUI(){
    const icon=(mainAudio.muted||mainAudio.volume===0)?'🔈':'🔊';
    muteBtn.textContent=miniMute.textContent=icon;
  }

  seek.oninput=e=>{
    const v=+e.target.value;
    if(mainAudio.duration) mainAudio.currentTime=(v/100)*mainAudio.duration;
  };
  miniSeek.oninput=e=>{
    const v=+e.target.value;
    if(mainAudio.duration) mainAudio.currentTime=(v/100)*mainAudio.duration;
  };

  mainAudio.addEventListener('loadedmetadata', () => {
    durTime.textContent = fmtTime(mainAudio.duration);
  });
  mainAudio.addEventListener('timeupdate',()=>{
    if(mainAudio.duration){
      const pct=(mainAudio.currentTime/mainAudio.duration)*100;
      seek.value=miniSeek.value=pct;
      curTime.textContent=fmtTime(mainAudio.currentTime);
      // FEATURE 1: Save state on timeupdate (less frequently)
      if (Math.floor(mainAudio.currentTime) % 5 === 0) savePlayerState();
    }
  });

  mainAudio.addEventListener('play',()=>{isPlaying=true;playPauseBtn.textContent=miniPlay.textContent='⏸';startVisualizer();});
  mainAudio.addEventListener('pause',()=>{isPlaying=false;playPauseBtn.textContent=miniPlay.textContent='▶';stopVisualizer();});
  mainAudio.addEventListener('ended',()=>step(1)); // Auto-advance

  document.body.addEventListener('click',e=>{
    const btn=e.target.closest('.g-play');
    if(btn){const id=+btn.dataset.id;const ep=episodes.find(x=>x.id===id);if(ep)loadEpisode(ep,true);}
  });

  /* FEATURE 5: Transcript Toggle - REMOVED */
  // transcriptToggle.onclick = () => {
  //   const isHidden = transcriptContent.classList.toggle('hidden');
  //   transcriptToggle.textContent = isHidden ? 'Show Transcript' : 'Hide Transcript';
  // };

  /* FEATURE 7: Episode Search */
  episodeSearch.oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredEpisodes = episodes.filter(ep => 
      ep.title.toLowerCase().includes(query) || 
      ep.guest.toLowerCase().includes(query) ||
      ep.guestTitle.toLowerCase().includes(query)
    );
    populateGuests(filteredEpisodes);
    populateEpisodes(filteredEpisodes);
  };
  

  /* FEATURE 2: Keyboard Shortcuts */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        mainAudio.currentTime = Math.min(mainAudio.currentTime + 5, mainAudio.duration);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        mainAudio.currentTime = Math.max(mainAudio.currentTime - 5, 0);
        break;
    }
  });

  /* FEATURE 9 & 10: Floating Menu Toggle */
  smToggle.onclick = () => {
    sideMenu.classList.toggle('minimized');
  };

  /* FEATURE 11: Guest Slider Navigation */
  function scrollSlider(slider, direction) {
    const scrollAmount = slider.clientWidth * 0.7; // Scroll 70% of viewport width
    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
  guestPrev.onclick = () => scrollSlider(guestSlider, -1);
  guestNext.onclick = () => scrollSlider(guestSlider, 1);


  loadPlayerState();
  populateGuests(); 
  populateEpisodes(); 

  /* === mini-player behaviour === */
  let miniLocked=false;
  function showMini(){
    if(isMini) return;
    isMini=true; miniLocked=true;
    miniPlayer.classList.remove('hidden');
    miniPlayer.style.transition='all .35s ease';
    miniPlayer.style.transform='translate(-50%, 0)'; // Adjusted for modern-mini
    miniPlayer.style.opacity='1';
    fullPlayer.style.transition='transform .35s ease,opacity .35s ease';
    fullPlayer.style.transform='scale(.94)';
    fullPlayer.style.opacity='.14';
    fullPlayer.style.pointerEvents='none';
    log('✅ Mini shown & locked');
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting&&!miniLocked) showMini();
    });
  },{threshold:0.25});
  observer.observe(fullPlayer);

  window.addEventListener('load',()=>{
    const rect=fullPlayer.getBoundingClientRect();
    if(rect.bottom<window.innerHeight*0.5) showMini();
  });

  /* === Visualizer === */
  let audioCtx,analyser,srcNode,raf,canvasFull,ctxFull;
  function createCanvas(){
    if(!waveformDiv) return;
    canvasFull=document.createElement('canvas');
    canvasFull.className='canvas-full';
    waveformDiv.replaceWith(canvasFull);
    ctxFull=canvasFull.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize',resizeCanvas);
  }
  function resizeCanvas(){
    const dpr=window.devicePixelRatio||1;
    canvasFull.width=canvasFull.clientWidth*dpr;
    canvasFull.height=20*dpr;
    ctxFull.setTransform(dpr,0,0,dpr,0,0);
  }
  function ensureCtx(){
    if(audioCtx) return true;
    try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      analyser=audioCtx.createAnalyser();
      analyser.fftSize=512;
      srcNode=audioCtx.createMediaElementSource(mainAudio);
      srcNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      return true;
    }catch(e){log('visualizer fail',e);return false;}
  }
  function draw(){
    if(!analyser) return;
    const arr=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(arr);
    ctxFull.clearRect(0,0,canvasFull.width,20);
    const bars=40,gap=4,w=canvasFull.width/bars;
    for(let i=0;i<bars;i++){
      const v=arr[i*3]/255,h=v*20;
      ctxFull.fillStyle='rgba(255,80,80,.9)';
      ctxFull.fillRect(i*w,h*-.9,w-gap,h);
    }
    raf=requestAnimationFrame(draw);
  }
  function startVisualizer(){
    if(!ensureCtx())return;
    if(audioCtx.state==='suspended')audioCtx.resume();
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(draw);
  }
  function stopVisualizer(){cancelAnimationFrame(raf);}
  createCanvas();

  log('🎧 Ready');
});
// ... (After all existing functions like scrollSlider, draw, startVisualizer, etc.)

/* === FEATURE: Voice Message Recording Placeholder === */

let isRecording = false; // True if the microphone is actively recording
let hasRecording = false; // True if a recording has been stopped and is ready to send
let startTime;
let timerInterval;

// Ensure the initial state is correct when the page loads
if (submitControl) {
    submitControl.style.display = 'none';
}

function updateRecordTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  if(recordTimer) {
      recordTimer.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}

function resetVoiceUI() {
    isRecording = false;
    hasRecording = false;
    clearInterval(timerInterval);
    if(recordTimer) recordTimer.textContent = '0:00';
    
    // ACTION: Show record container (Start Recording), hide submit container (Send Message)
    if(recordBtn) recordBtn.textContent = '🎤 Start Recording';
    if(recordBtn) recordBtn.classList.remove('active');
    if(recordControl) recordControl.style.display = 'block'; 
    if(submitControl) submitControl.style.display = 'none'; 
    if(voiceMessageForm) voiceMessageForm.reset();
}


function startRecording() {
  // Graceful exit if required elements are missing
  if (!recordBtn || !submitVoiceBtn || !recordControl || !submitControl) return;

  if (isRecording) {
    // --- 1. STOPPING RECORDING (User clicks "Stop Recording") ---
    isRecording = false;
    hasRecording = true;
    clearInterval(timerInterval);
    
    // CRITICAL ACTION: Hide the record container, SHOW the submit container
    recordControl.style.display = 'none'; // Hides the "Stop Recording" side
    submitControl.style.display = 'block'; // SHOWS the "Send Voice Message" side
    recordBtn.classList.remove('active');
    
    // NOTE: Full MediaRecorder API implementation for actual audio capture goes here
    
  } else if (hasRecording) {
    // --- 2. USER WANTS TO REREAD (Clicks where the record button was again) ---
    resetVoiceUI();
    return;

  } else {
    // --- 3. STARTING RECORDING (User clicks "Start Recording") ---
    isRecording = true;
    startTime = Date.now();
    recordBtn.textContent = '🛑 Stop Recording';
    recordBtn.classList.add('active');
    recordTimer.textContent = '0:00';
    timerInterval = setInterval(updateRecordTimer, 1000);
    
    // Ensure submit container is hidden at the start
    submitControl.style.display = 'none';
    recordControl.style.display = 'block';
    
    // NOTE: Call navigator.mediaDevices.getUserMedia() here to start audio stream capture
  }
}


/* === Event Listeners for Voice Message === */
if (recordBtn) {
    recordBtn.addEventListener('click', startRecording);
}

if (voiceMessageForm) {
    voiceMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // ** PLACEHOLDER: Your actual fetch/upload logic goes here **
        console.log('Voice Message Submitted! (Placeholder)');
        alert('Voice Message Submitted! (Placeholder)');

        // Reset the UI after submission
        resetVoiceUI();
    });
}
