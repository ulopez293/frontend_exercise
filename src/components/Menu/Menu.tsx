import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import IMG from '../../assets/img/icon.png'
import profileIMG from '../../assets/img/profile.jpeg'
import { useAtom } from 'jotai'
import { userDataAtom } from '../../atoms/userDataAtom'

export const Menu = () => {
  const [, setUserData] = useAtom(userDataAtom)

  return (
    <>
      <Navbar fluid rounded className="p-6 px-10 shadow-md" style={{ paddingLeft: `3rem`, paddingRight: `3rem` }}>
        <Navbar.Brand href="/">
          <img src={IMG} className="h-10 sm:h-12" alt="Logo" />
          <span className="ml-6 self-center whitespace-nowrap text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">Admin</span>
        </Navbar.Brand>
        <div className="flex md:order-2 mt-3 items-center ml-auto">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" className='me-3' img={profileIMG} rounded />
            }
          >
            <Dropdown.Item onClick={() => { 
              setUserData({ login: false, email: `` }) 
              localStorage.removeItem("authToken")
            }}>Cerrar Sesión</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="ml-auto">
          <Navbar.Link
            href="/"
            active={true}
          >
            <h1 className="text-xl">Registros</h1>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
