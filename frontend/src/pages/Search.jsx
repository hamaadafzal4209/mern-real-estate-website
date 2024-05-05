
function Search() {
    return (
        <div className="flex flex-col md:flex-row">
            {/* left section */}
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form action="" className="flex flex-col gap-8 font-semibold">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap" htmlFor="">Search Term:</label>
                        <input type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label htmlFor="">Type:</label>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="all" className="w-5" />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="sale" className="w-5" />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label htmlFor="">Ameties:</label>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="parking" className="w-5" />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-gray-600">Sort:</label>
                        <select id="sort_order" className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" className="text-gray-600">Price high to low</option>
                            <option value="" className="text-gray-600">Price low to high</option>
                            <option value="" className="text-gray-600">Latest</option>
                            <option value="" className="text-gray-600">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95">Search</button>
                </form>
            </div>
            {/* right section */}
            <div className="">
                <h1 className="text-3xl font-semibold p-3 border-b text-slate-700 mt-5">Listing Results</h1>
            </div>
        </div>
    )
}

export default Search
