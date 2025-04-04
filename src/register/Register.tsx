import { Button, Card, Label, TextInput } from 'flowbite-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import backgroundIMG from '../assets/img/background.jpeg'
interface RegisterResponse {
    message?: string;
    error?: string;
}
export const Register = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userData = { name, email, password }
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            })
    
            const data: RegisterResponse = await response.json() as RegisterResponse
            console.log("Data from backend:", data)
            if (!response.ok) {
                // Aquí manejas la respuesta de error correctamente
                setError(data.error ?? 'Hubo un error al registrar el usuario.')
                throw new Error(data.error ?? "Error al registrar usuario")
            }

            setSuccess(data.message ?? 'Usuario registrado exitosamente')
            alert("Usuario registrado exitosamente")
    
            setTimeout(() => {
                void navigate('/clientes')
            }, 2000)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de conexión, por favor inténtalo más tarde.'
            alert(errorMessage)
            setError(errorMessage)
        }
    }
    

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        void handleRegisterSubmit(e)
    }

    return (
        <div className="bg-cover bg-center h-screen" style={{ backgroundImage: `url(${backgroundIMG})` }}>
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-sm p-8">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Nombre" />
                            </div>
                            <TextInput id="name" type="text" placeholder="Tu nombre" required value={name} onChange={(e)=> setName(e.target.value)} />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Correo electrónico" />
                            </div>
                            <TextInput id="email" type="email" placeholder="example@gmail.com" required value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Contraseña" />
                            </div>
                            <TextInput id="password" minLength={6} type="password" placeholder="********" required value={password} onChange={(e)=> setPassword(e.target.value)} />
                        </div>

                        {/* Mostrar mensajes de error o éxito */}
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}

                        <Button type="submit">Crear Usuario</Button>
                        <hr className='mt-3 mb-3'/>
                        <div className="w-full flex justify-center">
                            <Link to="/">
                                <Button color="dark" pill size="xs">Volver</Button>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
