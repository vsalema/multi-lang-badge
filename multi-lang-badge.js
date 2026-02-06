/* multi-lang-badge.js
   - Badge 🇫🇷 si audio = fr uniquement
   - Badge 🇫🇷🇬🇧 MULTI si audio ou subs ont >= 2 langues
   - Appliqué à #channelList + vitrine (.showcase-card)
   - Zéro réseau, très léger
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
        box-shadow:0 0 10px rgba(0,229,255,.14);
        backdrop-filter:blur(6px);
        -webkit-backdrop-filter:blur(6px);
      }
      .${BADGE_CLASS} .em{font-size:13px;line-height:1}

      /* Vitrine: badge en haut-gauche */
      .showcase-card .poster{position:relative}
      .showcase-card .poster > .${BADGE_CLASS}{
        position:absolute; left:8px; top:8px; z-index:999;
      }
    `;
    document.head.appendChild(st);
  }

  function splitLangs(str){
    if(!str) return [];
    return String(str)
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
  }

  function isMulti(str){
    return splitLangs(str).length >= 2;
  }

  function isFrenchOnly(audioStr){
    const langs = splitLangs(audioStr);
    return langs.length === 1 && langs[0] === 'fr';
  }

  function badgeHtml(kind){
    // kind: "FR" | "MULTI"
    if(kind === 'FR'){
      return `<span class="em">🇫🇷</span>`;
    }
    return `<span class="em">🇫🇷🇬🇧</span><span>MULTI</span>`;
  }

  function ensureBadge(container, kind){
    if(!container) return;
    const existing = container.querySelector(`:scope > .${BADGE_CLASS}`);
    if(existing && existing.getAttribute('data-kind') === kind) return;
    if(existing) existing.remove();

    const el = document.createElement('span');
    el.className = BADGE_CLASS;
    el.setAttribute('data-kind', kind);
    el.innerHTML = badgeHtml(kind);
    container.appendChild(el);
  }

  function applyToChannelItem(item){
    const audio = item.dataset.audio || '';
    const subs  = item.dataset.subs  || '';

    const row = item.querySelector('.channel-title-row');
    if(!row) return;

    // priorité: FR only
    if(isFrenchOnly(audio)){
      ensureBadge(row, 'FR');
      return;
    }

    // sinon MULTI si audio ou subs multi
    if(isMulti(audio) || isMulti(subs)){
      ensureBadge(row, 'MULTI');
      return;
    }

    // sinon: rien
    const existing = row.querySelector(`:scope > .${BADGE_CLASS}`);
    if(existing) existing.remove();
  }

  function applyToShowcase(card){
    const audio = card.dataset.audio || '';
    const subs  = card.dataset.subs  || '';

    const poster = card.querySelector('.poster');
    if(!poster) return;

    if(isFrenchOnly(audio)){
      ensureBadge(poster, 'FR');
      return;
    }

    if(isMulti(audio) || isMulti(subs)){
      ensureBadge(poster, 'MULTI');
      return;
    }

    const existing = poster.querySelector(`:scope > .${BADGE_CLASS}`);
    if(existing) existing.remove();
  }

  function scan(){
    document.querySelectorAll('#channelList .channel-item').forEach(applyToChannelItem);
    document.querySelectorAll('.showcase-card').forEach(applyToShowcase);
  }

  function boot(){
    ensureStyle();
    scan();

    // Observer léger: il suffit pour ré-appliquer si liste/vitrine re-render
    const mo = new MutationObserver(() => requestAnimationFrame(scan));
    mo.observe(document.body, { childList:true, subtree:true });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot, { once:true })
    : boot();
})();
