/*
  AUTUMN ADVENTURE — branching adventure prototype
  The monthly adventure is data-driven: edit EDITION.nodes and EDITION.outcomes.
  The hidden shadow encounter is rolled once per run (10% by default).
  Add ?shadow=1 to the URL to force the rare encounter for testing only.
*/
const EDITION = {
  title: 'The Autumn Castle',
  shadowRouteChance: 0.10,
  nodes: {
    start: {
      location: 'THE FOREST FORK', title: 'Three paths beneath the leaves',
      description: 'The autumn forest parts before you. One trail is dim and overgrown, another glows in the afternoon light. Behind you, the road home is already fading.',
      answers: [
        { label: 'Take the shaded path', next: 'shaded_path' },
        { label: 'Follow the bright path', next: 'bright_path' },
        { label: 'Turn around and leave', ending: 'perished' }
      ]
    },
    shaded_path: {
      location: 'THE SHADED PATH', title: 'A figure among the trees',
      description: 'The light thins beneath the branches. Ahead, a gnoll stands in the path. You could approach, ignore him, or hurry toward the brighter trail.',
      answers: [
        { label: 'Approach the tree gnoll', next: 'tree_gnoll' },
        { label: 'Ignore him and keep walking', ending: 'perished' },
        { label: 'Dart away toward the bright path', next: 'bright_path' }
      ]
    },
    tree_gnoll: {
      location: 'THE GNOLL’S CLEARING', title: 'The gnoll blocks your way',
      description: 'The gnoll watches you carefully. He offers a riddle, but there may be another way past him. (Some encounters are rarer than others.)',
      answers: [
        { label: 'Answer his riddle', next: 'riddle_success' },
        { label: 'Give the wrong answer', ending: 'perished' }
      ],
      shadowAnswer: { label: 'Fight the gnoll', next: 'puppy_cave', shadowOnly: true }
    },
    riddle_success: {
      location: 'BEYOND THE CLEARING', title: 'The gnoll lets you pass',
      description: 'Your answer satisfies the gnoll. He steps aside, revealing three possible destinations. But the cave is not what it seems...',
      answers: [
        { label: 'Head toward the castle', next: 'castle' },
        { label: 'Follow the sound of water', next: 'river' },
        { label: 'Enter the cave', next: 'empty_cave' }
      ]
    },
    empty_cave: {
      location: 'THE EMPTY CAVE', title: 'Something stirs in the dark',
      description: 'The cave is empty. Before you can turn back, another gnoll emerges from the shadows and crushes you beneath its weight.',
      answers: [], ending: 'perished'
    },
    puppy_cave: {
      location: 'THE HIDDEN CAVE', title: 'A tiny chorus of whimpers',
      description: 'You overcome the gnoll and discover a hidden den. A litter of puppies huddles together in the warm straw. What will you do?',
      answers: [
        { label: 'Rescue the puppies and take them with you', ending: 'legendary' },
        { label: 'Leave them and continue onward', next: 'after_puppies' },
        { label: 'Kill the puppies', ending: 'perished' }
      ]
    },
    after_puppies: {
      location: 'OUTSIDE THE CAVE', title: 'The path continues',
      description: 'You leave the puppies undisturbed and step back into the autumn air. The castle rises to one side, while the river winds through the trees on the other.',
      answers: [
        { label: 'Continue toward the castle', next: 'castle' },
        { label: 'Make your way to the river', next: 'river' }
      ]
    },
    bright_path: {
      location: 'THE BRIGHT PATH', title: 'Sunlight through the canopy',
      description: 'The trees thin and golden light spills across the trail. You hear a river nearby and spot a strange plant growing beside the path.',
      answers: [
        { label: 'Dip your toes in the river', next: 'river' },
        { label: 'Drink from the strange plant', ending: 'perished' },
        { label: 'Bathe and follow the path onward', next: 'bathing' }
      ]
    },
    bathing: {
      location: 'THE CLEARING', title: 'A place to catch your breath',
      description: 'Refreshed, you reach a clearing where the castle road branches away from a dark stretch of forest.',
      answers: [
        { label: 'Head toward the castle', next: 'castle' },
        { label: 'Wander back into the forest', ending: 'perished' }
      ]
    },
    river: {
      location: 'THE RIVERBANK', title: 'The river’s offerings',
      description: 'Clear water runs over smooth stones. A glimmer catches your eye beneath the surface. Nearby, a fish struggles and a turtle has become caught on a hook.',
      answers: [
        { label: 'Reach for the shiny golden pebble', ending: 'basic' },
        { label: 'Kick away the fish', ending: 'perished' },
        { label: 'Help the hooked turtle', ending: 'medium' }
      ]
    },
    castle: {
      location: 'THE CASTLE', title: 'The castle doors stand open',
      description: 'You arrive at the castle. From within, you hear footsteps, clattering dishes, and the restless sounds of horses in the stables. Where will you go?',
      answers: [
        { label: 'Sneak into the throne room', ending: 'perished' },
        { label: 'Scout the stables', ending: 'rare' },
        { label: 'Raid the kitchen', ending: 'good' }
      ]
    }
  },
  outcomes: {
    perished: { tier: 'BAD', title: 'You have perished', item: 'No item collected', icon: '☠', description: 'The forest has claimed another adventurer. Share the newsletter with a friend and return for another attempt after the cooldown.' },
    basic: { tier: 'BASIC', title: 'Simple but sufficient', item: 'Golden Pebble', icon: '◆', description: 'A little treasure, found by keeping your eyes open. Simple, but sufficient.' },
    medium: { tier: 'MEDIUM', title: 'Well-deserved', item: 'Seashell', icon: '🐚', description: 'A kind choice brought you a well-earned keepsake from the river.' },
    good: { tier: 'GOOD', title: 'Interesting!', item: 'Cookies', icon: '✦', description: 'A sweet reward for a bold little castle raid.' },
    rare: { tier: 'RARE', title: 'Unique!', item: 'Horse', icon: '♞', description: 'You found the stables and earned a remarkable companion.' },
    legendary: { tier: 'LEGENDARY', title: 'Holy smokes', item: 'Puppies', icon: '♥', description: 'The secret shadow route led you to a litter of puppies. You rescued them and uncovered the legendary reward!' }
  }
};

