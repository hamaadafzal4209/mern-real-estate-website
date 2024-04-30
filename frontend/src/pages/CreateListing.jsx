
function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-center font-semibold text-3xl my-7'>Create a Listing</h1>
            <form action="" className='flex flex-col sm:flex-row gap-4'>
                {/* left section */}
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={60} minLength={10} required />
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' maxLength={60} minLength={10} required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-3">
                            <input className='p-3 border border-gray-300 rounded-lg' type="Number" id='bedrooms' min='1' max='10' required />
                            <span>Beds</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input className='p-3 border border-gray-300 rounded-lg' type="Number" id='bathrooms' min='1' max='10' required />
                            <span>Baths</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input className='p-3 border border-gray-300 rounded-lg' type="Number" id='regularPrice' min='1' max='10' required />
                            <div className="text-center">
                                <p>Regular price</p>
                                <p className='text-xs'>($ / Month)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input className='p-3 border border-gray-300 rounded-lg' type="Number" id='discountPrice' min='1' max='10' required />
                            <div className="text-center">
                                <p>Discounted price</p>
                                <p className='text-xs'>($ / Month)</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* right section */}
                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">Images:<span className="font-normal text-gray-600 ml-2">The first images will be cover (max 6)</span></p>
                    <div className="flex items-center gap-3">
                        <input className="p-3 border border-gray-300 rounded w-full" type="file" name="" id="images" accept="image/*" multiple />
                        <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
                    </div>
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing
