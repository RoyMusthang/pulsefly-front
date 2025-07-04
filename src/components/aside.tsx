import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings,  Menu, Box, FileArchive, ShoppingCart, Send, User } from 'lucide-react'
import { useAsideBarOpen } from './state/tags/asfd'
import { Link } from "react-router-dom"

const Aside: React.FC = () => {

    const { isOpen, setIsOpen } = useAsideBarOpen();


    const menuItems = [
        { icon: Box, label: 'Dashboard', link: '/' },
        { icon: Send, label: 'Disparos', link: '/dispatch' },
        { icon: User, label: 'Leads', link: '/leads' },
        { icon: ShoppingCart, label: 'Créditos', link: '/credits' },
        { icon: FileArchive, label: 'Relatórios', link: '/reports' },
        { icon: Settings, label: 'Configurações', link: '/settings' },
    ]

    return (
        <aside className={`w-52 min-h-screen border-r border-dashed flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static fixed z-30`}>
            <div className="flex items-center justify-between p-4">
                <div className="flex p-2 gap-2">

                    <Pix className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">

                        Pix Leads
                    </h2>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={setIsOpen}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>
            <ScrollArea className="flex-grow">
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Button asChild key={index} variant="secondary" className="w-full justify-start">
                            <Link to={item.link.toLowerCase()}>
                                <item.icon className="mr-2 h-4 w-4 text-primary" />

                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    )
}
function Pix({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            className={className}
            viewBox="0 0 48 48"
        >
            <path
                fill="#37c6d0"
                d="M19.262,44.037l-8.04-8.04L11,35l-1.777-1.003l-5.26-5.26c-2.617-2.617-2.617-6.859,0-9.475	l5.26-5.26L11,13l0.223-0.997l8.04-8.04c2.617-2.617,6.859-2.617,9.475,0l8.04,8.04L37,13l1.777,1.003l5.26,5.26	c2.617,2.617,2.617,6.859,0,9.475l-5.26,5.26L37,35l-0.223,0.997l-8.04,8.04C26.121,46.653,21.879,46.653,19.262,44.037z"
            />
            <path d="M35.79,11.01c-1.76,0.07-3.4,0.79-4.63,2.04l-6.81,6.77c-0.09,0.1-0.22,0.15-0.35,0.15	s-0.25-0.05-0.35-0.15l-6.8-6.76c-1.24-1.26-2.88-1.98-4.64-2.05L8.22,15h3.68c0.8,0,1.55,0.31,2.12,0.88l6.8,6.78	c0.85,0.84,1.98,1.31,3.18,1.31s2.33-0.47,3.18-1.31l6.79-6.78C34.55,15.31,35.3,15,36.1,15h3.68L35.79,11.01z M36.1,33	c-0.8,0-1.55-0.31-2.12-0.88l-6.8-6.78c-0.85-0.84-1.98-1.31-3.18-1.31s-2.33,0.47-3.18,1.31l-6.79,6.78	C13.45,32.69,12.7,33,11.9,33H8.22l3.99,3.99c1.76-0.07,3.4-0.79,4.63-2.04l6.81-6.77c0.09-0.1,0.22-0.15,0.35-0.15	s0.25,0.05,0.35,0.15l6.8,6.76c1.24,1.26,2.88,1.98,4.64,2.05L39.78,33H36.1z" opacity=".05" />
            <path d="M36.28,11.5H36.1c-1.74,0-3.38,0.68-4.59,1.91l-6.8,6.77c-0.19,0.19-0.45,0.29-0.71,0.29	s-0.52-0.1-0.71-0.29l-6.79-6.77c-1.22-1.23-2.86-1.91-4.6-1.91h-0.18l-3,3h3.18c0.93,0,1.81,0.36,2.48,1.02l6.8,6.78	c0.75,0.76,1.75,1.17,2.82,1.17s2.07-0.41,2.82-1.17l6.8-6.77c0.67-0.67,1.55-1.03,2.48-1.03h3.18L36.28,11.5z M36.1,33.5	c-0.93,0-1.81-0.36-2.48-1.02l-6.8-6.78c-0.75-0.76-1.75-1.17-2.82-1.17s-2.07,0.41-2.82,1.17l-6.8,6.77	c-0.67,0.67-1.55,1.03-2.48,1.03H8.72l3,3h0.18c1.74,0,3.38-0.68,4.59-1.91l6.8-6.77c0.19-0.19,0.45-0.29,0.71-0.29	s0.52,0.1,0.71,0.29l6.79,6.77c1.22,1.23,2.86,1.91,4.6,1.91h0.18l3-3H36.1z" opacity=".07" />
            <path fill="#fff" d="M38.78,14H36.1c-1.07,0-2.07,0.42-2.83,1.17l-6.8,6.78c-0.68,0.68-1.58,1.02-2.47,1.02	s-1.79-0.34-2.47-1.02l-6.8-6.78C13.97,14.42,12.97,14,11.9,14H9.22l2-2h0.68c1.6,0,3.11,0.62,4.24,1.76l6.8,6.77	c0.59,0.59,1.53,0.59,2.12,0l6.8-6.77C32.99,12.62,34.5,12,36.1,12h0.68L38.78,14z M36.1,34c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78	c-1.36-1.36-3.58-1.36-4.94,0l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l2,2h0.68c1.6,0,3.11-0.62,4.24-1.76l6.8-6.77	c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36h0.68l2-2H36.1z" />
        </svg>
    )
}
export default Aside;
