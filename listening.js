const app=document.getElementById('app'),nav=document.getElementById('levels'),LEVELS=['b1','b2','c1'];let LV='b1',N=0,IDX;
const h=(t,a={},...c)=>{const e=document.createElement(t);for(const k in a)if(a[k]!=null)e.setAttribute(k,a[k]);c.flat().forEach(x=>x!=null&&x!==false&&e.append(x));return e};
const get=async u=>{const r=await fetch(u);if(!r.ok)throw Error('Cannot find '+u);try{return await r.json()}catch{throw Error('Invalid JSON in '+u+' (check commas and quotation marks)')}};
const store={get:k=>{try{return JSON.parse(localStorage.getItem('be.listen.'+k))}catch{return null}},set:(k,v)=>{try{localStorage.setItem('be.listen.'+k,JSON.stringify(v))}catch{}}};
const path=n=>`data/listening/${LV}/lesson-${String(n).padStart(2,'0')}.json`;
const fm=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';

function player(src){
 const vid=/\.(mp4|webm|ogv)$/i.test(src),m=document.createElement(vid?'video':'audio');m.preload='metadata';m.src=src;m.setAttribute('playsinline','');
 const play=h('button',{},'Play'),rep=h('button',{class:'alt'},'Replay'),bar=h('input',{type:'range',min:0,max:100,value:0,'aria-label':'Progress'}),
  t=h('span',{},'0:00 / 0:00'),sp=h('select',{'aria-label':'Playback speed'},[.75,1].map(x=>h('option',{value:x},x+'×'))),note=h('p',{class:'note',hidden:''});
 sp.value='1';
 const up=()=>{bar.value=m.duration?m.currentTime/m.duration*100:0;t.textContent=fm(m.currentTime)+' / '+fm(m.duration)};
 play.onclick=()=>m.paused?m.play():m.pause();m.onplay=()=>play.textContent='Pause';m.onpause=m.onended=()=>play.textContent='Play';
 rep.onclick=()=>{m.currentTime=0;m.play()};bar.oninput=()=>{if(m.duration)m.currentTime=bar.value/100*m.duration};
 sp.onchange=()=>m.playbackRate=+sp.value;m.ontimeupdate=m.onloadedmetadata=up;
 m.onerror=()=>{note.hidden=false;note.textContent='No media file yet. To activate this player, add your file at: '+src;[play,rep,bar,sp].forEach(x=>x.disabled=true)};
 return h('div',{class:'player'},vid?m:null,h('div',{class:'ctl'},play,rep,bar,t,sp),note)}

function quiz(a){
 const box=h('div',{class:'quiz'});
 a.questions.forEach((q,i)=>box.append(h('fieldset',{},h('legend',{},`${i+1}. ${q.prompt}`),q.options.map((o,j)=>h('label',{},h('input',{type:'radio',name:'q'+i,value:j}),' '+o)),h('p',{class:'fb',hidden:''}))));
 const res=h('p',{class:'score',role:'status'}),chk=h('button',{},'Check answers'),re=h('button',{class:'alt'},'Try again'),
  tr=h('section',{class:'tr',hidden:''},h('h3',{},'Transcript'),h('p',{},a.transcript||'Transcript to be added.'));
 chk.onclick=()=>{let s=0;box.querySelectorAll('fieldset').forEach((f,i)=>{const q=a.questions[i],c=f.querySelector('input:checked'),ok=c&&+c.value===q.answer,fb=f.querySelector('.fb');s+=ok?1:0;fb.hidden=false;fb.className='fb '+(ok?'ok':'no');fb.textContent=(ok?'Correct. ':'Not quite. The answer is: '+q.options[q.answer]+'. ')+(q.explanation||'')});
  res.textContent=`Score: ${s} / ${a.questions.length}`;tr.hidden=false;const p=store.get(LV+N);if(!p||s>p.s)store.set(LV+N,{s,t:a.questions.length})};
 re.onclick=()=>{box.querySelectorAll('input').forEach(i=>i.checked=false);box.querySelectorAll('.fb').forEach(f=>f.hidden=true);res.textContent='';tr.hidden=true};
 return h('div',{},box,chk,' ',re,res,tr)}

async function list(){
 if(!IDX)throw Error('Cannot find or read data/listening/index.json');
 const res=await Promise.allSettled(IDX.lessons.map(l=>get(path(l.n))));
 return h('div',{},h('h2',{},LV.toUpperCase()+' listening'),h('div',{class:'grid'},res.map((r,i)=>{
  if(r.status!='fulfilled')return h('div',{class:'card'},h('span',{class:'num'},'Lesson '+IDX.lessons[i].n),h('p',{class:'note'},r.reason.message));
  const a=r.value,sc=store.get(LV+a.lesson),ready=a.questions&&a.questions.length;
  return h('a',{class:'card',href:`#${LV}/${a.lesson}`},h('span',{class:'num'},'Lesson '+a.lesson),h('h3',{},a.lessonTitle),h('p',{},a.topic),h('p',{class:'meta'},a.targetDuration),
   h('span',{class:'badge'},ready?(sc?`Best score ${sc.s}/${sc.t}`:'Ready'):'Placeholder'))})))}

async function activity(){
 const a=await get(path(N)),ready=a.questions&&a.questions.length;
 (a.questions||[]).forEach((q,i)=>{if(!Array.isArray(q.options)||q.options[q.answer]==null)throw Error(path(N)+', question '+(i+1)+': "answer" must be the position of an option, counting from 0')});
 return h('div',{},h('a',{href:'#'+LV},'Back to all '+LV.toUpperCase()+' lessons'),h('h2',{},`Lesson ${a.lesson}: ${a.lessonTitle}`),
  h('p',{class:'meta'},`${LV.toUpperCase()} · Target duration: ${a.targetDuration}`),
  h('div',{class:'box'},h('h3',{},'Topic'),h('p',{},a.topic),h('h3',{},'Listening objective'),h('p',{},a.objective),a.context?h('h3',{},'Context'):null,a.context?h('p',{},a.context):null),
  a.media?player(a.media):null,
  ready?quiz(a):h('div',{class:'box'},h('h3',{},'Questions: to be added'),h('p',{},`Planned: ${a.questionCount} questions.`),h('ul',{},(a.questionTypes||[]).map(x=>h('li',{},x))),h('p',{class:'note'},'The answer key and transcript will appear here once the recording and its questions have been supplied.')))}

async function render(){
 const p=location.hash.slice(1).split('/');LV=LEVELS.includes(p[0])?p[0]:'b1';N=+p[1]||0;
 nav.replaceChildren(...LEVELS.map(l=>h('a',{href:'#'+l,class:l==LV?'on':''},l.toUpperCase())));
 try{app.replaceChildren(N?await activity():await list())}catch(e){app.replaceChildren(h('p',{class:'note'},e.message+'.'+(location.protocol=='file:'?' You opened the file directly: start the local server with serve.py (see README.md).':'')))}}
(async()=>{try{IDX=await get('data/listening/index.json')}catch{}render();addEventListener('hashchange',render)})();
