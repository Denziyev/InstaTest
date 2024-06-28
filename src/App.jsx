// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import NavigationPage from "../src/layout/NavigationPage";
import InstagramHome from "../src/pages/InstagramHome";
import Auth from "../src/pages/Auth";
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminRoute from './components/AdminPanel/AdminRoute';
import { Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
// import routes from "./routes/routes";

// const router = createBrowserRouter(routes);

function App() {
  // return <RouterProvider router={router} />;
  const [authUser] = useAuthState(auth);

  return (
    <NavigationPage>
      <Routes>
        <Route
          path="/"
          element={authUser ? <InstagramHome /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!authUser ? <Auth /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/:username" element={<ProfilePage />} />
      </Routes>
    </NavigationPage>
  );
}

export default App;
