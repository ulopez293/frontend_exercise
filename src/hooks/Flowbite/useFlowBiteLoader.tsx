import { useEffect } from "react"

const useFlowBiteLoader = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])
}

export default useFlowBiteLoader