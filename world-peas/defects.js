// Defects for visual testing of the World Peas page.
// - The page applies the defects listed in ?bugs=<id>,<id> (or ?bugs=all). With no ?bugs= it is the clean design.
// - The admin page (admin/) reads the same list to show the toggles and build the link.
// Each defect has either `css` (added as a style block) or `run` (changes the DOM), or both.

(function () {
  const $ = (sel) => document.querySelector(sel)
  const today = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const setText = (sel, from, to) => { const el = $(sel); el.innerHTML = el.innerHTML.replace(from, to) }

  const DEFECTS = [
    // Text content
    { id: 'typo-headline', group: 'Text', label: 'Typo in headline', detail: '"farmers" becomes "famers"',
      run: () => setText('#headline', 'farmers', 'famers') },
    { id: 'typo-nav', group: 'Text', label: 'Typo in nav', detail: '"Newstand" becomes "Newsstand"',
      run: () => setText('#nav-newstand', 'Newstand', 'Newsstand') },
    { id: 'cta-text', group: 'Text', label: 'Button text changed', detail: '"Browse our shop" becomes "Shop now"',
      run: () => { $('#cta').textContent = 'Shop now' } },
    { id: 'caption-text', group: 'Text', label: 'Caption place changed', detail: '"Central California" becomes "Northern Oregon"',
      run: () => setText('#caption', 'Central California</strong>', 'Northern Oregon</strong>') },
    { id: 'missing-paragraph', group: 'Text', label: 'Paragraph missing', detail: '"What are we forgetting?" is removed',
      run: () => $('#believe-text p:nth-child(3)').remove() },
    { id: 'extra-word', group: 'Text', label: 'Extra word in list', detail: 'Adds "Kale." after "Dill."',
      run: () => setText('#believe-text p:nth-child(2)', 'Dill.', 'Dill. Kale.') },
    { id: 'label-case', group: 'Text', label: 'Label not uppercase', detail: '"WHAT WE BELIEVE" shows as "What we believe"',
      css: '#believe-label { text-transform: none; }' },

    // Dynamic content (changes on every load)
    { id: 'basket-number', group: 'Dynamic content', label: 'Basket count changes', detail: 'Basket (3) becomes Basket (12)',
      run: () => { $('#basket').textContent = 'Basket (12)' } },
    { id: 'basket-random', group: 'Dynamic content', label: 'Random basket count', detail: 'A new number from 1 to 99 on every load',
      run: () => { $('#basket').textContent = `Basket (${1 + Math.floor(Math.random() * 99)})` } },
    { id: 'date-today', group: 'Dynamic content', label: 'Today\'s date in caption', detail: 'Adds "Picked on <today>." to the caption',
      run: () => { $('#caption').insertAdjacentHTML('beforeend', ` Picked on ${today()}.`) } },
    { id: 'time-now', group: 'Dynamic content', label: 'Current time in header', detail: 'Shows the time of the page load next to the logo',
      run: () => { $('#logo').insertAdjacentHTML('afterend', `<span style="font-size:14px;margin-left:16px;margin-right:auto">Updated ${time()}</span>`) } },
    { id: 'order-id', group: 'Dynamic content', label: 'Random order ID', detail: 'Adds "Order #WP-<random>" under the button',
      run: () => { $('#cta').insertAdjacentHTML('afterend', `<p style="margin:16px 0 0;font-size:14px">Order #WP-${Math.random().toString(36).slice(2, 8).toUpperCase()}</p>`) } },

    // Colour and style
    { id: 'button-color-subtle', group: 'Colour and style', label: 'Button green slightly off', detail: '#426B1F becomes #4A7524 (hard to see by eye)',
      css: '.btn { background: #4A7524 !important; }' },
    { id: 'button-color', group: 'Colour and style', label: 'Button colour wrong', detail: 'Green buttons become orange',
      css: '.btn { background: #C2410C !important; }' },
    { id: 'logo-color', group: 'Colour and style', label: 'Logo colour wrong', detail: 'Logo turns black',
      css: '#logo { color: #000000; }' },
    { id: 'text-grey', group: 'Colour and style', label: 'Body text low contrast', detail: 'Paragraph text turns light grey',
      css: '#believe-text { color: #9CA3AF; }' },
    { id: 'button-square', group: 'Colour and style', label: 'Button corners square', detail: 'Border radius 8px becomes 0',
      css: '.btn { border-radius: 0; }' },
    { id: 'button-shadow', group: 'Colour and style', label: 'Button shadow added', detail: 'Drop shadow on both buttons',
      css: '.btn { box-shadow: 0 6px 16px rgba(0, 0, 0, .35); }' },
    { id: 'background-tint', group: 'Colour and style', label: 'Page background off-white', detail: '#FFFFFF becomes #FAFAF7',
      css: 'body { background: #FAFAF7; }' },
    { id: 'link-underline', group: 'Colour and style', label: 'Nav links underlined', detail: 'All nav links get an underline',
      css: '.nav a:not(.btn) { text-decoration: underline; }' },

    // Fonts
    { id: 'font-fallback', group: 'Fonts', label: 'Headline font missing', detail: 'Newsreader falls back to Georgia',
      css: '#headline, #logo { font-family: Georgia, serif !important; }' },
    { id: 'body-font', group: 'Fonts', label: 'Body font wrong', detail: 'Inter becomes Arial',
      css: 'body, .btn { font-family: Arial, sans-serif !important; }' },
    { id: 'no-italic', group: 'Fonts', label: 'Italics lost', detail: 'farmers, purveyors, eaters are no longer italic',
      css: '#headline em { font-style: normal; }' },
    { id: 'headline-bold', group: 'Fonts', label: 'Headline too bold', detail: 'Weight 400 becomes 600',
      css: '#headline { font-weight: 600; }' },
    { id: 'headline-size', group: 'Fonts', label: 'Headline smaller', detail: '64px becomes 56px',
      css: '#headline { font-size: 56px; }' },
    { id: 'letter-spacing', group: 'Fonts', label: 'Wider letter spacing', detail: 'Paragraph text gets +0.5px letter spacing (lines rewrap)',
      css: '#believe-text p { letter-spacing: 0.5px; }' },
    { id: 'line-height', group: 'Fonts', label: 'Tighter line height', detail: 'Paragraph line height 32px becomes 26px',
      css: '#believe-text p { line-height: 26px; }' },

    // Layout and spacing
    { id: 'shift-1px', group: 'Layout and spacing', label: 'Whole page 1px lower', detail: 'Everything moves down by 1 pixel',
      css: '.page { padding-top: 1px; }' },
    { id: 'logo-shift', group: 'Layout and spacing', label: 'Logo moved', detail: 'Logo moves 12px to the right',
      css: '#logo { margin-left: 12px; }' },
    { id: 'cta-offcentre', group: 'Layout and spacing', label: 'Button off-centre', detail: 'Hero button moves 40px to the left',
      css: '#cta { position: relative; left: -40px; }' },
    { id: 'hero-gap', group: 'Layout and spacing', label: 'Bigger gap under headline', detail: 'Space above the button 48px becomes 80px',
      css: '#cta { margin-top: 80px; }' },
    { id: 'nav-gap', group: 'Layout and spacing', label: 'Nav items squeezed', detail: 'Gap between nav items 48px becomes 24px',
      css: '.nav { gap: 24px; }' },
    { id: 'nav-order', group: 'Layout and spacing', label: 'Nav items reordered', detail: '"Who we are" moves before "Shop"',
      run: () => $('#nav-shop').before($('#nav-who')) },
    { id: 'nav-missing', group: 'Layout and spacing', label: 'Nav item missing', detail: '"My profile" is removed',
      run: () => $('#nav-profile').remove() },
    { id: 'photo-offset', group: 'Layout and spacing', label: 'Second photo not lowered', detail: 'Both photos line up at the top (design has a 90px offset)',
      css: '.photos .second { margin-top: 0; }' },
    { id: 'photos-swapped', group: 'Layout and spacing', label: 'Photo columns swapped', detail: 'The two photos change sides',
      css: '.photos { direction: rtl; } .photos > * { direction: ltr; }' },
    { id: 'text-narrow', group: 'Layout and spacing', label: 'Paragraph column narrower', detail: 'Text width 822px becomes 700px (lines rewrap)',
      css: '.believe { grid-template-columns: 213px 700px; }' },
    { id: 'caption-overlap', group: 'Layout and spacing', label: 'Caption overlaps photo', detail: 'Caption moves up into the photo',
      css: '#caption { position: relative; margin-top: -30px; color: #FFFFFF; }' },
    { id: 'cta-missing', group: 'Layout and spacing', label: 'Hero button missing', detail: 'Hidden, but still takes up space',
      css: '#cta { visibility: hidden; }' },
    { id: 'cta-removed', group: 'Layout and spacing', label: 'Hero button removed', detail: 'Removed, so everything below moves up',
      css: '#cta { display: none; }' },
    { id: 'promo-banner', group: 'Layout and spacing', label: 'Promo banner added', detail: 'A green bar above the header pushes the page down',
      run: () => { $('.page').insertAdjacentHTML('afterbegin', '<div style="background:#426B1F;color:#fff;text-align:center;font-size:14px;line-height:40px">Free delivery on orders over $50</div>') } },
    { id: 'cookie-banner', group: 'Layout and spacing', label: 'Cookie banner over content', detail: 'A fixed bar at the bottom of the window',
      run: () => { document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;left:0;right:0;bottom:0;background:#111;color:#fff;padding:16px 96px;font:14px Inter,sans-serif">We use cookies to keep your basket. <a href="#" style="color:#9AE66E">Accept</a></div>') } },
    { id: 'overflow', group: 'Layout and spacing', label: 'Text overflows its column', detail: 'A long link runs past the paragraph into the right margin',
      run: () => { $('#believe-text p:nth-child(3)').insertAdjacentHTML('beforeend', ' <a href="#" style="white-space:nowrap;text-decoration:underline">https://worldpeas.example.com/products/organic/seasonal/heirloom-tomatoes-and-escaroles-from-central-california?ref=newsletter</a>') } },

    // Images
    { id: 'image-broken', group: 'Images', label: 'Broken image', detail: 'Greens photo fails to load',
      run: () => { $('#img-greens').src = 'images/missing.jpg' } },
    { id: 'image-swapped', group: 'Images', label: 'Wrong image', detail: 'Greens photo shows the produce photo',
      run: () => { $('#img-greens').src = 'images/produce.jpg' },
      css: '#img-greens { height: 693px; object-fit: cover; }' },
    { id: 'image-flipped', group: 'Images', label: 'Image flipped', detail: 'Produce photo is mirrored',
      css: '#img-produce { transform: scaleX(-1); }' },
    { id: 'image-stretched', group: 'Images', label: 'Image stretched', detail: 'Produce photo squashed to 380px high',
      css: '#img-produce { height: 380px; }' },
    { id: 'image-cropped', group: 'Images', label: 'Image cropped differently', detail: 'Produce photo zoomed in by 15%',
      css: '#img-produce { object-fit: cover; object-position: center; transform: scale(1.15); } .photos .second { overflow: hidden; }' },
    { id: 'image-tint', group: 'Images', label: 'Image colours off', detail: 'Greens photo slightly desaturated',
      css: '#img-greens { filter: saturate(.7); }' },
    { id: 'image-blur', group: 'Images', label: 'Image blurry', detail: 'Produce photo slightly blurred (like a low-resolution file)',
      css: '#img-produce { filter: blur(1.5px); }' },
  ]

  window.WP_DEFECTS = DEFECTS

  // Admin page only needs the list
  if (document.currentScript?.dataset.listOnly !== undefined) return

  const param = new URLSearchParams(location.search).get('bugs')
  if (!param) return
  const wanted = param === 'all' ? DEFECTS.map((d) => d.id) : param.split(',').map((s) => s.trim())
  const active = DEFECTS.filter((d) => wanted.includes(d.id))
  const css = active.map((d) => d.css).filter(Boolean).join('\n')
  if (css) document.head.insertAdjacentHTML('beforeend', `<style id="defects">${css}</style>`)
  for (const d of active) if (d.run) d.run()
  document.documentElement.dataset.defects = active.map((d) => d.id).join(' ')
})()
