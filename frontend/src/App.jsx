 
import AuthInitializer from "./components/common/AuthInitializer";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthInitializer>
      <AppRouter />
    </AuthInitializer>
  );
}

export default App;
