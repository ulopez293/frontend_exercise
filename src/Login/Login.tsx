import { Button, Card, Label, TextInput } from 'flowbite-react'
import { FormEvent, useState } from 'react'
import IMG from '../assets/img/icon.png'
import backgroundIMG from '../assets/img/background.jpeg'
import { useAtom } from 'jotai'
import { userDataAtom } from '../atoms/userDataAtom'
import { Link } from 'react-router-dom'

interface AuthResponse {
  message: string
  token: string
  id: string
}

export const Login = () => {
  const [, setUserData] = useAtom(userDataAtom)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }


  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_API}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        }),
      })

      if (!response.ok) throw new Error("Error en la autenticación")

      const data = (await response.json()) as AuthResponse

      setUserData({ login: true, email, token: data.token, id: data.id })
      alert("Login exitoso")
      console.log("Token recibido:", data.token)
      localStorage.setItem("authToken", data.token)
    } catch (error) {
      alert("Credenciales inválidas")
      console.error("Error en login:", error)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    void handleSubmitLogin(e)
  }

  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${backgroundIMG})` }}>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm p-8">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <img src={IMG} alt="Logo" className="mx-auto" />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Tu email" />
              </div>
              <TextInput id="email1" type="email" placeholder="example@gmail.com" required value={email} onChange={handleEmailChange} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Tu password" />
              </div>
              <TextInput id="password1" type="password" placeholder='********' required value={password} onChange={handlePasswordChange} />
            </div>
            <Button type="submit">Ingresar</Button>
          </form>
          <hr className='mt-3 mb-3' />
          <div className="w-full flex justify-center">
            <Link to="/register">
              <Button color="dark" pill>Crear Usuario</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}