const state = { nodeId: 'start', decisions: 0, user: null, outcome: null, startedAt: 0, completedAt: 0, shadowRouteAvailable: false, history: [] };
const $ = (id) => document.getElementById(id);
const screens = ['home','question','account','result','collection'];
function showScreen(name){ screens.forEach(s => $('screen-'+s).classList.toggle('active',s===name)); }
function transition(callback){
  const layer=$('transition');
  layer.classList.add('show');
  // Hold the lantern wipe for about one second longer than the first prototype.
  setTimeout(()=>{ callback(); setTimeout(()=>layer.classList.remove('show'),420); },1520);
}
function startGame(){
  state.nodeId='start'; state.decisions=0; state.startedAt=Date.now(); state.completedAt=0; state.outcome=null; state.history=[];
  state.shadowRouteAvailable = new URLSearchParams(location.search).get('shadow') === '1' || Math.random() < EDITION.shadowRouteChance;
  showNode();
}
function showNode(){
  const node=EDITION.nodes[state.nodeId];
  if(!node){finish('perished');return;}
  $('question-kicker').textContent=`DECISION ${String(state.decisions+1).padStart(2,'0')}`;
  $('question-title').textContent=node.title; $('question-description').textContent=node.description;
  $('scene-location').textContent=node.location;
  $('progress-label').textContent=`${state.decisions} DECISIONS`;
  $('progress-fill').style.width=`${Math.min(100, state.decisions*12)}%`;
  $('traveler').style.left=`${Math.min(82, 5+state.decisions*9)}%`;
  const answers=$('answers'); answers.innerHTML='';
  const choices=[...node.answers];
  if(node.shadowAnswer && state.shadowRouteAvailable) choices.push(node.shadowAnswer);
  choices.forEach((answer,i)=>{
    const button=document.createElement('button'); button.className='answer-button';
    button.textContent=`${String.fromCharCode(65+i)}. ${answer.label}`;
    button.addEventListener('click',()=>chooseAnswer(answer)); answers.appendChild(button);
  });
  if(node.ending){finish(node.ending);return;}
  showScreen('question');
  spawnRouteAmbience();
}
function spawnRouteAmbience(){
  const layer=$('ambient-layer');
  if(!layer) return;
  // A leaf drifts through most scenes; a squirrel is a less frequent surprise.
  const leafDelay=450+Math.random()*900;
  setTimeout(()=>{
    if(!$('screen-question').classList.contains('active')) return;
    const leaf=document.createElement('span');
    leaf.className='ambient-leaf';
    leaf.textContent=Math.random()>.5?'◆':'✦';
    leaf.style.left=(8+Math.random()*76)+'%';
    leaf.style.animationDuration=(4+Math.random()*2)+'s';
    layer.appendChild(leaf);
    setTimeout(()=>leaf.remove(),6500);
  },leafDelay);
  if(Math.random()<0.38){
    setTimeout(()=>{
      if(!$('screen-question').classList.contains('active')) return;
      const squirrel=document.createElement('span');
      squirrel.className='ambient-squirrel';
      squirrel.textContent='🐿️';
      layer.appendChild(squirrel);
      setTimeout(()=>squirrel.remove(),4700);
    },1800+Math.random()*2400);
  }
}
function chooseAnswer(answer){
  state.history.push({node:state.nodeId,choice:answer.label}); state.decisions++;
  if(answer.ending){finish(answer.ending);return;}
  if(!answer.next || !EDITION.nodes[answer.next]){finish('perished');return;}
  transition(()=>{state.nodeId=answer.next;showNode();});
}
function finish(outcome){
  state.outcome=outcome; state.completedAt=Date.now();
  // Show the result for five seconds before asking the player to save it.
  showResult({preview:true});
  window.clearTimeout(state.accountPromptTimer);
  state.accountPromptTimer=window.setTimeout(showAccount,5000);
}
function showAccount(){transition(()=>showScreen('account'));}
$('account-form').addEventListener('submit',e=>{
  e.preventDefault();
  const username=$('username').value.trim();const email=$('email').value.trim();
  if(!username||!email)return;
  state.user={username,email,newsletterOptIn:$('newsletter-optin').checked};
  // Password is intentionally not retained in this front-end prototype.
  $('password').value=''; window.clearTimeout(state.accountPromptTimer); showResult({preview:false});
});
function showResult({preview=false}={}){
  const outcome=EDITION.outcomes[state.outcome]||EDITION.outcomes.basic;
  const rewardIcon=$('result-icon');
  rewardIcon.textContent=outcome.icon;
  rewardIcon.classList.remove('reveal');
  void rewardIcon.offsetWidth;
  rewardIcon.classList.add('reveal');
  $('result-tier').textContent=outcome.tier;$('result-title').textContent=outcome.title;
  $('result-description').textContent=outcome.description;$('result-score').textContent=`DECISIONS: ${state.decisions}`;$('result-item').textContent=`ITEM: ${outcome.item}`;
  $('retry-note').hidden=state.outcome!=='perished';
  if(state.outcome==='perished') $('retry-note').textContent='Prototype only: the five-minute retry cooldown and newsletter-share verification will be enforced by the server in the production version.';
  $('share-feedback').textContent='';
  $('result-preview-note').hidden=!preview;
  $('result-actions').hidden=preview;
  $('result-meta').hidden=preview;
  showScreen('result');
}
$('start-btn').addEventListener('click',()=>transition(startGame));
$('share-btn').addEventListener('click',async()=>{
  const outcome=EDITION.outcomes[state.outcome];const shareText=`I explored ${EDITION.title} and earned: ${outcome.title} (${outcome.tier})!`;
  try{await navigator.clipboard.writeText(`${shareText} ${location.href}`);$('share-feedback').textContent='Result link copied!';}
  catch{$('share-feedback').textContent=shareText+' — Copy this page link to share.';}
});
$('collection-btn').addEventListener('click',()=>{ $('collection-heading').textContent=`${state.user?.username||'Adventurer'}’s collection`;renderTab('share');showScreen('collection');});
$('back-result').addEventListener('click',()=>showScreen('result'));
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));renderTab(tab.dataset.tab);}));
function renderTab(which){const out=EDITION.outcomes[state.outcome];const target=$('tab-content');
 if(which==='share')target.innerHTML=`<strong>${escapeHtml(state.user?.username||'Adventurer')}</strong>, your result is <strong>${escapeHtml(out.title)}</strong>.<br><br>Reward: ${escapeHtml(out.item)}<br><br>In the finished game, this panel will create a shareable result card with your item artwork.`;
 if(which==='prizes')target.innerHTML=`<strong>November — The Autumn Castle</strong><div class="leader-row"><span>${escapeHtml(out.item)}</span><strong>${escapeHtml(out.tier)}</strong></div><p>Your future newsletter rewards will appear here after you collect them.</p>`;
 if(which==='leaderboard')target.innerHTML=`<strong>November adventurers</strong><div class="leader-row"><span>1. ${escapeHtml(state.user?.username||'You')}</span><strong>${state.decisions} decisions</strong></div><p>This prototype shows your local result only. A shared leaderboard requires the database connection in a later phase.</p>`;
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
