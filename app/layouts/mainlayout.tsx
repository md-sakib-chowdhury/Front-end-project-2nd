import { Outlet } from "react-router";
import Navbar from "../shared/Navbar";

export default function MainLayout() {
    return (
        <div>
            <Navbar />
            {/* <Outlet /> */}
        </div>
    );
}