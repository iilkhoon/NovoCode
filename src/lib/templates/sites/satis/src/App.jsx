import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Login from "./components/Login";
import Shell from "./components/Shell";
import Overview from "./components/Overview";
import Customers from "./components/Customers";
import Deals from "./components/Deals";
import { seed } from "./seed";

seed();

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("overview");
  if (!user) return <Login />;
  return (
    <Shell page={page} onPage={setPage} user={user}>
      {page === "overview" && <Overview onPage={setPage} user={user} />}
      {page === "customers" && <Customers />}
      {page === "deals" && <Deals />}
    </Shell>
  );
}
