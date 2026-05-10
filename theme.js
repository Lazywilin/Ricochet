// ── RICOCHET SHARED THEME + SETTINGS ─────────────────────────
(function(){
  const DEFAULTS = { acid:'#b4ff39', acid2:'#7fff00', scanlines:true, sidebarOpen:true };

  function getSettings(){
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('ricochet_settings')||'{}')); }
    catch(e){ return DEFAULTS; }
  }

  function saveSettings(s){
    try { localStorage.setItem('ricochet_settings', JSON.stringify(s)); } catch(e){}
  }

  function applyTheme(acid, acid2){
    document.documentElement.style.setProperty('--acid', acid);
    document.documentElement.style.setProperty('--acid2', acid2);
    // Update active dot
    document.querySelectorAll('.theme-dot').forEach(d=>{
      const da = d.getAttribute('data-acid');
      d.style.border = da===acid ? '2px solid white' : '2px solid transparent';
    });
  }

  // Apply saved theme immediately on load (before paint)
  const s = getSettings();
  applyTheme(s.acid, s.acid2);
  if(!s.scanlines) document.documentElement.style.setProperty('--scanlines','none');

  // Global setTheme function available to all pages
  window.setTheme = function(acid, acid2){
    const s = getSettings();
    s.acid = acid; s.acid2 = acid2;
    saveSettings(s);
    applyTheme(acid, acid2);
    showToast('[ THEME SAVED ]');
  };

  // Global showToast
  window.showToast = function(msg){
    let t = document.getElementById('_toast');
    if(!t){
      t = document.createElement('div');
      t.id = '_toast';
      t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f0f18;border:1px solid #252540;padding:12px 20px;font-family:"Space Mono",monospace;font-size:11px;letter-spacing:1px;z-index:99999;transform:translateY(100px);opacity:0;transition:all .3s;color:#e8e8f0;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.transform = 'translateY(0)';
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(()=>{ t.style.transform='translateY(100px)'; t.style.opacity='0'; }, 2500);
  };

  // Re-apply theme after DOM ready (catches CSS var elements)
  document.addEventListener('DOMContentLoaded', ()=>{
    const s = getSettings();
    applyTheme(s.acid, s.acid2);

    // Mark correct theme dot as active
    document.querySelectorAll('.theme-dot').forEach(d=>{
      const da = d.getAttribute('data-acid');
      d.style.border = da===s.acid ? '2px solid white' : '2px solid transparent';
    });

    // Scanlines toggle
    if(!s.scanlines){
      const style = document.getElementById('_scanlines_style') || document.createElement('style');
      style.id = '_scanlines_style';
      style.textContent = 'body::before{display:none!important}';
      document.head.appendChild(style);
    }
  });

  // Global getSettings / saveSettings
  window.ricochетGetSettings = getSettings;
  window.ricochetSaveSettings = saveSettings;
})();
