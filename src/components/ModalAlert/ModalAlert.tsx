
import { Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

interface ModalAlertProps {
    openModal: {
        message: string
        show: boolean
    }
    setOpenModal: React.Dispatch<React.SetStateAction<{
        message: string
        show: boolean
    }>>
    funcion?: () => void
}
export const ModalAlert = ({ funcion, openModal, setOpenModal }: ModalAlertProps) => {
    return (
        <>
            <Modal show={openModal.show} size="md" onClose={() => {
                setOpenModal({ message: ``, show: false })
                if (funcion) funcion()
            }} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            {openModal.message}
                        </h3>
                        {/* <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => setOpenModal({message:``, show: false})}>
                                {"Cerrar"}
                            </Button>
                        </div> */}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
