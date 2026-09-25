import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from "../pages/Home/Home"
import About from "../pages/about/components/About"
import MainLayout from "../components/Layout/MainLayout"
import ScrollToTop from "../components/Layout/ScrollToTop"
import Products from "../pages/Products/components/Products"
import All from "../pages/All/components/All"
import Services from "../pages/Services/components/Services"
import Gallery from "../pages/Gallery/components/Gallery"
import Research from "../pages/Research/components/Research"
import ResearchDetail from "../pages/Research/components/ResearchDetail"
import Export from "../pages/Export/components/Export"
import JobChance from "../pages/JobChance/components/JobChance"
import ExportJob from "../pages/ExportJob/components/ExportJob"
import Contact from "../pages/Contacts/components/Contact"
import { DASHBOARD_URL } from "../services/apiClient"

// Old /login links and bookmarks: staff sign in on the backend dashboard itself.
function DashboardRedirect() {
    window.location.replace(DASHBOARD_URL)
    return null
}

function AppRoutes() {
    return (
        <BrowserRouter>

            <ScrollToTop />

            <Routes>

                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/products" element={<Products />} />

                    <Route path="/all" element={<All />} />

                    <Route path="/services" element={<Services />} />

                    {/* Quality control moved to the staff dashboard; send old links home. */}
                    <Route path="/control-quality" element={<Navigate to="/" replace />} />

                    <Route path="/gallery" element={<Gallery />} />

                    <Route path="/research" element={<Research />} />

                    <Route path="/research/:slug" element={<ResearchDetail />} />

                    <Route path="/export" element={<Export />} />

                    <Route path="/jobs" element={<JobChance />} />

                    <Route path="/jobs-export" element={<ExportJob />} />

                    <Route path="/login" element={<DashboardRedirect />} />

                    <Route path="/contact" element={<Contact />} />

                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes