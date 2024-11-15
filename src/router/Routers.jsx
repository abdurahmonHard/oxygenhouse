import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Towns from "../pages/Towns";
import SalesDepartment from "../pages/SalesDepartments";
import Login from "../pages/login";
import Layout from "../layout/Layout";
import Customers from "../pages/Customers";
import Buildings from "../pages/Buildings";
import Apartments from "../pages/Apartments";
import PrivateRoute from "../router/PrivateRouter/PrivateRoute";
import DetailsBuilding from "../components/buildings/DetailsBuilding";
import SalesBuildings from "../components/sales-department/SalesBuildings";
import SalesHeader from "../components/sales-department/SalesHeader";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import PageNotFound from "../pages/PageNotFound";
import Profile from "../pages/Profile";
import BusyApartments from "../pages/BusyApartments";
import Reports from "../pages/Reports";
import Orders from "../pages/Orders";
import ServerErrorPage from "../pages/ServerErrorPage";
import Settings from "../pages/Settings";
import Cassier from "../pages/Cassier";
import SettingCaisher from "../pages/SettingCaisher";
import CencelOrders from "../pages/CencelOrders";
import OrderApartments from "../pages/OrderApartments";
import DollarCourses from "../pages/DollarCourses";
import CaisherReport from "../pages/CaisherReport";
import SoldOutClientsReports from "../pages/SoldOutClientsReports";
import ComplatedOrders from "../pages/ComplatedOrders";
import SummaryReport from "../pages/SummaryReport";

export default function Routers() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/page-not-found" element={<PageNotFound />} />
      <Route path="/error-page" element={<ServerErrorPage />} />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <PrivateRoute path="/">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute path="/projects">
              <Towns />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales-department"
          element={
            <PrivateRoute path="/sales-department">
              <SalesDepartment />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales-department/details"
          element={
            <PrivateRoute path="/sales-department/details">
              <SalesBuildings />
            </PrivateRoute>
          }
        />
        <Route
          path="/sales-department/details/type/:id"
          element={
            <PrivateRoute path="/sales-department/details/type/:id">
              <SalesHeader />
            </PrivateRoute>
          }
        />
        <Route
          path="/buildings"
          element={
            <PrivateRoute path="/buildings">
              <Buildings />
            </PrivateRoute>
          }
        />
        <Route
          path="/buildings/details/:id"
          element={
            <PrivateRoute path="/buildings/details/:id">
              <DetailsBuilding />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute path="/reports">
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute path="/orders">
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/apartments"
          element={
            <PrivateRoute path="/apartments">
              <Apartments />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/*"
          element={
            <PrivateRoute path="/customers/*">
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute path="/users">
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/busy-apartments"
          element={
            <PrivateRoute path="/busy-apartments">
              <BusyApartments />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute path="/settings">
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/cassier"
          element={
            <PrivateRoute path="/cassier">
              <Cassier />
            </PrivateRoute>
          }
        />
        <Route
          path="/setting-caisher"
          element={
            <PrivateRoute path="/setting-caisher">
              <SettingCaisher />
            </PrivateRoute>
          }
        />
        <Route
          path="/canceled-orders"
          element={
            <PrivateRoute path="/canceled-orders">
              <CencelOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-apartments"
          element={
            <PrivateRoute path="/order-apartments">
              <OrderApartments />
            </PrivateRoute>
          }
        />
        <Route
          path="/dollar-courses"
          element={
            <PrivateRoute path="/dollar-courses">
              <DollarCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/caisher-report"
          element={
            <PrivateRoute path="/caisher-report">
              <CaisherReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/sold-out-clients-report"
          element={
            <PrivateRoute path="/sold-out-clients-report">
              <SoldOutClientsReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/complated-orders"
          element={
            <PrivateRoute path="/complated-orders">
              <ComplatedOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/summary-report"
          element={
            <PrivateRoute path="/summary-report">
              <SummaryReport />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Route>
    </Routes>
  );
}
