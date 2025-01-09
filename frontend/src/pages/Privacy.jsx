import React from 'react'
import Title from '../components/Title'

const Privacy = () => {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'PRIVACY'} text2={'POLICY'} />
            </div>


            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-gray-600">
                    Welcome to SwiftCart's Privacy Policy. This policy describes how we collect, use, and protect your personal information when you use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This may include:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li>Name and contact information</li>
                    <li>Payment information</li>
                    <li>Shipping address</li>
                    <li>Purchase history</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600">
                    We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li>Process your orders and payments</li>
                    <li>Provide customer support</li>
                    <li>Improve our services</li>
                    <li>Send you promotional offers (with your consent)</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-gray-600">
                    We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-gray-600">
                    You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Changes to This Policy</h2>
                <p className="text-gray-600">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
                <p className="text-gray-600">
                    If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-gray-600 mt-2">
                    Email: <a href="mailto:privacy@swiftcart.com" className='underline'> privacy@swiftcart.com </a><br />
                    Address: 4032 Debrecen, Thomas Mann Utca 41, Hungary
                </p>
            </section>
        </div>
    )
}

export default Privacy
