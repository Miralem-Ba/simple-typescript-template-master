// Definiert eine asynchrone Funktion, um die Berechtigung des Benutzers zu prüfen.
const roletest = async () => {
    jwtToken = localStorage.getItem('Token'); // Holt das JWT-Token aus dem Local Storage.
  
    try {
      const response = await fetch('http://localhost:4200/permission', { // Sendet eine POST-Anfrage an den Server, um die Berechtigung zu prüfen.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwtToken }), // Übergibt jwtToken als Objekteigenschaft.
      });
  
      if (response.ok) { // Prüft, ob die Anfrage erfolgreich war.
        const result = await response.json();
        const { permission } = result;
        if (permission === true) { // Gibt true zurück, wenn die Berechtigungsprüfung positiv ist.
          return true;
        }
        return false;
      }
      console.error('Fehler bei der Übertragung:', response.statusText);
    } catch (error) {
      console.error('Fehler beim Fetch:', error);
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => { // Wartet auf das Laden des DOM, bevor der Code ausgeführt wird.
    const postWindow = document.getElementById('Feedwindow'); // Referenz auf das Element, in dem die Posts angezeigt werden.
    const showTweets = async () => { // Definiert eine asynchrone Funktion, um Tweets anzuzeigen.
      try {
        const respons = await fetch('http://localhost:4200/getPost', { // Sendet eine GET-Anfrage, um alle Posts zu erhalten.
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (respons.ok) { // Prüft, ob die Anfrage erfolgreich war.
          const result = await respons.json();
          const { allpost } = result;
          const permissionsCheckResult = await roletest(); // Prüft, ob der Benutzer Berechtigungen zum Löschen hat.
          for (let i = 0; i < allpost.length; i++) {
            if (permissionsCheckResult === true) { // Durchläuft alle erhaltenen Posts.
              const post = ` 
            <div class="dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-1/2 mx-auto">
              <div>
                  <span class="font-semibold text-white">${allpost[i].username}</span>
              </div>
              <p class="text-white">${allpost[i].content}</p>
              <div class="mt-2">
                  <p class="text-white">${allpost[i].post_like}</p>
                  <button class="text-blue-500 hover:underline" name="likeButton" id="${allpost[i].tweet_id}">Like / </button>
                  <button class="text-blue-500 hover:underline" name="dislikeButton" id="${allpost[i].tweet_id}">Dislike</button>
                  <button class="text-blue-500 hover:underline ml-2" name="commentButton" id="${allpost[i].tweet_id}">Comment</button>
                  <button class="text-red-500 hover:underline ml-2" name="deleteButton" id="${allpost[i].tweet_id}">Delete</button>
              </div>
          </div>
          `;
              postWindow.innerHTML += post; // Fügt das erstellte HTML-Element zum Feed-Fenster hinzu.
            } else {
              const post = `
            <div class="dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-1/2 mx-auto">
              <div>
                  <span class="font-semibold text-white">${allpost[i].username}</span>
              </div>
              <p class="text-white">${allpost[i].content}</p>
              <div class="mt-2">
                  <p class="text-white">${allpost[i].post_like}</p>
                  <button class="text-blue-500 hover:underline" name="likeButton" id="${allpost[i].tweet_id}">Like / </button>
                  <button class="text-blue-500 hover:underline" name="dislikeButton" id="${allpost[i].tweet_id}">Dislike</button>
                  <button class="text-blue-500 hover:underline ml-2" name="commentButton" id="${allpost[i].tweet_id}">Comment</button>
              </div>
          </div>
          `;
              postWindow.innerHTML += post; // Fügt das erstellte HTML-Element zum Feed-Fenster hinzu.
            }
          }
        } else {
          console.error('Fehler beim Auslesen der Posts', respons.statusText);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Tweets', error);
      }
    };

    showTweets();
  
    document.getElementById('postButton').addEventListener('click', async (event) => { // Event-Listener für den 'Post' Button, um das Formular für neue Posts zu verarbeiten.
      event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars.
      const postMessage = document.getElementById('postTextarea').value; // Holt den Text des neuen Posts.
      const jwtToken = localStorage.getItem('Token'); // Holt das JWT-Token aus dem Local Storage.
      try {
        const response = await fetch('http://localhost:4200/createPost', { // Versendet den neuen Post mittels POST-Anfrage an den Server.
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postMessage, jwtToken }), // Sendet Nachricht und Token im Request.
        });
        if (response.ok) {
          console.log('Post erfolgreich gespeichert'); // Bestätigung im Konsolenlog.
        } else {
          console.error('Fehler bei der Speicherung des Postes:', response.statusText); // Fehlermeldung im Konsolenlog.
        }
      } catch (error) {
        console.error('Netzwerkfehler:', error); // Fehlermeldung bei Netzwerkproblemen.
      }
    });
  
    document.getElementById('Feedwindow').addEventListener('click', async (event) => { // Event-Listener für das Feed-Fenster, um auf Klicks auf Like-, Dislike-, Kommentar- und Löschbuttons zu reagieren.
      const { target } = event; // Das angeklickte Element.
  
      // Behandelt das Löschen von Posts.
      if (target.getAttribute('name') === 'deleteButton') {
        const postId = target.id; // Die ID des zu löschenden Posts.
  
        try {
          // Sendet die Anfrage, um den Post zu löschen.
          const response = await fetch('http://localhost:4200/deletePost', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }), // Übergibt die Post-ID im Request.
          });
          if (response.ok) {
            console.log('DELET erfolgreich gespeichert'); // Bestätigung im Konsolenlog.
          } else {
            console.error('Fehler bei der Löschung des Postes:', response.statusText); // Fehlermeldung im Konsolenlog.
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error); // Fehlermeldung bei Netzwerkproblemen.
        }

        // Reagiert auf Klicks auf den Like-Button.
      } else if (target.getAttribute('name') === 'likeButton') {
        const postId = target.id; // Die ID des Posts, der geliked werden soll.
        try {
          // Sendet eine Anfrage, um den Post zu liken.
          const response = await fetch('http://localhost:4200/like', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }), // Sendet die Post-ID im Body der Anfrage.
          });
          if (response.ok) {
            console.log('Like erfolgreich gespeichert'); // Bestätigung im Konsolenlog.
          } else {
            console.error('Fehler beim liken des Postes:', response.statusText); // Zeigt Fehlermeldung, wenn das Liken fehlschlägt.
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error); // Fehlermeldung bei Netzwerkproblemen.
        }
        // Reagiert auf Klicks auf den Dislike-Button.
      } else if (target.getAttribute('name') === 'dislikeButton') {
        const postId = target.id; // Die ID des Posts, der gedisliked werden soll.
        try {
          // Sendet eine Anfrage, um den Post zu disliken.
          const response = await fetch('http://localhost:4200/dislike', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }), // Sendet die Post-ID im Body der Anfrage.
          });
          if (response.ok) {
            console.log('Like erfolgreich gespeichert'); // Bestätigung im Konsolenlog.
          } else {
            console.error('Fehler beim liken des Postes:', response.statusText);  // Zeigt Fehlermeldung, wenn das Disliken fehlschlägt.
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error); // Fehlermeldung bei Netzwerkproblemen.
        }
      }
  
      
      // Reagiert auf Klicks auf den Kommentar-Button.
      else if (target.getAttribute('name') === 'commentButton') {
        const postId = target.id; // Die ID des Posts, zu dem ein Kommentar hinzugefügt werden soll.
        // Leitet den Benutzer zur Kommentarseite um und übergibt die Post-ID als URL-Parameter.
        const register = 'comment/comment.html';
        window.location.href = `/${register}?postId=${postId}`;
      }
    });
  });