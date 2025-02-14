import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  //Change Here
  const [category, setCategory] = useState("Apple");
  const [subCategory, setSubCategory] = useState("Laptop")
  const [bestseller, setBestseller] = useState(false);
  const [colors, setColors] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("colors", JSON.stringify(colors))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add" , formData , {headers:{token}})
      
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>


        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>

          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>

          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>

          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Manufacturer</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Lenovo">Lenovo</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Type</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Phone">Phone</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='80000' />
        </div>
      </div>


      <div>
        <p className='mb-2'>Product Colors</p>
        <div className='flex gap-3'>
          <div onClick={() => setColors(prev => prev.includes("White") ? prev.filter(item => item !== "White") : [...prev, "White"])}>
            <p className={`${colors.includes("White") ? "bg-purple-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>White</p>
          </div>
          <div onClick={() => setColors(prev => prev.includes("Black") ? prev.filter(item => item !== "Black") : [...prev, "Black"])}>
            <p className={`${colors.includes("Black") ? "bg-purple-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Black</p>
          </div>
          <div onClick={() => setColors(prev => prev.includes("Gold") ? prev.filter(item => item !== "Gold") : [...prev, "Gold"])}>
            <p className={`${colors.includes("Gold") ? "bg-purple-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Gold</p>
          </div>
          <div onClick={() => setColors(prev => prev.includes("Blue") ? prev.filter(item => item !== "Blue") : [...prev, "Blue"])}>
            <p className={`${colors.includes("Blue") ? "bg-purple-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Blue</p>
          </div>
          <div onClick={() => setColors(prev => prev.includes("Purple") ? prev.filter(item => item !== "Purple") : [...prev, "Purple"])}>
            <p className={`${colors.includes("Purple") ? "bg-purple-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>Purple</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add