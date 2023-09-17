import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import CreateRequest from "./pages/Requests/CreateRequest/CreateRequest";
import Dashboard from "./pages/Dashboard/Dashboard";
import Welcome from "./pages/SignUp/welcome";
import RequestFeed from "./pages/Requests/RequestFeed/RequestFeed";

function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/requests/new" element={<CreateRequest />}></Route>
          <Route path="/requests/all" element={<RequestFeed />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/welcome" element={<Welcome />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;
