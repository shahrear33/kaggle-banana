import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TabItem = ({ value, onClick, to, className = '' }) => {
  const pathname = usePathname()
  const isSelected = to ? pathname === to : false

  const baseClasses = `
    relative 
    py-2 
    text-sm 
    text-gray-700 dark:text-gray-300 
    transition-all 
    duration-200 
    cursor-pointer 
    ${className}
    ${isSelected ? 'font-bold text-gray-900 dark:text-white' : 'font-medium hover:text-gray-900 dark:hover:text-white'}
  `

  const linkContent = (
    <p className={baseClasses}>
      {value}
      <span className={`
        absolute 
        bottom-0 
        left-0 
        w-full 
        h-[2px] 
        bg-current 
        transform 
        origin-left
        transition-transform 
        duration-200
        ${isSelected ? 'scale-x-100' : 'scale-x-0'}
        group-hover:scale-x-100
      `} />
    </p>
  )

  if (to) {
    return (
      <Link href={to} className="group" onClick={onClick}>
        {linkContent}
      </Link>
    )
  }

  return (
    <div className="group" onClick={onClick}>
      {linkContent}
    </div>
  )
}

export default TabItem
