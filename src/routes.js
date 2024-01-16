/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import HomePage from "./views/Pages/HomePage/";
import Profile from "./views/Pages/ProfilePage";
import DataVisualizer from "./views/Pages/UserDataVisualizerPage";
import RegisterUser from "./views/Pages/UserRegistrationPage/";
import DeviceManager from "./views/Pages/DeviceManagementPage";
import CreateLocation from "./views/Pages/LocationCreationPage";
import ManageLocations from "./views/Pages/LocationManagementPage";
import UserManagement from "./views/Pages/UserManagementPage/";
import LoadingPage from "./views/Pages/LoadingPage";


let routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: HomePage,
    layout: "/admin",
    exposed: true
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    exposed: false
  },
  {
    path: "/data-visualizer",
    name: "Data Visualizer",
    icon: "fas fa-chart-line text-yellow",
    component: DataVisualizer,
    layout: "/admin",
    exposed: false
  },
  {
    path: "/register-user",
    name: "Register a New User",
    icon: "ni ni-circle-08 text-pink",
    component: RegisterUser,
    layout: "/admin",
    exposed: false
  },
  {
    path: "/manage-users",
    name: "Manage Users",
    icon: "ni ni-circle-08 text-pink",
    component: UserManagement,
    layout: "/admin",
    exposed: true
  },
  {
    path: "/manage-devices",
    name: "Manage Devices",
    icon: "ni ni-watch-time text-red",
    component: DeviceManager,
    layout: "/admin",
    exposed: true
  },
  {
    path: "/manage-locations",
    name: "Manage Locations",
    icon: "fas fa-map-marked-alt text-green",
    component: ManageLocations,
    layout: "/admin",
    exposed: true
  },
  {
    path: "/create-location",
    name: "Create a Location",
    icon: "ni ni-map-big text-green",
    component: CreateLocation,
    layout: "/admin",
    exposed: false
  },
  {
    path: "/loading",
    name: "Loading",
    icon: "ni ni-key-25 text-info",
    component: LoadingPage,
    layout: "/admin",
    exposed: false
  }
];
export default routes;
