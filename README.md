# El Gallito Mañanero · Menú

Native HTML digital menu inspired by the supplied restaurant menu and the
navigation/content structure of the user's Teofilitos reference site.
All dishes, descriptions, prices, headings and category links are actual,
selectable text. No menu screenshots or cropped lettering are rendered.

Pompiere is used for narrow menu lettering; Loved by the King is used for
handwritten prices. Both fonts are hosted locally, with their SIL Open Font
Licenses in `dist/assets/fonts`. The logo is the original supplied PNG.

Sections include breakfast, tortas and other dishes, extras, kids' menu,
guisado prices by taco/burrito/montado, drinks, and branch phone links.
Content is in `dist/index.html`; the source transcript is retained in
`dist/menu-data.json`. The static menu works without JavaScript; a small
script updates active navigation and responsive anchor offsets.
