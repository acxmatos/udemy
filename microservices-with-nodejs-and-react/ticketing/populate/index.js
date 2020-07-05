(async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const axios = require("axios");

  // Signup for a new user
  // User: test@test.com
  // Password: password
  let user = null;
  console.log("Creating user");
  try {
    user = await axios.post("https://ticketing.dev/api/users/signup", {
      email: "test@test.com",
      password: "password",
    });
  } catch (err) {
    if (err.response.status !== 400) {
      console.log(err.response.status);
      console.log(err.response.data.errors);
      return;
    } else {
      console.log("User exists, loggin in");
      try {
        user = await axios.post("https://ticketing.dev/api/users/signin", {
          email: "test@test.com",
          password: "password",
        });
      } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data.errors);
        return;
      }
    }
  }
  let cookie = user.headers["set-cookie"].toString();
  cookie = cookie.replace(" path=/; secure; httponly", "");
  console.log(`Cookie acquired: ${cookie}`);

  // Create tickets
  console.log("Creating tickets");
  await axios.post(
    "https://ticketing.dev/api/tickets",
    { title: "Basketball Game", price: 20 },
    { headers: { cookie } }
  );

  await axios.post(
    "https://ticketing.dev/api/tickets",
    { title: "Classical Concert", price: 100 },
    { headers: { cookie } }
  );

  await axios.post(
    "https://ticketing.dev/api/tickets",
    { title: "Rock Concert", price: 100 },
    { headers: { cookie } }
  );

  await axios.post(
    "https://ticketing.dev/api/tickets",
    { title: "Football Game", price: 40 },
    { headers: { cookie } }
  );

  console.log("Done!");
})();
