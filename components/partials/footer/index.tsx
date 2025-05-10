import React from 'react'
import FooterContent from './footer-content'
import { Link } from "@/components/navigation"
import Image from 'next/image'
import { Icon } from "@/components/ui/icon";
import { auth } from '@/lib/auth'

const DashcodeFooter = async () => {
    const session = await auth()
    return (
        <FooterContent>
            <div className=' md:flex  justify-between text-default-600 hidden'>
                <div className="text-center ltr:md:text-start rtl:md:text-right text-sm">
                    COPYRIGHT &copy; {new Date().getFullYear()} KG Slots, Todos os direitos reservados.
                </div>
            </div>
            <div className='flex md:hidden justify-around items-center'>
            </div>

        </FooterContent>
    )
}

export default DashcodeFooter