import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./src/pages/LoginPage/LoginPage";
import RegisterPage from "./src/pages/RegisterPage/RegisterPage";
import DashboardPage from "./src/pages/DashboardPage/DashboardPage";
import AnalyticsPage from "./src/pages/AnalyticsPage/AnalyticsPage";
import SharePage from "./src/pages/SharePage/SharePage";
import SettingsPage from "./src/pages/SettingsPage/SettingsPage";
import CreatePage from "./src/pages/Createpage/CreatePage";
import DeletePage from "./src/pages/DeletePage/DeletePage";
// import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/analytics" element={<AnalyticsPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/share/:listId" element={<SharePage/>}/>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/create" element={<CreatePage/>} />
          <Route path="/delete/:listId" element={<DeletePage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
