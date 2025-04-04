import { atomWithStorage } from 'jotai/utils'

interface userData {
    login: boolean
    email: string
    token?: string | undefined
    id?: string | undefined
}

export const userDataAtom = atomWithStorage<userData>('userData', { login: false, email: `` })