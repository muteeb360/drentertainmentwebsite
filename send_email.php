<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "muteebbutt1819@gmail.com";   // <-- your email
    $subject = "New Contact Form Message";

    $body = "Email: $email\n\nMessage:\n$message";

    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "OK"; // success
    } else {
        echo "ERROR"; // failed
    }
}
?>