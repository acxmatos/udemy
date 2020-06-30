import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// getInitialProps is executed on the React server!
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
