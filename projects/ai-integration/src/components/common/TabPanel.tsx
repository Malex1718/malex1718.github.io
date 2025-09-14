import React from 'react'

interface TabPanelProps {
  value: string
  activeValue: string
  children: React.ReactNode
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, activeValue, children }) => {
  if (value !== activeValue) return null
  
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  )
}