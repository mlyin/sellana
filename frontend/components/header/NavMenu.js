import { ClockIcon, GiftIcon, UserCircleIcon, Cog6ToothIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { classNames } from '../../utils/classNames'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { truncate } from '../../utils/string'
require('@solana/wallet-adapter-react-ui/styles.css')

const NavMenu = ({ connected, publicKey }) => {
    const menus = [
        {
            icon: ClockIcon,
            item: 'Recent Activity',
            current: true,
        },
        {
            icon: BuildingStorefrontIcon,
            item: 'Store',
            current: false,
        },
        {
            icon: GiftIcon,
            item: 'Rewards',
            current: false,
        },
    ]

    return (
        <nav className="flex flex-1 items-center justify-center">
            <ul className="flex flex-col space-y-10">
                <li onClick={() => {
                    const storefront = document.getElementById("storefront");
                    storefront.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    }} className={classNames('flex cursor-pointer space-x-3 transition-all hover:text-gray-100', false ? 'text-white' : 'text-[#5A5A5A]', 'font-semibold')}>
                    <BuildingStorefrontIcon className="h-6 w-6 " />
                    <span>Store</span>
                </li>
                <li onClick={() => window.location.href = "/rewards"} className={classNames('flex cursor-pointer space-x-3 transition-all hover:text-gray-100', false ? 'text-white' : 'text-[#5A5A5A]', 'font-semibold')}>
                    <GiftIcon className="h-6 w-6 " />
                    <span>Rewards</span>
                </li>
                <li onClick={() => {
                    const transactionslist = document.getElementById("transactionslist");
                    transactionslist.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    }} className={classNames('flex cursor-pointer space-x-3 transition-all hover:text-gray-100', false ? 'text-white' : 'text-[#5A5A5A]', 'font-semibold')}>
                    <ClockIcon className="h-6 w-6 " />
                    <span>Recent Activity</span>
                </li>
                <li>
                    <WalletMultiButton className='phantom-button' startIcon={<UserCircleIcon style={{height: 24, width: 24, color: '#5A5A5A'}} />}>
                        <span className='text-sm font-semibold text-[#5A5A5A]'>
                            {connected ? 'Connected! ' + truncate(publicKey.toString()) : 'Connect Wallet'}
                        </span>
                    </WalletMultiButton>
                    {/* <button className="flex space-x-3">
                        <UserCircleIcon style={{ height: 24, width: 24, color: '#15ec3c' }} />
                        <span className="text-sm font-semibold text-[#15ec3c]">{connected ? truncate(publicKey.toString()) : 'Connect Wallet'}</span>
                    </button> */}
                </li>
            </ul>
        </nav >
    )
}

const NavMenuItem = ({ Icon, item, current }) => {
    return (
        <li onClick={() => window.location.href = {item}} className={classNames('flex cursor-pointer space-x-3 transition-all hover:text-gray-100', current ? 'text-white' : 'text-[#5A5A5A]', 'font-semibold')}>
            <Icon className="h-6 w-6 " />
            <span>{item}</span>
        </li>
    )
}

export default NavMenu
