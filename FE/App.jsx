import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./src/pages/LoginPage/LoginPage";
import RegisterPage from "./src/pages/RegisterPage/RegisterPage";
import DashboardPage from "./src/pages/DashboardPage/DashboardPage";
import AnalyticsPage from "./src/pages/AnalyticsPage/AnalyticsPage";
import SharePage from "./src/pages/SharePage/SharePage";
import SettingsPage from "./src/pages/SettingsPage/SettingsPage";
import CreatePage from "./src/pages/Createpage/CreatePage";
import DeletePage from "./src/pages/DeletePage/DeletePage";
import ProtectedRoute from "./src/components/ProtectedRoutes/ProtectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/settings" element={<ProtectedRoute Component={SettingsPage}/>}/>
          <Route path="/analytics" element={<ProtectedRoute Component={AnalyticsPage}/>}/>
          <Route path="/dashboard" element={<ProtectedRoute Component={DashboardPage}/>}/>
          <Route path="/share/:listId" element={<ProtectedRoute Component={SharePage}/>}/>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/create" element={<ProtectedRoute Component={CreatePage} />}/>
          <Route path="/delete/:listId" element={<ProtectedRoute Component={DeletePage} />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
