"use client";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-md relative h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Phuket Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end items-start text-white text-left pl-8 md:pl-16 pr-4 pb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Your Gateway to Phuket&quot;;s Finest Properties
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Ruby Real Estate is the premier agency for luxury properties in
              Phuket. With a deep understanding of the local market and a
              commitment to exceptional service, we help clients find their
              dream homes and investment opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Mission Section - Left Aligned */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <div className="space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              At Ruby Real Estate, our mission is to provide unparalleled
              service and expertise in the Phuket luxury real estate market.
            </p>
            <p className="text-lg leading-relaxed">
              We strive to exceed client expectations by offering personalized
              guidance, in-depth market knowledge, and a curated selection of
              the finest properties.
            </p>
            <p className="text-lg leading-relaxed">
              Our goal is to make the process of buying, selling, or renting
              luxury real estate seamless and rewarding.
            </p>
          </div>
        </section>

        {/* Team Section with Cartoon Avatars */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-gray-800 text-center">
            Meet Our Team
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-12">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                <Image
                  src="https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg"
                  alt="Sophia Chen"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Sophia Chen
              </h3>
              <p className="text-gray-600 font-medium">CEO & Founder</p>
              <p className="text-gray-500 mt-3 max-w-xs mx-auto">
                15+ years experience in luxury real estate
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                <Image
                  src="https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg"
                  alt="Ethan Lee"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Ethan Lee
              </h3>
              <p className="text-gray-600 font-medium">Head of Sales</p>
              <p className="text-gray-500 mt-3 max-w-xs mx-auto">
                Specializing in high-end property investments
              </p>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Our Expertise
          </h2>
          <p className="text-gray-700 mb-8 text-lg text-center max-w-3xl mx-auto">
            Ruby Real Estate specializes in the luxury property market in
            Phuket, offering a diverse portfolio of high-end villas, beachfront
            residences, and investment properties.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Villa"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    Luxury Properties
                  </h4>
                  <p className="text-gray-600">
                    Villas, condos, and beachfront residences
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    Market Analysis
                  </h4>
                  <p className="text-gray-600">
                    Comprehensive property valuation
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-6 h-6 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    Legal Support
                  </h4>
                  <p className="text-gray-600">Full transaction assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-blue-50 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
            Contact our team today for personalized assistance in finding your
            perfect home or investment property in Phuket.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-700 text-white py-4 px-8 rounded-lg hover:bg-blue-800 font-medium transition-colors text-lg"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
