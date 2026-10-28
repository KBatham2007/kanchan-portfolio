(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Three.js particle hero ---------- */
  var canvas = document.getElementById('hero-canvas');
  if (window.THREE && canvas) {
    var hero = canvas.parentElement;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.z = 55;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var COUNT = window.innerWidth < 700 ? 1200 : 2800;
    var pos = new Float32Array(COUNT * 3);
    var col = new Float32Array(COUNT * 3);
    var palette = [new THREE.Color('#7C5CFF'), new THREE.Color('#22D3EE'), new THREE.Color('#F472B6')];
    for (var i = 0; i < COUNT; i++) {
      var r = 20 + Math.random() * 55, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
      var c = palette[i % 3];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    var mat = new THREE.PointsMaterial({ size: 0.9, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var mx = 0, my = 0;
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    var visible = true;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);

    (function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      if (!reduce) {
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0003;
      }
      camera.position.x += (mx * 8 - camera.position.x) * 0.04;
      camera.position.y += (-my * 6 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    })();
  }

  /* ---------- Typing effect ---------- */
  var el = document.getElementById('typed');
  var words = ['BTech Student', 'Web Developer', 'UI Enthusiast', 'Lifelong Learner'];
  var wi = 0, ci = 0, del = false;
  function type() {
    var w = words[wi];
    el.textContent = w.slice(0, ci);
    if (!del && ci === w.length) { del = true; return setTimeout(type, 1500); }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 45 : 90);
  }
  if (reduce) { el.textContent = words[0]; } else { type(); }

  /* ---------- Scroll reveal, counters, skill bars ---------- */
  function count(node) {
    var target = +node.dataset.count, start = null;
    (function step(ts) {
      if (!start) start = ts;
      var k = Math.min((ts - start) / 1400, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step); else node.textContent = target + '+';
    })(performance.now());
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target;
      t.classList.add('in');
      t.querySelectorAll('[data-w]').forEach(function (b) { b.style.width = b.dataset.w + '%'; });
      t.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(t);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });

  /* ---------- Scroll progress bar ---------- */
  var bar = document.getElementById('progress');
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  /* ---------- Card tilt ---------- */
  if (!reduce) {
    document.querySelectorAll('.tilt').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var b = c.getBoundingClientRect();
        var x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        c.style.transform = 'perspective(800px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
