import React from 'react'
import Title from '../components/Title'

const Delivery = () => {
    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className=" text-center mb-12">
                <div className='text-2xl text-center pt-8 border-t'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <p className="text-gray-600 mt-4">
                    SwiftCart ensures fast, reliable, and transparent delivery for all your orders.
                </p>
            </div>

            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-2">Delivery Options</h3>
                <p className="text-gray-600 mb-2">
                    We provide multiple delivery methods to meet your needs, including:
                </p>
                <ul className="list-disc pl-5 text-gray-600">
                    <li>Standard Shipping for everyday convenience</li>
                    <li>Expedited Shipping for quicker delivery</li>
                    <li>Same-Day Delivery in select areas</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-2">Estimated Delivery Times</h3>
                <p className="text-gray-600">
                    Delivery times vary based on your chosen method and location:
                </p>
                <table className="w-full mt-4 text-left border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Shipping Method</th>
                            <th className="border border-gray-300 px-4 py-2">Estimated Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Standard Shipping</td>
                            <td className="border border-gray-300 px-4 py-2">5-7 business days</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Expedited Shipping</td>
                            <td className="border border-gray-300 px-4 py-2">2-3 business days</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Same-Day Delivery</td>
                            <td className="border border-gray-300 px-4 py-2">Available in select areas</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-2">Shipping Costs</h3>
                <p className="text-gray-600">
                    Shipping charges are calculated at checkout based on your location and chosen delivery method.
                </p>
            </section>

            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-2">Order Tracking</h3>
                <p className="text-gray-600">
                    Once your order is shipped, you’ll receive a tracking link to monitor its journey in real time.
                </p>
            </section>

            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-2">International Shipping</h3>
                <p className="text-gray-600">
                    We deliver to select international destinations. Please note that delivery times and costs may vary depending on the country.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
                <p className="text-gray-600">
                    Our support team is here to help! Reach out to us for any questions or concerns:
                </p>
                <address className="text-gray-600 mt-2">
                    Email: <a href="mailto:support@swiftcart.com" className="underline">support@swiftcart.com</a><br />
                    Address: 4032 Debrecen, Thomas Mann Utca 41, Hungary
                </address>
            </section>
        </div>
    )
}

export default Delivery
