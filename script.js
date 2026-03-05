// Menu hamburger pour mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Animation au défilement
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, #0f1a24, #0a1219)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #1a2a3a, #0f1a24)';
        navbar.style.padding = '1rem 0';
    }
});

// Smooth scroll pour les liens
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation des cartes au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .stat-item, .gallery-img').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// Gestion du formulaire de contact
// Gestion du formulaire de contact avec envoi AJAX vers PHPMailer
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // Récupération des données du formulaire
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries()); // Convertit en objet simple

        // Désactiver le bouton pendant l'envoi
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Envoi en cours...';

        try {
            // Envoi des données vers le script PHP (ajustez le chemin selon votre structure)
            const response = await fetch('contact/send_contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data) // Convertit l'objet en format URL-encoded
            });

            const result = await response.json();

            if (result.success) {
                // Succès : afficher un message et vider le formulaire
                alert(result.message || 'Message envoyé avec succès !');
                contactForm.reset();
            } else {
                // Erreur retournée par le PHP
                alert('Erreur : ' + (result.message || 'Échec de l\'envoi.'));
            }
        } catch (error) {
            alert('Erreur réseau ou serveur indisponible.');
            console.error(error);
        } finally {
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
}

// Extraction du logo depuis le fichier (simulé)
document.addEventListener('DOMContentLoaded', () => {
    // Note: Le logo devra être extrait manuellement du document Word
    // et sauvegardé dans images/logo.png
    console.log('Noubliez pas d\'extraire le logo du document et de le placer dans images/logo.png');
});