import { CompanyInfoProvider } from "./hooks/useCompanyInfo"
import AppRoutes from "./routes/AppRoutes"


function App() {
  return (
    <div>
      <CompanyInfoProvider>
        <AppRoutes />
      </CompanyInfoProvider>
    </div>
  )
}

export default App
