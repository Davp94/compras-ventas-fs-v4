'use client'
import React, { useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

export default function MainLayout({ 
    children 
}: Readonly<{ children: React.ReactNode }>) {
    const navigationItems = [
        {name: "Home", href:"/", icon:"pi pi-home"},
        {name: "Usuarios", href:"/usuarios", icon:"pi pi-user"},
        {name: "Roles", href:"/roles", icon:"pi pi-card"}
    ]

    const topbarItems: MenuItem[] = [
        {label: 'Perfil', icon: 'pi pi-user', command: () => {alert("User profile")}},
        {label: 'Salir', icon: 'pi pi-sign-out', command: () => {alert("logout")}}
    ]
    const topbarMenu = useRef<Menu>(null);

    return (
        <div className="flex h-screen">
            {/* sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-xl font-bold">App</div>
                <nav className="flex-1">
                    {navigationItems.map(item => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 hover:bg-gray-700"
                        >
                            <i className={`${item.icon} mr-3`}></i>
                            {item.name}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* main content area */}
            <div className="flex-1 flex flex-col">
                {/* topbar */}
                <header className="h-16 bg-white shadow flex items-center justify-end px-4">
                    <Menu model={topbarItems} popup ref={topbarMenu} />
                    <Button
                        icon="pi pi-ellipsis-v"
                        className="p-button-text"
                        onClick={e => topbarMenu.current?.toggle(e)}
                    />
                </header>

                {/* content */}
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}