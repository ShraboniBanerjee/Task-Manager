import Routes from "./routes";
import UserProvider from "./providers/UserProvider";

function App() {
  return (
    <>
      <UserProvider>
        <Routes />
      </UserProvider>
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          zIndex: "1000",
        }}
      >
      </div>
    </>
  );
}

export default App;
