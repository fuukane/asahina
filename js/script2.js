document.body.classList.add('loading');

function handlePageLoad() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.visibility = 'hidden';
    }
    
    document.body.classList.remove('loading');
    
    try {
        setupNavigation();
        setupBackgroundAnimation();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loadTimeout = setTimeout(() => {
        handlePageLoad();
    }, 3000);

    window.addEventListener('load', function() {
        clearTimeout(loadTimeout);
        setTimeout(handlePageLoad, 300);
    });
});

window.addEventListener('scroll', handleScroll);


function handleScroll() {
    const header = document.querySelector('.site-header');
    header.classList.toggle('scrolled', window.scrollY > 100);
    
    const homeBg = document.querySelector('.background-container');
    const aboutBg = document.querySelector('.about-bg-container');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    
    if (homeSection && aboutSection && homeBg && aboutBg) {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        const aboutSectionTop = aboutSection.offsetTop;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < homeSectionBottom) {
            homeBg.style.display = 'block';
            aboutBg.style.display = 'none';
        } else if (scrollPosition >= aboutSectionTop) {
            homeBg.style.display = 'none';
            aboutBg.style.display = 'block';
        } else {
            homeBg.style.display = 'block';
            aboutBg.style.display = 'none';
        }
    }
}

function setupNavigation() {
    document.querySelectorAll('a[href="#home"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const heroSection = document.getElementById('home');
            if (heroSection) {
                heroSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupBackgroundAnimation() {
    const background = document.querySelector('.background-image');
    const zoomInDuration = 10000;
    const pauseDuration = 5000;
    const zoomOutDuration = 10000;
    const initialDelay = 1000;

    function animate() {
        setTimeout(() => {
            background.classList.add('zoom-in');
            background.classList.remove('zoom-out');
            
            setTimeout(() => {
                setTimeout(() => {
                    background.classList.remove('zoom-in');
                    background.classList.add('zoom-out');
                    
                    setTimeout(() => {
                        animate();
                    }, zoomOutDuration);
                }, pauseDuration);
            }, zoomInDuration);
        }, initialDelay);
    }
    
    animate();
}