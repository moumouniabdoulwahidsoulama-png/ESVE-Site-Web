<?php
// Activation de l'affichage des erreurs pour le débogage (à désactiver en production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Inclure PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Fonction pour envoyer une réponse JSON
function sendJsonResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Vérifier que la requête est bien en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Méthode non autorisée.');
}

// Récupérer et nettoyer les données
$nom = isset($_POST['nom']) ? strip_tags(trim($_POST['nom'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$sujet = isset($_POST['sujet']) ? strip_tags(trim($_POST['sujet'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
$telephone = isset($_POST['telephone']) ? strip_tags(trim($_POST['telephone'])) : '';
$societe = isset($_POST['societe']) ? strip_tags(trim($_POST['societe'])) : '';

// Validation des champs obligatoires
if (empty($nom) || empty($email) || empty($message)) {
    sendJsonResponse(false, 'Veuillez remplir tous les champs obligatoires.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, 'Adresse email invalide.');
}

// Préparer le contenu de l'email
$contenu = "Nom : $nom\n";
if (!empty($societe)) $contenu .= "Société : $societe\n";
if (!empty($telephone)) $contenu .= "Téléphone : $telephone\n";
$contenu .= "Email : $email\n";
$contenu .= "Sujet : $sujet\n\n";
$contenu .= "Message :\n$message\n";

// Configuration de PHPMailer
$mail = new PHPMailer(true);

try {
    // Paramètres du serveur SMTP (à modifier selon votre hébergeur)
    $mail->isSMTP();
    $mail->Host       = 'smtp.example.com';      // Remplacez par votre serveur SMTP
    $mail->SMTPAuth   = true;
    $mail->Username   = 'votre@email.com';       // Votre adresse email
    $mail->Password   = 'votre-mot-de-passe';    // Mot de passe
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // ou 'ssl'
    $mail->Port       = 587;                      // Port (587 pour TLS, 465 pour SSL)

    // Expéditeur et destinataire
    $mail->setFrom($email, $nom);                 // Adresse de l'expéditeur (le visiteur)
    $mail->addAddress('direction@svequipement.com');          // Remplacez par votre adresse de réception
    $mail->addReplyTo($email, $nom);               // Pour répondre directement au visiteur

    // Contenu de l'email
    $mail->isHTML(false);                          // Format texte brut
    $mail->Subject = "Message de $nom - $sujet";
    $mail->Body    = $contenu;

    $mail->send();
    sendJsonResponse(true, 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.');
} catch (Exception $e) {
    sendJsonResponse(false, "L'envoi a échoué. Erreur: {$mail->ErrorInfo}");
}
?>