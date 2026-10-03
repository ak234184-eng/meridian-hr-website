(() => {
  const navItems = [['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'], ['jobs.html', 'Careers']];
  const header = document.getElementById('site-header');
  if (header) {
    const current = location.pathname.split('/').pop() || 'index.html';
    header.innerHTML = `<div class="topbar"><div class="container topbar-inner"><span>People first. Process always.</span><span>Delhi NCR <i></i> Serving businesses across India</span></div></div><header class="site-header"><div class="container nav-wrap"><a class="brand" href="index.html" aria-label="Meridian HR and Staffing home"><img src="assets/logo.jpg" alt=""><span><b>Meridian</b><small>HR and Staffing</small></span></a><button class="menu-toggle" aria-expanded="false" aria-label="Open menu"><span></span><span></span></button><nav class="main-nav" aria-label="Main navigation">${navItems.map(([href, label]) => `<a href="${href}" ${current === href ? 'aria-current="page"' : ''}>${label}</a>`).join('')}<a class="nav-contact" href="contact.html">Let’s talk <span>↗</span></a></nav></div></header>`;
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.main-nav');
    toggle.addEventListener('click', () => { const isOpen = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!isOpen)); nav.classList.toggle('nav-open', !isOpen); document.body.classList.toggle('menu-open', !isOpen); });
    nav.addEventListener('click', event => { if (event.target.closest('a')) { nav.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); } });
  }
  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container footer-main"><div class="footer-brand"><a class="brand brand-footer" href="index.html"><img src="assets/logo.jpg" alt=""><span><b>Meridian</b><small>HR and Staffing</small></span></a><p>Connecting talent. Powering businesses.<br>People-first workforce support, across India.</p><a class="footer-email" href="mailto:admin@meridian-hr.in">admin@meridian-hr.in <span>↗</span></a></div><div class="footer-column"><span class="footer-title">EXPLORE</span><a href="about.html">About Meridian</a><a href="services.html">Our services</a><a href="jobs.html">Careers & open roles</a><a href="contact.html">Contact our team</a></div><div class="footer-column"><span class="footer-title">OUR SERVICES</span><a href="services.html#recruitment">Recruitment</a><a href="services.html#staffing">Contract staffing</a><a href="services.html#payroll">Payroll management</a><a href="services.html#compliance">Compliance support</a></div><div class="footer-contact"><span class="footer-title">SAY HELLO</span><a href="tel:+919716727058">+91 97167 27058</a><span>Delhi NCR · Pan-India support</span></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Meridian HR & Staffing. All rights reserved.</span><span>Built on trust. Powered by people.</span></div></footer>`;
  if (footer) footer.querySelector('.footer-bottom span:last-child').insertAdjacentHTML('beforeend', ' <a href="privacy.html">Privacy</a> · <a href="admin.html">Admin</a>');
  if (!document.querySelector('.whatsapp-float')) {
    const whatsapp = document.createElement('a');
    whatsapp.className = 'whatsapp-float';
    whatsapp.href = 'https://wa.me/919716727058?text=Hello%20Meridian%20HR%20%26%20Staffing%2C%20I%20have%20an%20enquiry.';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener';
    whatsapp.setAttribute('aria-label', 'Message Meridian HR and Staffing on WhatsApp');
    whatsapp.innerHTML = '<span aria-hidden="true">◉</span><b>WhatsApp us</b>';
    document.body.append(whatsapp);
  }
})();
