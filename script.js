(() => {
  'use strict';
  const concerts = Array.isArray(window.XO_CONCERTS) ? window.XO_CONCERTS : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const savedLanguage = localStorage.getItem('xo-language');
  const state = { lang: savedLanguage === 'en' ? 'en' : 'fr', filter: 'all', search: '', country: '', favoritesOnly: false };
  const favoritesKey = 'house-of-xo-favorites';
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem(favoritesKey) || '[]')); } catch { favorites = new Set(); }
  const translations = {
    fr: {
      languageLabel:'LANGUE / LANGUAGE',languageHint:'Cliquez ici pour passer du français à l’anglais. / Click here to switch between French and English.',languageBanner:'Vous préférez l’anglais ? Cliquez sur le bouton <strong>FR / EN</strong> en haut à droite pour changer la langue. <span lang="en">Prefer English? Click <strong>FR / EN</strong> in the top-right corner.</span>',dismissLanguageBanner:'Masquer ce message',navArchive:'Archive',navExplore:'Explorer',navAbout:'À propos',navAria:'Navigation principale',filtersAria:'Filtres de concerts',statsAria:'Statistiques de l’archive',heroArtAria:'Visuel XO Live Archive',eyebrow:'ARCHIVE FAN-MADE · 2026',heroIntro:'Chaque date. Chaque ville. Les souvenirs de la tournée, réunis au même endroit.',heroSub:'Une archive non officielle créée par House of XO, pour les fans de The Weeknd.',exploreArchive:"Explorer l'archive",joinCommunity:'Rejoindre House of XO ↗',fanMade:'INDÉPENDANT · CRÉÉ PAR DES FANS · FR / EN',statConcerts:'CONCERTS RÉPERTORIÉS',statAllDates:"Toutes les dates de l'archive",statCompleted:'CONCERTS PASSÉS',statPastDates:'Dates déjà passées',statUpcoming:'À VENIR',statFutureDates:'Dates à venir',statVideos:'VIDÉOS DISPONIBLES',statVideoFoot:'Liens YouTube répertoriés',archiveKicker:'LE TOUR, EN UN SEUL ENDROIT',archiveTitle:"L'archive <span>2026</span>",archiveNote:'Recherchez une ville, explorez les dates et retrouvez les vidéos disponibles.',searchPlaceholder:'Rechercher une ville, un pays…',filterCountryLabel:'Filtrer par pays',allCountries:'Tous les pays',filterAll:'Tout voir',filterCompleted:'Terminés · vidéo disponible',filterUpcoming:'À venir',filterPending:'Vidéo à venir',filterFavorites:'Favoris',archiveProgress:'Couverture vidéo de l’archive',emptyTitle:'Aucun concert trouvé',emptyText:'Essayez une autre recherche ou changez les filtres.',resetFilters:'Réinitialiser les filtres',destKicker:'PARCOURIR LE MONDE',destTitle:'Les <span>destinations</span>',destNote:'Choisissez un pays pour filtrer instantanément les concerts de cette destination.',countriesLabel:'PAYS RÉPERTORIÉS',latestKicker:'À RETROUVER',latestTitle:'Vidéos <span>disponibles</span>',seeAllVideos:'Voir toute l’archive ↗',aboutKicker:'UN PROJET DE HOUSE OF XO',aboutTitle:'Créé par XO,<br><span>pour XO.</span>',aboutText:"XO Live Archive est un projet fan-made qui rassemble les dates de concert de l'After Hours Til Dawn Tour 2026 et les vidéos YouTube sélectionnées par House of XO. L'archive est indépendante et n'est pas affiliée officiellement à The Weeknd.",joinDiscord:'Rejoindre le Discord ↗',footerText:"Un projet de fans, pour les fans. Non affilié officiellement à The Weeknd.",backTop:'Retour en haut ↑',statusCompleted:'VIDÉO DISPONIBLE',statusUpcoming:'À VENIR',statusPending:'VIDÉO À VENIR',details:'Ouvrir le concert',watch:'Regarder sur YouTube ↗',noVideo:'Aucune vidéo répertoriée pour le moment.',dateLabel:'DATE',venueLabel:'SALLE / LIEU',countryLabel:'PAYS',videoLabel:'VIDÉO',addFavorite:'Ajouter aux favoris',removeFavorite:'Retirer des favoris',share:'Partager le concert',copied:'Lien copié !',shareFallback:'Lien du concert',results:'concert(s)',countryFilter:'Pays sélectionné',resetDone:'Filtres réinitialisés',videoPercent:'des concerts passés ont une vidéo',upcomingDate:'Prochain concert',videoAvailable:'Vidéo disponible',openVideo:'Ouvrir la vidéo ↗',showMore:'Ouvrir la fiche ↗',menuOpen:'Ouvrir le menu',menuClose:'Fermer le menu',notAffiliated:'Archive fan-made non officielle'
    },
    en: {
      languageLabel:'LANGUAGE / LANGUE',languageHint:'Click here to switch between English and French. / Cliquez ici pour passer de l’anglais au français.',languageBanner:'Prefer French? Click the <strong>FR / EN</strong> button in the top-right corner to change the language. <span lang="fr">Vous préférez le français ? Cliquez sur <strong>FR / EN</strong> en haut à droite.</span>',dismissLanguageBanner:'Dismiss this message',navArchive:'Archive',navExplore:'Explore',navAbout:'About',navAria:'Main navigation',filtersAria:'Concert filters',statsAria:'Archive statistics',heroArtAria:'XO Live Archive artwork',eyebrow:'FAN-MADE ARCHIVE · 2026',heroIntro:'Every date. Every city. Tour memories, brought together in one place.',heroSub:'An unofficial archive created by House of XO for The Weeknd fans.',exploreArchive:'Explore archive',joinCommunity:'Join House of XO ↗',fanMade:'INDEPENDENT · FAN-MADE · FR / EN',statConcerts:'CONCERTS LISTED',statAllDates:'All dates in the archive',statCompleted:'PAST CONCERTS',statPastDates:'Dates that have passed',statUpcoming:'UPCOMING',statFutureDates:'Upcoming dates',statVideos:'VIDEOS AVAILABLE',statVideoFoot:'YouTube links listed',archiveKicker:'THE TOUR, ALL IN ONE PLACE',archiveTitle:'The <span>2026</span> archive',archiveNote:'Search a city, explore dates and find available videos.',searchPlaceholder:'Search a city or country…',filterCountryLabel:'Filter by country',allCountries:'All countries',filterAll:'View all',filterCompleted:'Completed · video available',filterUpcoming:'Upcoming',filterPending:'Video pending',filterFavorites:'Favorites',archiveProgress:'Archive video coverage',emptyTitle:'No concerts found',emptyText:'Try another search or change your filters.',resetFilters:'Reset filters',destKicker:'EXPLORE THE WORLD',destTitle:'Tour <span>destinations</span>',destNote:'Choose a country to instantly filter concerts from that destination.',countriesLabel:'COUNTRIES LISTED',latestKicker:'REVISIT',latestTitle:'Available <span>videos</span>',seeAllVideos:'View full archive ↗',aboutKicker:'A HOUSE OF XO PROJECT',aboutTitle:'Créé par XO,<br><span>pour XO.</span>',aboutText:'XO Live Archive is a fan-made project collecting After Hours Til Dawn Tour 2026 concert dates and YouTube videos selected by House of XO. This independent archive is not officially affiliated with The Weeknd.',joinDiscord:'Join the Discord ↗',footerText:'A fan project, for fans. Not officially affiliated with The Weeknd.',backTop:'Back to top ↑',statusCompleted:'VIDEO AVAILABLE',statusUpcoming:'UPCOMING',statusPending:'VIDEO PENDING',details:'Open concert',watch:'Watch on YouTube ↗',noVideo:'No video listed yet.',dateLabel:'DATE',venueLabel:'VENUE',countryLabel:'COUNTRY',videoLabel:'VIDEO',addFavorite:'Add to favorites',removeFavorite:'Remove from favorites',share:'Share concert',copied:'Link copied!',shareFallback:'Concert link',results:'concert(s)',countryFilter:'Selected country',resetDone:'Filters reset',videoPercent:'of past concerts have a video',upcomingDate:'Next concert',videoAvailable:'Video available',openVideo:'Open video ↗',showMore:'Open details ↗',menuOpen:'Open menu',menuClose:'Close menu',notAffiliated:'Unofficial fan-made archive'
    }
  };
  const t = key => translations[state.lang][key] || translations.fr[key] || key;
  const countryNames = {
    'Brazil': { fr: 'Brésil', en: 'Brazil' }, 'Denmark': { fr: 'Danemark', en: 'Denmark' },
    'France': { fr: 'France', en: 'France' }, 'Germany': { fr: 'Allemagne', en: 'Germany' },
    'Hong Kong': { fr: 'Hong Kong', en: 'Hong Kong' }, 'Indonesia': { fr: 'Indonésie', en: 'Indonesia' },
    'Ireland': { fr: 'Irlande', en: 'Ireland' }, 'Italy': { fr: 'Italie', en: 'Italy' },
    'Japan': { fr: 'Japon', en: 'Japan' }, 'Malaysia': { fr: 'Malaisie', en: 'Malaysia' },
    'Mexico': { fr: 'Mexique', en: 'Mexico' }, 'Netherlands': { fr: 'Pays-Bas', en: 'Netherlands' },
    'Poland': { fr: 'Pologne', en: 'Poland' }, 'Portugal': { fr: 'Portugal', en: 'Portugal' },
    'Singapore': { fr: 'Singapour', en: 'Singapore' }, 'South Korea': { fr: 'Corée du Sud', en: 'South Korea' },
    'Spain': { fr: 'Espagne', en: 'Spain' }, 'Sweden': { fr: 'Suède', en: 'Sweden' },
    'Thailand': { fr: 'Thaïlande', en: 'Thailand' }, 'United Kingdom': { fr: 'Royaume-Uni', en: 'United Kingdom' }
  };
  const displayCountry = country => countryNames[country]?.[state.lang] || country;
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const parseDate = value => new Date(`${value}T12:00:00`);
  const getStatus = concert => { const date = parseDate(concert.date); if (date > today) return 'upcoming'; return concert.video ? 'completed' : 'pending'; };
  const formatDate = value => new Intl.DateTimeFormat(state.lang === 'fr' ? 'fr-FR' : 'en-GB', {day:'2-digit',month:'long',year:'numeric'}).format(parseDate(value));
  const formatShortDate = value => new Intl.DateTimeFormat(state.lang === 'fr' ? 'fr-FR' : 'en-GB', {day:'2-digit',month:'short',year:'numeric'}).format(parseDate(value));
  const statusLabel = status => t(status === 'upcoming' ? 'statusUpcoming' : status === 'pending' ? 'statusPending' : 'statusCompleted');
  const sortedConcerts = [...concerts].sort((a,b) => a.date.localeCompare(b.date));
  function applyTranslations() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach(el => { const key = el.dataset.i18n; if (translations[state.lang][key]) el.innerHTML = translations[state.lang][key]; });
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.title = state.lang === 'fr' ? 'XO Live Archive — House of XO' : 'XO Live Archive — House of XO';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = state.lang === 'fr' ? 'XO Live Archive par House of XO — l’archive fan-made bilingue français/anglais de l’After Hours Til Dawn Tour 2026.' : 'XO Live Archive by House of XO — the bilingual French/English fan-made archive of the After Hours Til Dawn Tour 2026.';
    $('#langToggle').setAttribute('aria-label', state.lang === 'fr' ? 'Switch to English' : 'Passer en français');
    $('#menuToggle').setAttribute('aria-label', $('.desktop-nav').classList.contains('open') ? t('menuClose') : t('menuOpen'));
    renderAll();
  }
  function updateStats() {
    const past = concerts.filter(c => getStatus(c) !== 'upcoming').length;
    const videos = concerts.filter(c => Boolean(c.video)).length;
    $('#totalCount').textContent = concerts.length;
    $('#completedCount').textContent = past;
    $('#upcomingCount').textContent = concerts.length - past;
    $('#videoCount').textContent = videos;
    const coverage = past ? Math.round(concerts.filter(c => getStatus(c) === 'completed').length / past * 100) : 0;
    $('#videoCoverage').textContent = `${coverage}%`;
    $('#coverageBar').style.width = `${coverage}%`;
    $('#countryCount').textContent = new Set(concerts.map(c => c.country)).size;
  }
  function renderCountrySelect() {
    const select = $('#countrySelect'); const current = state.country;
    const countries = [...new Set(concerts.map(c => c.country))].sort((a,b)=>a.localeCompare(b));
    select.innerHTML = `<option value="">${safe(t('allCountries'))}</option>` + countries.map(country => `<option value="${safe(country)}">${safe(displayCountry(country))}</option>`).join('');
    select.value = current;
  }
  function matches(concert) {
    const status = getStatus(concert);
    if (state.filter === 'favorites' && !favorites.has(concert.date)) return false;
    if (state.filter === 'completed' && status !== 'completed') return false;
    if (state.filter === 'upcoming' && status !== 'upcoming') return false;
    if (state.filter === 'pending' && status !== 'pending') return false;
    if (state.country && concert.country !== state.country) return false;
    const query = state.search.trim().toLocaleLowerCase();
    if (query && ![concert.city,concert.country,displayCountry(concert.country),concert.venue,concert.date].join(' ').toLocaleLowerCase().includes(query)) return false;
    return true;
  }
  function youtubeId(url) {
    try { const parsed = new URL(url); let id = parsed.searchParams.get('v'); if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1); if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/')[2]; return id || ''; } catch { return ''; }
  }
  function thumbnailFor(concert) {
    if (concert.image && concert.image.trim()) return concert.image.trim();
    const id = youtubeId(concert.video || '');
    return id ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : '';
  }
  function thumbnailMarkup(concert, extraClass = '') {
    const image = thumbnailFor(concert);
    return `<span class="concert-thumb ${extraClass}">${image ? `<img src="${safe(image)}" alt="${safe(concert.city)} — image du concert" loading="lazy" onerror="this.style.display='none'">` : '<span class="thumb-xo">XO</span>'}<span class="thumb-shade"></span>${concert.video ? '<span class="play-icon" aria-hidden="true">▶</span>' : ''}<span class="thumb-caption">${safe(concert.flag)} &nbsp; XO LIVE ARCHIVE</span></span>`;
  }
  function cardMarkup(concert) {
    const status = getStatus(concert), fav = favorites.has(concert.date);
    return `<article class="concert-card"><button class="card-image-button" type="button" data-open="${safe(concert.date)}" aria-label="${safe(t('showMore'))}: ${safe(concert.city)}">${thumbnailMarkup(concert)}</button><div class="card-top"><span class="date-chip">${safe(formatShortDate(concert.date))}</span><span class="status-pill ${status}">${safe(statusLabel(status))}</span></div><div class="card-main"><div class="city-row"><span class="country-flag" aria-hidden="true">${safe(concert.flag)}</span><h3>${safe(concert.city)}</h3></div><p class="country-name">${safe(displayCountry(concert.country))}</p><p class="venue">⌁ &nbsp;${safe(concert.venue || concert.city)}</p></div><div class="card-bottom"><button class="card-action" type="button" data-open="${safe(concert.date)}">${safe(t('details'))}<span>↗</span></button><button class="favorite-btn ${fav?'is-favorite':''}" type="button" data-favorite="${safe(concert.date)}" aria-label="${safe(fav?t('removeFavorite'):t('addFavorite'))}" title="${safe(fav?t('removeFavorite'):t('addFavorite'))}">${fav?'♥':'♡'}</button></div></article>`;
  }
  function renderConcerts() {
    const filtered = sortedConcerts.filter(matches);
    $('#concertGrid').innerHTML = filtered.map(cardMarkup).join('');
    $('#emptyState').hidden = filtered.length !== 0;
    $('#concertGrid').hidden = filtered.length === 0;
    $('#resultsCount').textContent = `${filtered.length} ${t('results')}`;
    $('#concertGrid').querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openConcert(btn.dataset.open)));
    $('#concertGrid').querySelectorAll('[data-favorite]').forEach(btn => btn.addEventListener('click', () => toggleFavorite(btn.dataset.favorite)));
  }
  function renderDestinations() {
    const grouped = new Map();
    concerts.forEach(c => grouped.set(c.country, (grouped.get(c.country)||0)+1));
    $('#destinationList').innerHTML = [...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([country,count]) => `<button type="button" class="destination-chip" data-country="${safe(country)}">${safe(displayCountry(country))}<small>${count}</small></button>`).join('');
    $('#destinationList').querySelectorAll('[data-country]').forEach(btn => btn.addEventListener('click', () => { state.country = btn.dataset.country; $('#countrySelect').value = state.country; state.filter = 'all'; $$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.filter==='all')); renderConcerts(); $('#archive').scrollIntoView({behavior:'smooth'}); }));
  }
  function renderLatest() {
    const latest = concerts.filter(c => c.video).slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    $('#latestGrid').innerHTML = latest.map(c => `<article class="latest-card"><button class="latest-thumb" type="button" data-open="${safe(c.date)}" aria-label="${safe(t('showMore'))}: ${safe(c.city)}">${thumbnailMarkup(c, 'latest-thumb-art')}</button><div class="latest-info"><h3>${safe(c.city)} ${safe(c.flag)}</h3><p>${safe(formatShortDate(c.date))} · ${safe(displayCountry(c.country))}</p><a href="${safe(c.video)}" target="_blank" rel="noopener noreferrer">${safe(t('openVideo'))}</a></div></article>`).join('');
    $('#latestGrid').querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openConcert(btn.dataset.open)));
  }
  function renderAll() { updateStats(); renderCountrySelect(); renderConcerts(); renderDestinations(); renderLatest(); }
  function saveFavorites() { localStorage.setItem(favoritesKey, JSON.stringify([...favorites])); }
  function toggleFavorite(date) { if (favorites.has(date)) favorites.delete(date); else favorites.add(date); saveFavorites(); renderConcerts(); renderLatest(); showToast(favorites.has(date) ? t('removeFavorite') : t('addFavorite')); }
  function youtubeEmbed(url) { try { const parsed = new URL(url); let id = parsed.searchParams.get('v'); if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1); if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/')[2]; return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : ''; } catch { return ''; } }
  function openConcert(date) {
    const concert = concerts.find(c=>c.date===date); if (!concert) return;
    const status = getStatus(concert); const embed = concert.video ? youtubeEmbed(concert.video) : '';
    const url = new URL(location.href); url.searchParams.set('concert', concert.date);
    const poster = thumbnailFor(concert);
    $('#dialogContent').innerHTML = `<span class="dialog-kicker">XO LIVE ARCHIVE · ${safe(statusLabel(status))}</span><h2 class="dialog-title" id="dialogTitle">${safe(concert.flag)} ${safe(concert.city)}</h2><p class="dialog-meta">${safe(formatDate(concert.date))} · ${safe(displayCountry(concert.country))}</p>${embed ? `<div class="dialog-video" id="dialogVideo">${poster ? `<button class="video-poster" id="playConcertVideo" type="button" aria-label="Lire la vidéo de ${safe(concert.city)}"><img src="${safe(poster)}" alt="${safe(concert.city)} — image de couverture choisie pour la vidéo" onerror="this.style.display='none'"><span class="poster-vignette"></span><span class="poster-play">▶</span><small>PLAY VIDEO · XO LIVE ARCHIVE</small></button>` : `<button class="video-poster no-poster" id="playConcertVideo" type="button"><span class="thumb-xo">XO</span><span class="poster-play">▶</span></button>`}</div>` : `<p class="dialog-meta" style="margin-top:22px;padding:25px;border:1px dashed var(--line);border-radius:10px">${safe(t('noVideo'))}</p>`}<div class="dialog-info"><div><small>${safe(t('dateLabel'))}</small><strong>${safe(formatDate(concert.date))}</strong></div><div><small>${safe(t('venueLabel'))}</small><strong>${safe(concert.venue || concert.city)}</strong></div><div><small>${safe(t('countryLabel'))}</small><strong>${safe(concert.flag)} ${safe(displayCountry(concert.country))}</strong></div><div><small>${safe(t('videoLabel'))}</small><strong>${safe(concert.video ? t('videoAvailable') : t('statusPending'))}</strong></div></div><div class="dialog-actions">${concert.video?`<a class="button button-primary" href="${safe(concert.video)}" target="_blank" rel="noopener noreferrer">${safe(t('watch'))}</a>`:''}<button class="button button-ghost" type="button" id="shareConcert">↗ ${safe(t('share'))}</button><button class="button button-ghost" type="button" id="dialogFavorite">${favorites.has(date)?'♥':'♡'} ${safe(favorites.has(date)?t('removeFavorite'):t('addFavorite'))}</button></div>`;
    const dialog = $('#concertDialog'); if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
    history.replaceState(null,'',url);
    $('#shareConcert').addEventListener('click',()=>shareConcert(concert));
    $('#playConcertVideo')?.addEventListener('click',()=>{ const frame=document.createElement('iframe'); frame.src=`${embed}?autoplay=1`; frame.title=`${concert.city} — The Weeknd concert video`; frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.referrerPolicy='strict-origin-when-cross-origin'; frame.allowFullscreen=true; $('#dialogVideo').replaceChildren(frame); });
    $('#dialogFavorite').addEventListener('click',()=>{toggleFavorite(date);openConcert(date);});
  }
  function closeDialog() { const dialog=$('#concertDialog'); dialog.close?.(); dialog.removeAttribute('open'); const url=new URL(location.href); url.searchParams.delete('concert'); history.replaceState(null,'',url); }
  async function shareConcert(concert) { const url=new URL(location.href); url.searchParams.set('concert',concert.date); const payload={title:`${concert.city} — XO Live Archive`,text:`${formatDate(concert.date)} · ${concert.country}`,url:url.toString()}; try { if(navigator.share) await navigator.share(payload); else { await navigator.clipboard.writeText(payload.url); showToast(t('copied')); } } catch(err) { if(err?.name!=='AbortError') showToast(payload.url); } }
  let toastTimer; function showToast(message) { const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2200); }
  $('#langToggle').addEventListener('click',()=>{state.lang=state.lang==='fr'?'en':'fr';localStorage.setItem('xo-language',state.lang);applyTranslations();});
  $('#searchInput').addEventListener('input',event=>{state.search=event.target.value;renderConcerts();});
  $('#countrySelect').addEventListener('change',event=>{state.country=event.target.value;renderConcerts();});
  $('#statusFilters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;state.filter=button.dataset.filter;$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip===button));renderConcerts();});
  $('#resetFilters').addEventListener('click',()=>{state.filter='all';state.search='';state.country='';$('#searchInput').value='';$('#countrySelect').value='';$$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.filter==='all'));renderConcerts();showToast(t('resetDone'));});
  $('#dialogClose').addEventListener('click',closeDialog); $('#concertDialog').addEventListener('click',event=>{if(event.target===$('#concertDialog'))closeDialog();});
  $('#menuToggle').addEventListener('click',()=>{const nav=$('.desktop-nav');const open=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open));$('#menuToggle').textContent=open?'×':'☰';$('#menuToggle').setAttribute('aria-label',open?t('menuClose'):t('menuOpen'));});
  $$('.desktop-nav a').forEach(link=>link.addEventListener('click',()=>{$('.desktop-nav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').textContent='☰';}));

  function initVisualEffects() {
    const progress = $('#scrollProgress');
    const glow = $('#cursorGlow');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', e => { if (glow) { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; glow.classList.add('is-visible'); } }, {passive:true});
    } else if (glow) glow.hidden = true;
    const revealTargets = $$('.hero-copy,.hero-art,.stat-card,.section-heading,.concert-card,.destination-summary,.latest-card,.about-panel');
    if ('IntersectionObserver' in window && !reduced) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); } }), {threshold:0.08});
      revealTargets.forEach((el, index) => { el.classList.add('reveal-ready'); el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`); observer.observe(el); });
    }
    const canvas = $('#xoParticles');
    if (!canvas || reduced || window.innerWidth < 600) { if (canvas) canvas.hidden = true; return; }
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let width=0,height=0,raf=0; const particles=[]; const count=Math.min(42,Math.floor(window.innerWidth/34));
    function resize(){width=canvas.width=window.innerWidth*devicePixelRatio;height=canvas.height=window.innerHeight*devicePixelRatio;canvas.style.width=`${window.innerWidth}px`;canvas.style.height=`${window.innerHeight}px`;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);}
    resize(); for(let i=0;i<count;i++)particles.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*1.6+.4,v:.12+Math.random()*.28,a:.15+Math.random()*.4});
    function draw(){ctx.clearRect(0,0,window.innerWidth,window.innerHeight);for(const p of particles){p.y-=p.v;if(p.y<-4){p.y=window.innerHeight+4;p.x=Math.random()*window.innerWidth;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(57,255,136,${p.a})`;ctx.fill();}raf=requestAnimationFrame(draw);}
    draw(); window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(!reduced)draw();});
  }

  initVisualEffects();
  applyTranslations();
  const requestedConcert = new URLSearchParams(location.search).get('concert'); if(requestedConcert && concerts.some(c=>c.date===requestedConcert)) openConcert(requestedConcert);
  const languageBanner = document.querySelector('.language-announcement');
  const dismissLanguageBanner = document.querySelector('.language-banner-close');
  if (languageBanner && dismissLanguageBanner) {
    dismissLanguageBanner.addEventListener('click', () => {
      languageBanner.classList.add('is-dismissed');
      window.setTimeout(() => languageBanner.remove(), 350);
    });
  }
})();
