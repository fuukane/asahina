document.body.classList.add('loading');

document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();

    const loadingOverlay = document.querySelector('.loading-overlay');
    
    window.addEventListener('load', function() {
        hideLoadingSpinner(loadingOverlay);
    });
    
    setTimeout(function() {
        hideLoadingSpinner(loadingOverlay);
    }, 3000);
});

function hideLoadingSpinner(loadingOverlay) {
    if (!loadingOverlay) return;
    
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.visibility = 'hidden';
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    initializeSiteFunctions();
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initializeSiteFunctions() {
    handleScroll();
    setupNavigation();
    setupBackgroundAnimation();
    setupAlbumVisibility();
    setupTrackToggles();
    setupDiscographyTabs();
    setupAudioPlayer();
    setupScrollToTop();
    setupAlbumAnimation();
}

window.addEventListener('scroll', handleScroll);

function handleScroll() {
    const header = document.querySelector('.site-header');
    const homeBg = document.querySelector('.background-container');
    const aboutBg = document.querySelector('.about-bg-container');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    
    header.classList.toggle('scrolled', window.scrollY > 100);
    
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

function setupAlbumVisibility() {
    const albumSection = document.querySelector('.latest-song');
    
    function checkVisibility() {
        const rect = albumSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            albumSection.classList.add('visible');
            window.removeEventListener('scroll', checkVisibility);
        }
    }
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
}

function setupTrackToggles() {
    document.querySelectorAll('.more-toggle').forEach(toggle => {
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackContainer = this.closest('.track');
            const moreContainer = trackContainer.querySelector('.more-container');

            if (!moreContainer) return;

            document.querySelectorAll('.track .more-container.show').forEach(open => {
                if (open !== moreContainer) {
                    open.classList.remove('show');
                    open.closest('.track').querySelector('.more-toggle').textContent = 'MORE';
                }
            });

            const isShowing = moreContainer.classList.toggle('show');
            this.textContent = isShowing ? 'LESS' : 'MORE';

            if (isShowing) {
                setTimeout(() => {
                    moreContainer.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 10);
            }
        });
    });
}


function setupDiscographyTabs() {
    const albumBtn = document.querySelector('.album-btn');
    const singleEpsBtn = document.querySelector('.single-eps-btn');
    const albumList = document.querySelector('.album-list');
    const singleEpsList = document.querySelector('.single-eps-list');
    
    albumList.classList.add('active');
    singleEpsList.classList.remove('active');
    
    function animateItemsIn(items) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.classList.add('visible');
            }, index * 100);
        });
    }
    
    function animateItemsOut(items) {
        return new Promise((resolve) => {
            let animationsCompleted = 0;
            const totalItems = items.length;
            
            if (totalItems === 0) {
                resolve();
                return;
            }
            
            items.forEach((item) => {
                item.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.classList.remove('visible');
                
                const onTransitionEnd = () => {
                    animationsCompleted++;
                    if (animationsCompleted === totalItems) {
                        resolve();
                    }
                    item.removeEventListener('transitionend', onTransitionEnd);
                };
                
                item.addEventListener('transitionend', onTransitionEnd);
            });
        });
    }
    
    albumBtn.addEventListener('click', async function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        singleEpsBtn.classList.remove('active');
        
        await animateItemsOut(document.querySelectorAll('.single-eps-item'));
        
        singleEpsList.classList.remove('active');
        albumList.classList.add('active');
        
        animateItemsIn(document.querySelectorAll('.album-item'));
    });
    
    singleEpsBtn.addEventListener('click', async function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        albumBtn.classList.remove('active');
        
        await animateItemsOut(document.querySelectorAll('.album-item'));
        
        albumList.classList.remove('active');
        singleEpsList.classList.add('active');
        
        animateItemsIn(document.querySelectorAll('.single-eps-item'));
    });
    
    animateItemsIn(document.querySelectorAll('.album-item'));
}

function setupAudioPlayer() {
    const audioPlayer = document.getElementById('song-player');
    let currentlyPlaying = null;
    
    document.querySelectorAll('.track-title').forEach(title => {
        title.addEventListener('click', function() {
            const track = this.closest('.track');
            const songSrc = track.dataset.songSrc;
            
            if (currentlyPlaying === track) {
                audioPlayer.pause();
                track.querySelector('.track-title').classList.remove('playing');
                currentlyPlaying = null;
                return;
            }
            
            if (currentlyPlaying) {
                currentlyPlaying.querySelector('.track-title').classList.remove('playing');
            }
            
            audioPlayer.src = songSrc;
            audioPlayer.play()
                .then(() => {
                    this.classList.add('playing');
                    currentlyPlaying = track;
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                });
        });
    });

    audioPlayer.addEventListener('ended', function() {
        if (currentlyPlaying) {
            currentlyPlaying.querySelector('.track-title').classList.remove('playing');
            currentlyPlaying = null;
        }
    });
}

function setupScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }, 100);
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.classList.remove('visible');
    });
}

function setupAlbumAnimation() {
    const discographySection = document.querySelector('.discography-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeList = document.querySelector('.album-list.active, .single-eps-list.active');
                if (activeList) {
                    const items = activeList.querySelectorAll('.album-item, .single-eps-item');
                    animateItemsInOnScroll(items);
                }
            } else {
                const activeList = document.querySelector('.album-list.active, .single-eps-list.active');
                if (activeList) {
                    const items = activeList.querySelectorAll('.album-item, .single-eps-item');
                    animateItemsOutOnScroll(items);
                }
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(discographySection);
}

function animateItemsInOnScroll(items) {
    items.forEach((item, index) => {
        if (item.classList.contains('visible')) return;
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.classList.add('visible');
        }, index * 100);
    });
}

function animateItemsOutOnScroll(items) {
    items.forEach(item => {
        if (!item.closest('.active')) return;
        
        item.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.classList.remove('visible');
    });
}