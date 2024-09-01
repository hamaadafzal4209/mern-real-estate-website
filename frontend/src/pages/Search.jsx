import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    console.log(listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/backend/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();

    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value }); // Corrected this line
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === true ? true : false });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'

            setSidebarData({ ...sidebarData, sort, order })

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { searchTerm, type, parking, furnished, offer, sort, order } = sidebarData;
        const searchQuery = new URLSearchParams({
            searchTerm,
            type,
            parking: parking.toString(),
            furnished: furnished.toString(),
            offer: offer.toString(),
            sort,
            order
        }).toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/backend/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };
    

    return (
        <div className="flex flex-col md:flex-row bg-gray-900 text-gray-100">
            {/* left section */}
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-gray-700">
                <form onSubmit={handleSubmit} action="" className="flex flex-col gap-8 font-semibold">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap" htmlFor="">Search Term:</label>
                        <input type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border p-3 rounded-lg w-full bg-gray-800 text-gray-200"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label htmlFor="">Type:</label>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebarData.type === 'all'} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebarData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebarData.type === 'sale'} />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebarData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label htmlFor="">Amenities:</label>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebarData.parking} />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebarData.furnished} />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-gray-400">Sort:</label>
                        <select onChange={handleChange} defaultValue={'createdAt_desc'} id="sort_order" className="border rounded-lg p-3 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="regularPrice_desc" className="text-gray-200">Price high to low</option>
                            <option value="regularPrice_asc" className="text-gray-200">Price low to high</option>
                            <option value="createdAt_desc" className="text-gray-200">Latest</option>
                            <option value="createdAt_asc" className="text-gray-200">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-blue-700 text-white rounded-lg p-3 hover:opacity-95">Search</button>
                </form>
            </div>
            {/* right section */}
            <div className="flex-1">
                <h1 className="text-3xl font-semibold p-3 border-b text-gray-300 mt-5 border-gray-700">Listing Results:</h1>
                <div className="p-7">
                    {!listings.length && (
                        <p className="text-3xl text-gray-400">No listing found!</p>
                    )}
                    {loading && (
                        <p className="text-xl text-center w-full text-gray-400">Loading...</p>
                    )}
                    {!loading && listings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}

                    {showMore && (
                        <button className="text-green-400 hover:underline p-7 w-full text-left" onClick={onShowMoreClick}>
                            Show More
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Search;