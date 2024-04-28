import { OrganizationSwitcher, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
    return (
        <div className='border-b py-4 bg-gray-50'>
            <div className="container mx-auto justify-between items-center flex">
                <div className="">
                    Rapid Drops
                </div>
                <div className='flex gap-2'>
                    <OrganizationSwitcher />
                    <UserButton />
                    <SignInButton/>
                </div>
            </div>
        </div>
    )
}

export default Header