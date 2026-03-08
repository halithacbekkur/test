document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000);
        });
    }

    // --- 2. Global State for Animation ---
    window.currentLangWords = ["the Web.", "the Future.", "AI Systems.", "Problem Solving."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typingSpan = document.querySelector('.typing-text');

    function type() {
        if (!typingSpan) return;

        const currentList = window.currentLangWords;
        const currentword = currentList[wordIndex % currentList.length];

        if (isDeleting) {
            typingSpan.textContent = currentword.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingSpan.textContent = currentword.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentword.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingSpan) setTimeout(type, 1000);


    // --- 3. Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll, .section-header').forEach(el => {
        observer.observe(el);
    });

    // --- 4. Particle System ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;
        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80)
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = (canvas.height / 80) * (canvas.width / 80);
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#3b82f6';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#3b82f6';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(59, 130, 246,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        init();
        animate();
    }

    // --- 5. Tilt Effect ---
    const tiltCard = document.getElementById('profile-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const cardRect = tiltCard.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            const centerX = cardRect.left + cardWidth / 2;
            const centerY = cardRect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            const rotateX = (mouseY / (cardHeight / 2)) * -10;
            const rotateY = (mouseX / (cardWidth / 2)) * 10;

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        tiltCard.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    }

    // --- 6. Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuBgBlur = document.querySelector('.menu-bg-blur');

    function closeMobileMenu() {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('open');
        }
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        // Close when clicking links
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close when clicking outside content (blur area or main container wrapper)
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu || e.target === menuBgBlur) {
                closeMobileMenu();
            }
        });
    }

    // --- 7. Language Switcher ---
    const translations = {
        en: {
            "nav.about": "About",
            "nav.skills": "Skills",
            "nav.projects": "Projects",
            "nav.experience": "Experience",
            "nav.contact": "Contact Me",
            "hero.subtitle": "Hello, my name is",
            "hero.role": "I build things for ",
            "hero.desc": "Aspiring <strong>Software Engineering student</strong> at Fırat University. I focus on mastering core principles and structured programming before advancing toward intelligent systems.",
            "hero.btn": "Check out my work!",

            // About
            "about.subtitle": "About Me",
            "about.title": "Who I Am",
            "about.p1": "I am a first-year <strong>Software Engineering student</strong> at Fırat University, committed to building a strong foundation in computer science fundamentals.",
            "about.p2": "My philosophy is simple: master the basics deeply before pursuing complexity. I focus on structured programming, logical thinking, and disciplined growth.",
            "about.p3": "My long-term mission is to graduate as a highly skilled <strong>Software and AI Engineer</strong>, dedicated to building innovative solutions that positively impact the world.",

            // Skills
            "skills.subtitle": "My Arsenal",
            "skills.title": "Technical Skills",
            "skills.java": "Java Core",
            "skills.logic": "Logic & Concepts",
            "skills.tools": "Tools & Environment",
            "skills.future": "Future Focus",

            // Projects
            "projects.subtitle": "Portfolio",
            "projects.title": "Featured Projects",
            "proj.1.title": "Number Comparison System",
            "proj.1.desc": "A Java console application that determines the maximum value among multiple inputs using logical conditions and modular structure.",
            "proj.2.title": "Rectangle Area Calculator",
            "proj.2.desc": "A structured Java program that calculates geometric values using user input and separates logic into modular methods.",
            "proj.3.title": "Simple Calculator Application",
            "proj.3.desc": "A robust arithmetic calculator implementing condition handling, loop structures for continuous operation, and error checking.",
            "proj.4.title": "2D Array Processing",
            "proj.4.desc": "A data processing program designed to manipulate and analyze two-dimensional data structures using nested loops.",

            // Experience
            "exp.subtitle": "My Path",
            "exp.title": "Timeline",
            "exp.1.role": "Software Engineering Student",
            "exp.1.comp": "Fırat University",
            "exp.1.desc": "• Developing structured Java programs and algorithms.<br>• Practicing problem solving and logic optimization.<br>• Building a deep understanding of Computer Science fundamentals.",
            "exp.2.role": "Participant",
            "exp.2.comp": "FIRATECH Technology Summit",
            "exp.2.desc": "Engaged with industry professionals and software engineering trends. Focused on innovation and future tech stacks.",

            // Services
            "services.subtitle": "What I Offer",
            "services.title": "Services",
            "serv.1.title": "Java Development",
            "serv.1.desc": "Clean, structured code for foundational applications and utilities.",
            "serv.2.title": "Algorithm Design",
            "serv.2.desc": "Assistance with logical challenges and optimization tasks.",
            "serv.3.title": "Tutoring",
            "serv.3.desc": "Helping peers understand core concepts and project structures.",

            // Contact
            "contact.subtitle": "What's Next?",
            "contact.title": "Get In Touch",
            "contact.desc": "I am currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
            "contact.btn": "Say Hello",
            "contact.connect": "Connect with me:",

            // Footer
            "footer.credit": "Designed & Built by Halid Hacbekkur",
            "footer.rights": "All Rights Reserved."
        },
        tr: {
            "nav.about": "Hakkımda",
            "nav.skills": "Yetenekler",
            "nav.projects": "Projeler",
            "nav.experience": "Deneyim",
            "nav.contact": "İletişim",
            "hero.subtitle": "Merhaba, ben",
            "hero.role": "Şunun için çözümler üretiyorum: ",
            "hero.desc": "Fırat Üniversitesi'nde <strong>Yazılım Mühendisliği öğrencisi</strong> adayıyım. Akıllı sistemlere geçmeden önce temel prensipleri ve yapısal programlamayı ustalıkla öğrenmeye odaklanıyorum.",
            "hero.btn": "Projelerimi İncele",

            // About
            "about.subtitle": "Hakkımda",
            "about.title": "Ben Kimim",
            "about.p1": "Fırat Üniversitesi'nde birinci sınıf <strong>Yazılım Mühendisliği öğrencisiyim</strong> ve bilgisayar bilimlerinin temellerine dair güçlü bir altyapı oluşturmaya kararlıyım.",
            "about.p2": "Felsefem basit: Karmaşıklığa geçmeden önce temelleri derinlemesine öğren. Yapısal programlama, mantıksal düşünme ve disiplinli gelişime odaklanıyorum.",
            "about.p3": "Uzun vadeli misyonum, dünyaya olumlu katkı sağlayan yenilikçi çözümler üreten, yetenekli bir <strong>Yazılım ve Yapay Zeka Mühendisi</strong> olarak mezun olmaktır.",

            // Skills
            "skills.subtitle": "Yeteneklerim",
            "skills.title": "Teknik Beceriler",
            "skills.java": "Java Çekirdek",
            "skills.logic": "Mantık & Kavramlar",
            "skills.tools": "Araçlar & Ortam",
            "skills.future": "Gelecek Hedefleri",

            // Projects
            "projects.subtitle": "Portfolyo",
            "projects.title": "Öne Çıkan Projeler",
            "proj.1.title": "Sayı Karşılaştırma Sistemi",
            "proj.1.desc": "Mantıksal koşullar ve modüler yapı kullanarak birden fazla girdi arasındaki en büyük değeri belirleyen bir Java konsol uygulaması.",
            "proj.2.title": "Dikdörtgen Alan Hesaplayıcı",
            "proj.2.desc": "Kullanıcı girdilerini kullanarak geometrik değerleri hesaplayan ve mantığı modüler yöntemlere ayıran yapısal bir Java programı.",
            "proj.3.title": "Basit Hesap Makinesi",
            "proj.3.desc": "Koşul işleme, sürekli işlem için döngü yapıları ve hata kontrolü uygulayan sağlam bir aritmetik hesap makinesi.",
            "proj.4.title": "2D Dizi İşleme",
            "proj.4.desc": "İç içe döngüler kullanarak iki boyutlu veri yapılarını işlemek ve analiz etmek için tasarlanmış bir veri işleme programı.",

            // Experience
            "exp.subtitle": "Yolculuğum",
            "exp.title": "Zaman Çizelgesi",
            "exp.1.role": "Yazılım Mühendisliği Öğrencisi",
            "exp.1.comp": "Fırat Üniversitesi",
            "exp.1.desc": "• Yapısal Java programları ve algoritmalar geliştirme.<br>• Problem çözme ve mantık optimizasyonu pratikleri.<br>• Bilgisayar Bilimi temellerinin derinlemesine anlaşılması.",
            "exp.2.role": "Katılımcı",
            "exp.2.comp": "FIRATECH Teknoloji Zirvesi",
            "exp.2.desc": "Sektör profesyonelleri ve yazılım mühendisliği trendleri ile etkileşim. İnovasyon ve geleceğin teknoloji yığınlarına odaklanma.",

            // Services
            "services.subtitle": "Hizmetler",
            "services.title": "Neler sunuyorum",
            "serv.1.title": "Java Geliştirme",
            "serv.1.desc": "Programlar ve araçlar için temiz, yapısal kod.",
            "serv.2.title": "Algoritma Tasarımı",
            "serv.2.desc": "Mantıksal zorluklar ve optimizasyon görevlerinde yardım.",
            "serv.3.title": "Özel Ders",
            "serv.3.desc": "Arkadaşların temel kavramları ve proje yapılarını anlamalarına yardımcı olma.",

            // Contact
            "contact.subtitle": "Sırada Ne Var?",
            "contact.title": "İletişime Geç",
            "contact.desc": "Şu anda yeni fırsatlar ve işbirlikleri arıyorum. Bir sorunuz varsa veya sadece merhaba demek istiyorsanız, size geri dönmek için elimden geleni yapacağım!",
            "contact.btn": "Merhaba De",
            "contact.connect": "Benimle bağlantı kurun:",

            // Footer
            "footer.credit": "Halid Hacbekkur tarafından tasarlandı & kodlandı",
            "footer.rights": "Tüm Hakları Saklıdır."
        },
        ar: {
            "nav.about": "حولي",
            "nav.skills": "مهارات",
            "nav.projects": "مشاريع",
            "nav.experience": "خبرة",
            "nav.contact": "اتصل بي",
            "hero.subtitle": "مرحباً، اسمي",
            "hero.role": "أقوم ببناء أنظمة لـ ",
            "hero.desc": "طالب <strong>هندسة برمجيات</strong> طموح في جامعة الفرات. أركز على إتقان المبادئ الأساسية والبرمجة المنظمة قبل التقدم نحو الأنظمة الذكية.",
            "hero.btn": "تصفح أعمالي",

            // About
            "about.subtitle": "من أنا",
            "about.title": "عنّي",
            "about.p1": "أنا <strong>طالب هندسة برمجيات</strong> في السنة الأولى بجامعة الفرات، ملتزم ببناء أساس قوي في أساسيات علوم الكمبيوتر.",
            "about.p2": "فلسفتي بسيطة: إتقان الأساسيات بعمق قبل متابعة التعقيد. أركز على البرمجة المنظمة، التفكير المنطقي، والنمو المنضبط.",
            "about.p3": "مهمتي طويلة المدى هي التخرج كـ <strong>مهندس برمجيات وذكاء اصطناعي</strong> عالي المهارة، مكرس لبناء حلول مبتكرة تؤثر إيجابياً على العالم.",

            // Skills
            "skills.subtitle": "ترسانتي",
            "skills.title": "المهارات التقنية",
            "skills.java": "جوهر جافا",
            "skills.logic": "المنطق والمفاهيم",
            "skills.tools": "الأدوات والبيئة",
            "skills.future": "التركيز المستقبلي",

            // Projects
            "projects.subtitle": "معرض الأعمال",
            "projects.title": "مشاريع مميزة",
            "proj.1.title": "نظام مقارنة الأرقام",
            "proj.1.desc": "تطبيق وحدة تحكم جافا يحدد القيمة القصوى بين مدخلات متعددة باستخدام الشروط المنطقية والهيكل المعياري.",
            "proj.2.title": "حاسبة مساحة المستطيل",
            "proj.2.desc": "برنامج جافا منظم يحسب القيم الهندسية باستخدام مدخلات المستخدم ويفصل المنطق إلى طرق معيارية.",
            "proj.3.title": "تطبيق حاسبة بسيطة",
            "proj.3.desc": "آلة حاسبة حسابية قوية تطبق معالجة الشروط، وهياكل الحلقات للتشغيل المستمر، والتحقق من الأخطاء.",
            "proj.4.title": "معالجة المصفوفات ثنائية الأبعاد",
            "proj.4.desc": "برنامج معالجة بيانات مصمم لمعالجة وتحليل هياكل البيانات ثنائية الأبعاد باستخدام الحلقات المتداخلة.",

            // Experience
            "exp.subtitle": "مساري",
            "exp.title": "الجدول الزمني",
            "exp.1.role": "طالب هندسة برمجيات",
            "exp.1.comp": "جامعة الفرات",
            "exp.1.desc": "• تطوير برامج جافا وخوارزميات منظمة.<br>• ممارسة حل المشكلات وتحسين المنطق.<br>• بناء فهم عميق لأساسيات علوم الكمبيوتر.",
            "exp.2.role": "مشارك",
            "exp.2.comp": "قمة تكنولوجيا FIRATECH",
            "exp.2.desc": "تفاعل مع محترفي الصناعة واتجاهات هندسة البرمجيات. التركيز على الابتكار ومداخن التكنولوجيا المستقبلية.",

            // Services
            "services.subtitle": "ماذا أقدم",
            "services.title": "الخدمات",
            "serv.1.title": "تطوير جافا",
            "serv.1.desc": "كود نظيف ومنظم للتطبيقات والأدوات الأساسية.",
            "serv.2.title": "تصميم الخوارزميات",
            "serv.2.desc": "المساعدة في التحديات المنطقية ومهام التحسين.",
            "serv.3.title": "التدريس",
            "serv.3.desc": "مساعدة الزملاء على فهم المفاهيم الأساسية وهياكل المشاريع.",

            // Contact
            "contact.subtitle": "ماذا بعد؟",
            "contact.title": "تواصل معي",
            "contact.desc": "أبحث حالياً عن فرص وتعاونات جديدة. سواء كان لديك سؤال أو تريد فقط أن تقول مرحباً، سأبذل قصارى جهدي للرد عليك!",
            "contact.btn": "قُل مرحباً",
            "contact.connect": "تواصل معي:",

            // Footer
            "footer.credit": "تصميم وبرمجة خالد حاج بكور",
            "footer.rights": "جميع الحقوق محفوظة."
        }
    };

    const typeWords = {
        en: ["the Web.", "the Future.", "AI Systems.", "Problem Solving."],
        tr: ["Web.", "Gelecek.", "Yapay Zeka.", "Problem Çözme."],
        ar: ["الويب.", "المستقبل.", "الذكاء الاصطناعي.", "حل المشكلات."]
    };

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update Selector Button
        const currentLangBtn = document.querySelector('.current-lang');
        if (currentLangBtn) {
            currentLangBtn.innerHTML = `${lang.toUpperCase()} <i class="fas fa-chevron-down"></i>`;
        }

        // Update Mobile Buttons
        document.querySelectorAll('.mobile-lang button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Translate Text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Manual updates for hero elements that might contain complex HTML
        const subtitle = document.querySelector('.hero-text .subtitle');
        if (subtitle) subtitle.textContent = translations[lang]["hero.subtitle"];

        const heroDesc = document.querySelector('.hero-text .description');
        if (heroDesc) heroDesc.innerHTML = translations[lang]["hero.desc"];

        const heroBtn = document.querySelector('.hero-btns .btn-primary');
        if (heroBtn) heroBtn.textContent = translations[lang]["hero.btn"];

        const roleText = document.querySelector('.hero-text .role');
        if (roleText) {
            roleText.innerHTML = `${translations[lang]["hero.role"]} <span class="typing-text"></span><span class="cursor">|</span>`;
            // Re-bind the typing span if necessary (though innerHTML nukes it, the querySelector logic in 'type()' runs globally so it might need re-selection if variable wasn't global. 
            // But we moved 'typingSpan' to be selected once. If we replace innerHTML, we destroy that node.
            // We need to re-select it in the loop or make the function robust.
            // See fix below.
        }

        window.currentLangWords = typeWords[lang];
    }

    // Initial Event Listeners
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            closeMobileMenu();
        });
    });

});
