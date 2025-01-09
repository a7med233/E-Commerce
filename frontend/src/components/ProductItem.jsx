import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {

    const {currency} = useContext(ShopContext);
  return (
    <Link className='text-gray-700 cursor-pointer block' to={`/product/${id}`}>
    <div className='aspect-square overflow-hidden'>
        <img 
            className='w-full h-full object-cover hover:scale-110 transition ease-in-out duration-300' 
            src={Array.isArray(image) ? image[0] : image} 
            alt={name} 
        />
    </div>
    <p className='pt-3 pb-1 text-sm truncate'>{name}</p>
    <p className='text-sm font-medium'>{currency}{price}</p>
</Link>
  )
}

export default ProductItem