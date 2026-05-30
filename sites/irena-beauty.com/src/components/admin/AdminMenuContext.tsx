'use client'

import { createContext, useContext } from 'react'

export const AdminMenuContext = createContext<{
  onBurger: () => void
}>({
  onBurger: () => {},
})

export const useAdminMenu = () => useContext(AdminMenuContext)
