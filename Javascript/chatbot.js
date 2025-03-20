// Initialize EmailJS
(function() {
  emailjs.init("qg0frkxEtvXp1k6Pe"); // Replace with your EmailJS User ID
})();

document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Form values
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let message = document.getElementById("message").value;

  // Validate Email Format
  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    alert("Please enter a valid email address!");
    return;
  }

  // EmailJS parameters
  let templateParams = {
    user_name: name,
    user_email: email,
    user_phone: phone,
    user_message: message
  };

  // Send email via EmailJS
  emailjs.send("service_tt37xg6", "template_xxx", templateParams)
    .then(function(response) {
      alert("Message sent successfully!");
      document.getElementById("contactForm").reset();
    }, function(error) {
      alert("Failed to send message. Please try again later.");
      console.error("EmailJS Error:", error);
    });
});
