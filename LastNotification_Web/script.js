function exploreGame() {
    // Menüden geçiş yaparken tam odaklanması için "about" kısmına yumuşak kaydırır
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
}