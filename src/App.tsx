import { useAtom } from 'jotai'
import { Login } from './Login/Login'
import { userDataAtom } from './atoms/userDataAtom'
import { Menu } from './components/Menu/Menu'
import useFlowBiteLoader from './hooks/Flowbite/useFlowBiteLoader'
import { Home } from './home/Home'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Register } from './register/Register'

function App() {
  useFlowBiteLoader()
  const [userData,] = useAtom(userDataAtom)
  return (
    <Router>
      <Routes>
        <Route path="/" element={userData.login ? <>
          <Menu />
          <Home />
        </> : <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App