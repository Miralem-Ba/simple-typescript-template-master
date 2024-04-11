// Deaktiviert ESLint-Warnungen über nicht definierte Variablen.
/* eslint-disable no-undef */

// Wartet darauf, dass das gesamte DOM geladen ist, bevor JavaScript-Code ausgeführt wird.
document.addEventListener('DOMContentLoaded', () => {
  // Fügt einen Event-Listener für den 'Login' Navigationsbutton hinzu.  
  document.getElementById('loginNavigationButton').addEventListener('click', () => {
    // Definiert den Pfad zur Login-Seite.  
    const login = '../index.html';
    // Leitet den Benutzer zur Login-Seite um.
      window.location.href = `/${login}`;
    }); 

    // Fügt einen Event-Listener für das Absenden des Registrierungsformulars hinzu.
    document.getElementById('registrationForm').addEventListener('submit', async (event) => {
      // Verhindert das Standardverhalten des Formulars, welches die Seite neu laden würde.
      event.preventDefault();

      // Holt die Benutzerdaten aus den Formularfeldern.
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const email = document.getElementById('email').value;
      try {

        // Sendet eine POST-Anfrage an den Server, um den neuen Benutzer zu registrieren.
        const response = await fetch('http://localhost:4200/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          // Konvertiert die Benutzerdaten in einen JSON-String für den Request.
          body: JSON.stringify({ username, password, email }),
        });

        // Überprüft, ob die Anfrage erfolgreich war.
        if (response.ok) {
          console.log('Registrierung erfolgreich.'); // Gibt eine Erfolgsmeldung in der Konsole aus.
        } else {
          // Gibt eine Fehlermeldung in der Konsole aus, falls die Anfrage fehlschlägt.
          console.error('Fehler bei der Registrierung:', response.statusText);
        }
      } catch (error) {

        // Fängt Netzwerkfehler ab und gibt eine Fehlermeldung in der Konsole aus.
        console.error('Netzwerkfehler:', error);
      }
    });
  });  