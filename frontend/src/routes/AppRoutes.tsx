import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home/Home"
import About from "../pages/about/components/About"
import MainLayout from "../components/Layout/MainLayout"
import Products from "../pages/Products/components/Products"
import All from "../pages/All/components/All"
import Services from "../pages/Services/components/Services"
import ControlQuality from "../pages/controlQuality/components/ControlQuality"
import Gallery from "../pages/Gallery/components/Gallery"
import Research from "../pages/Research/components/Research"
import ResearchDetail from "../pages/Research/components/ResearchDetail"
import Export from "../pages/Export/components/Export"
import JobChance from "../pages/JobChance/components/JobChance"
import ExportJob from "../pages/ExportJob/components/ExportJob"
import Login from "../pages/Login/components/Login"
import Contact from "../pages/Contacts/components/Contact"

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />

                    <Route path="/about" element={<About />} />

                    <Route path="/products" element={<Products />} />

                    <Route path="/all" element={<All />} />

                    <Route path="/services" element={<Services />} />

                    <Route path="/control-quality" element={<ControlQuality />} />

                    <Route path="/gallery" element={<Gallery />} />

                    <Route path="/research" element={<Research />} />

                    <Route path="/research/:slug" element={<ResearchDetail />} />

                    <Route path="/export" element={<Export />} />

                    <Route path="/jobs" element={<JobChance />} />

                    <Route path="/jobs-export" element={<ExportJob />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/contact" element={<Contact />} />

                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes