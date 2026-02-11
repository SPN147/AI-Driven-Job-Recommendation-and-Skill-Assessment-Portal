import RecruiterNavbar from "@/components/shared/RecruiterNavbar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ ADDED

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <RecruiterNavbar />

      {/* TOASTS */}
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ ADDED */}

      {/* PAGE CONTENT */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default RecruiterLayout;
