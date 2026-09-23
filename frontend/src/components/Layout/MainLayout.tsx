import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"

import Header from "./Header"
import UpperFooter from "./UpperFooter"
import Nav from "./Nav"
import { trackPageView } from "../../services/analytics"



function MainLayout() {
    const location = useLocation()
    const lastTrackedPath = useRef<string | null>(null)

    useEffect(() => {
        // Every route under MainLayout is a public page (the dashboard is a
        // separate Django app, not part of this React tree), so tracking here
        // covers exactly the pages that should be tracked. The ref guard stops
        // React 18/19 StrictMode's dev-only double-invoke, and re-renders that
        // don't actually change the path, from double-counting a page view.
        if (lastTrackedPath.current === location.pathname) return
        lastTrackedPath.current = location.pathname
        trackPageView(location.pathname)
    }, [location.pathname])

    return (
        <>
            <Header />
            <Nav />

            <main>
                <Outlet />
            </main>

            <UpperFooter />
        </>
    )
}

export default MainLayout