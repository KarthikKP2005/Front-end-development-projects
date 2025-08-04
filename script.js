// <!-- Place this at the end of your body in the HTML -->

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const username = form.querySelector('input[type="text"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Login successful!");
        // Redirect to dashboard or homepage
        window.location.href = "dashboard.html"; // Adjust as needed
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});

