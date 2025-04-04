import { useAtom } from 'jotai'
import { Login } from './Login/Login'
import { userDataAtom } from './atoms/userDataAtom'
import { Menu } from './components/Menu/Menu'
import useFlowBiteLoader from './hooks/Flowbite/useFlowBiteLoader'
import { Home } from './home/Home'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Register } from './register/Register'
import { Proyectos } from './proyectos/Proyectos'

const Layout = () => {
  return (
    <div>
      <Menu />
      <main>
        <Outlet /> {/* rutas hijas */}
      </main>
    </div>
  )
}

function App() {
  useFlowBiteLoader()
  const [userData,] = useAtom(userDataAtom)
  return (
    <Router>
      <Routes>
        {/* Si el usuario está logueado, redirigir automáticamente a /clientes */}
        <Route
          path="/"
          element={userData.login ? <Navigate to="/clientes" replace /> : <Login />}
        />
        {/* Rutas protegidas, envueltas en Layout */}
        <Route element={userData.login ? <Layout /> : <Navigate to="/" replace />}>
          <Route path="/clientes" element={<Home />} />
          <Route path="/proyectos" element={<Proyectos />} />
        </Route>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App