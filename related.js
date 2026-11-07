/* Factology Guru: "More from this series" on book pages.
   Reads books.json and shows the next 5 live books of the same series (alphabetical, wrapping around),
   so every book appears on 5 other pages. Hidden when the series has no other live book. */
(function () {
  var box = document.getElementById('fg-more');
  if (!box || !window.fetch) return;
  var norm = function (c) { return /^mystery/i.test(c || '') ? 'Mystery' : String(c || '').trim(); };
  var key = function (t) { return String(t || '').replace(/^100 Facts About /i, '').replace(/^The /i, '').toLowerCase(); };
  var path = function (u) { try { return new URL(u, location.href).pathname.replace(/\/+$/, '/'); } catch (e) { return ''; } };
  var cat = norm(box.getAttribute('data-category'));
  var here = path(location.href);
  fetch('/books.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    var seen = {}, live = [];
    (d.books || []).concat(d.spotlight ? [d.spotlight] : []).forEach(function (b) {
      if (!b || !b.amazon_url || b.amazon_url === '#' || norm(b.category) !== cat) return;
      var p = path(b.amazon_url); if (!p || seen[p]) return; seen[p] = 1; live.push(b);
    });
    live.sort(function (a, b) { return key(a.title) < key(b.title) ? -1 : key(a.title) > key(b.title) ? 1 : 0; });
    var i = -1;
    for (var k = 0; k < live.length; k++) if (path(live[k].amazon_url) === here) i = k;
    var others = live.length - (i >= 0 ? 1 : 0);
    if (others < 1) return;
    var n = Math.min(5, others), picks = [];
    for (var j = 1; picks.length < n; j++) picks.push(live[((i < 0 ? -1 : i) + j) % live.length]);
    var row = box.querySelector('.fg-books');
    picks.forEach(function (b) {
      var a = document.createElement('a');
      a.href = b.amazon_url; a.target = '_blank'; a.rel = 'noopener'; a.className = 'fg-book';
      var img = document.createElement('img');
      img.src = b.cover; img.alt = b.title + ' book cover'; img.loading = 'lazy'; img.width = 160; img.height = 250;
      var s = document.createElement('span'); s.textContent = String(b.title).replace(/^100 Facts About /i, '');
      a.appendChild(img); a.appendChild(s); row.appendChild(a);
    });
    box.style.display = 'block';
  }).catch(function () {});
})();
