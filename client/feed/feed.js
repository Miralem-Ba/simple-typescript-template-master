const roletest = async () => {
    jwtToken = localStorage.getItem('Token');
  
    try {
      const response = await fetch('http://localhost:4200/permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwtToken }), // Pass jwtToken as an object property
      });
  
      if (response.ok) {
        const result = await response.json();
        const { permission } = result;
        if (permission === true) {
          return true;
        }
        return false;
      }
      console.error('Fehler bei der Übertragung:', response.statusText);
    } catch (error) {
      console.error('Fehler beim Fetch:', error);
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const postWindow = document.getElementById('Feedwindow');
    const showTweets = async () => {
      try {
        const respons = await fetch('http://localhost:4200/getPost', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (respons.ok) {
          const result = await respons.json();
          const { allpost } = result;
          const permissionsCheckResult = await roletest();
          for (let i = 0; i < allpost.length; i++) {
            if (permissionsCheckResult === true) {
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
                  <button class="text-gray-500 hover:underline ml-2" name="commentButton" id="${allpost[i].tweet_id}">Comment</button>
                  <button class="text-red-500 hover:underline ml-2" name="deleteButton" id="${allpost[i].tweet_id}">Delete</button>
              </div>
          </div>
          `;
              postWindow.innerHTML += post;
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
                  <button class="text-gray-500 hover:underline ml-2" name="commentButton" id="${allpost[i].tweet_id}">Comment</button>
              </div>
          </div>
          `;
              postWindow.innerHTML += post;
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
  
  
  
  
  
    
  
    document.getElementById('postButton').addEventListener('click', async (event) => {
      event.preventDefault();
      const postMessage = document.getElementById('postTextarea').value;
      const jwtToken = localStorage.getItem('Token');
      try {
        const response = await fetch('http://localhost:4200/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postMessage, jwtToken }),
        });
        if (response.ok) {
          console.log('Post erfolgreich gespeichert');
        } else {
          console.error('Fehler bei der Speicherung des Postes:', response.statusText);
        }
      } catch (error) {
        console.error('Netzwerkfehler:', error);
      }
    });
  
  
  
  
  
  
  
    document.getElementById('Feedwindow').addEventListener('click', async (event) => {
      const { target } = event;
  
      if (target.getAttribute('name') === 'deleteButton') {
        const postId = target.id;
  
        try {
          const response = await fetch('http://localhost:4200/deletePost', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
          });
          if (response.ok) {
            console.log('DELET erfolgreich gespeichert');
          } else {
            console.error('Fehler bei der Löschung des Postes:', response.statusText);
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error);
        }
      } else if (target.getAttribute('name') === 'likeButton') {
        const postId = target.id;
        try {
          const response = await fetch('http://localhost:4200/like', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
          });
          if (response.ok) {
            console.log('Like erfolgreich gespeichert');
          } else {
            console.error('Fehler beim liken des Postes:', response.statusText);
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error);
        }
      } else if (target.getAttribute('name') === 'dislikeButton') {
        const postId = target.id;
        try {
          const response = await fetch('http://localhost:4200/dislike', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
          });
          if (response.ok) {
            console.log('Like erfolgreich gespeichert');
          } else {
            console.error('Fehler beim liken des Postes:', response.statusText);
          }
        } catch (error) {
          console.error('Netzwerkfehler:', error);
        }
      }
  
  
      else if (target.getAttribute('name') === 'commentButton') {
        const postId = target.id;
        const register = 'comment/comment.html';
        window.location.href = `/${register}?postId=${postId}`;
      }
    });
  });
  
  
  