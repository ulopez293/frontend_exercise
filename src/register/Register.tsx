import { Button, Card, Label, TextInput } from 'flowbite-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface RegisterResponse {
    message: string
    user: {
        name: string
        email: string
    }
}

export const Register = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    // Actualizamos esta función para evitar promesas en el onSubmit
    const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userData = { name, email, password }

        try {
            const response: Response = await fetch(`${import.meta.env.VITE_URL_API}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const data = await response.json() as RegisterResponse
                setError(data.message || 'Hubo un error al registrar el usuario.')
                return
            }
            const data = await response.json() as RegisterResponse
            setSuccess(data.message || 'Usuario registrado exitosamente')
            setTimeout(() => {
                void navigate('/')
            }, 2000)
        } catch (error) {
            alert(error)
            setError('Error de conexión, por favor inténtalo más tarde.')
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        void handleRegisterSubmit(e)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-sm p-8">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="Nombre" />
                        </div>
                        <TextInput id="name" type="text" placeholder="Tu nombre" required value={name} onChange={handleNameChange} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Correo electrónico" />
                        </div>
                        <TextInput id="email" type="email" placeholder="example@frontend.com" required value={email} onChange={handleEmailChange} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Contraseña" />
                        </div>
                        <TextInput id="password" minLength={6} type="password" placeholder="********" required value={password} onChange={handlePasswordChange} />
                    </div>

                    {/* Mostrar mensajes de error o éxito */}
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <Button type="submit">Crear Usuario</Button>
                    <div className='text-center initial w-full'>
                        <Link to="/">
                            <Button>Volver</Button>
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}
