/* multi-lang-badge.js
   Affiche 🇫🇷🇬🇧 MULTI si data-audio ou data-subs contient plusieurs langues
   Ultra léger: aucun réseau, aucun scan global
*/
(() => {
  'use strict';

  const BADGE_CLASS = 'multi-lang-badge';

  function ensureStyle() {
    if (document.getElementById('multi-lang-style')) return;
    const st = document.createElement('style');
    st.id = 'multi-lang-style';
    st.textContent = `
      .${BADGE_CLASS}{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:2px 7px;
        border-radius:999px;
        border:1px solid rgba(0,229,255,.45);
        background:rgba(0,0,0,.65);
        color:#e0f7ff;
        font-size:10px;
        white-space:nowrap;
        user-select:none;
        pointer-events:none;
      }
      .${BADGE_CLASS} .em{font-size:13px}
      .showcase-card .poster{position:relative}
      .showcase-card .poster > .${BADGE_CLASS}{
        position:absolute;left:8px;top:40px;z-index:999
      }
    `;
    document.head.appendChild(st);
  }

  function isMulti(str){
    if(!str) return false;
    return str.split(',').map(s=>s.trim()).filter(Boolean).length >= 2;
  }

  function buildBadge(){
    const el = document.createElement('span');
    el.className = BADGE_CLASS;
    el.innerHTML = `<span class="em">🇫🇷🇬🇧</span><span>MULTI</span>`;
    return el;
  }

  function applyToChannelItem(item){
    const audio = item.dataset.audio || '';
    const subs  = item.dataset.subs  || '';
    if(!isMulti(audio) && !isMulti(subs)) return;

    const row = item.querySelector('.channel-title-row');
    if(!row || row.querySelector(`.${BADGE_CLASS}`)) return;

    row.appendChild(buildBadge());
  }

  function applyToShowcase(card){
    const audio = card.dataset.audio || '';
    const subs  = card.dataset.subs  || '';
    if(!isMulti(audio) && !isMulti(subs)) return;

    const poster = card.querySelector('.poster');
    if(!poster || poster.querySelector(`.${BADGE_CLASS}`)) return;

    poster.appendChild(buildBadge());
  }

  function scan(){
    document.querySelectorAll('#channelList .channel-item')
      .forEach(applyToChannelItem);

    document.querySelectorAll('.showcase-card')
      .forEach(applyToShowcase);
  }

  function boot(){
    ensureStyle();
    scan();

    // observe léger seulement les ajouts
    const mo = new MutationObserver(scan);
    mo.observe(document.body, {childList:true, subtree:true});
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();

