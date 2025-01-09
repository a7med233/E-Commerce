import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState([]);
  const [color, setColor] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ user: "", rating: 0, comment: "" });
  const [activeTab, setActiveTab] = useState('description');


  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/product/add-review", {
        productId,
        ...reviewData,
      });
      setReviews(response.data.reviews); // Update reviews list after submission
      setReviewData({ user: "", rating: 0, comment: "" });
    } catch (error) {
      console.error(error);
    }
  };


  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])


  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(backendUrl + `/api/product/${productId}`);
      setReviews(response.data.reviews || []);
    };

    fetchReviews();
  }, [productId]);


  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Information */}

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>({reviews.length})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Color:</p>
            <div className='flex gap-2'>
              {productData.colors.map((item, index) => (
                <button onClick={() => setColor(item)} className={`border py-2 px-4 bg-gray-100 ${item === color ? 'border-orange-500' : ''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, color)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and echange policy within 3 days.</p>
          </div>
        </div>
      </div>

{/* Description & Review Section */}
<div className='mt-20'>
        <div className="flex">
          <button
            className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`border px-5 py-3 text-sm ${activeTab === 'reviews' ? 'font-bold' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className='border px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <div>
              <p>{productData.description || 'Description not available.'}</p>
            </div>
          ) : (
            <div>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className='mb-4'>
                    <p className='font-medium'>{review.user}</p>
                    <p className='text-yellow-500'>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                    <p>{review.comment}</p>
                    <p className='text-gray-400 text-xs'>{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}

              {/* Add Review Form */}
              <form onSubmit={submitReview} className='mt-6'>
                <input
                  type='text'
                  placeholder='Your Name'
                  value={reviewData.user}
                  onChange={(e) => setReviewData({ ...reviewData, user: e.target.value })}
                  className='border px-3 py-2 mb-2 w-full'
                  required
                />
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                  className='border px-3 py-2 mb-2 w-full'
                  required
                >
                  <option value={0}>Select Rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} Star{star > 1 && "s"}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder='Your Review'
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className='border px-3 py-2 mb-2 w-full'
                  rows='4'
                  required
                ></textarea>
                <button type='submit' className='bg-black text-white px-4 py-2'>Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Display Related products */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product