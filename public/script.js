

document.getElementById('myform').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const receiver_email = document.getElementById('email').value; 
    const message_body = document.getElementById('message').value;

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
            first_name,
            last_name,
            receiver_email,
            message_body
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
            document.getElementById('myform').reset();
        } else {
            alert('Failed to send the message.');
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
});

const token = localStorage.getItem('authToken');

                if (!token) {

                    document.getElementById("main").style.display = "none";


                    document.getElementById('not_main').innerHTML = `
        <div>
        Please Login First To See Your Account. 
        <a href="./index.html">Click here to login</a>.
        </div>
        <br>
        <div>
        Sign Up If You Don't Have Account.
        <a href="./signup.html">Click here to sign up</a>
        </div>

    `;
                }
