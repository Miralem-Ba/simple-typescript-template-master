/* eslint-disable no-undef */
// Fügt einen Event-Listener hinzu, der auf das Laden des DOMs wartet.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerNavigationButton').addEventListener('click', () => { // Event-Listener für den Klick auf den Registrierungs-Navigationsbutton.
    const register = 'authentication/register.html'; // Pfad zur Registrierungsseite.
    window.location.href = `/${register}`; // Leitet den Benutzer zur Registrierungsseite um.
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => { // Event-Listener für das Absenden des Anmeldeformulars.
    event.preventDefault(); // Verhindert die Standardaktion des Formulars, um die Seite nicht neu zu laden.

    // Sammelt Benutzernamen und Passwort aus den Formulareingaben.
    const LoginUsername = document.getElementById('loginUsername').value;
    const LoginPassword = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('http://localhost:4200/login', { // Sendet eine POST-Anfrage mit den Anmeldeinformationen an den Server.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ LoginPassword, LoginUsername }),
      });

      if (response.ok) { // Überprüft, ob die Anfrage erfolgreich war.
        const result = await response.json(); // Extrahiert das Token aus der Antwort.
        const { token } = result;
        console.log('Login erfolgreich.');
        localStorage.setItem('Token', token); // Speichert das Token im Local Storage des Browsers.
        const feed = 'feed/feed.html'; // Pfad zur Feed-Seite.
        window.location.href = `/${feed}`; // Leitet den Benutzer zur Feed-Seite um.
      } else {
        console.error('Fehler beim Login:', response.statusText); // Protokolliert einen Fehler, wenn die Anmeldung fehlschlägt.
      }
    } catch (error) { 
      console.error('Netzwerkfehler:', error); // Protokolliert Netzwerkfehler.
    }
  });
});