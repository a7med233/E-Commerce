import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, darkMode, toggleDarkMode } = useContext(ShopContext);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
    };

    return (
        <div className={`flex items-center justify-between py-5 font-medium ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <Link to='/'><img src={assets.logo} className='w-36' alt="Logo" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>PRODUCTS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="Search Icon" />

                <div className='group relative'>
                    <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile Icon" />
                    {token && (
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>My Profile</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    )}
                </div>

                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart Icon" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                        {getCartCount()}
                    </p>
                </Link>

                <button 
                    onClick={toggleDarkMode} 
                    className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'}`}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu Icon" />
            </div>
        </div>
    );
};

export default Navbar;
