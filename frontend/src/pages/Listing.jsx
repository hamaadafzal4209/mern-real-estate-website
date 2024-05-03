import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';

function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`/backend/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setLoading(false);
                setListing(data);
                setError(false);
            } catch (error) {
                setError(true);
            }
        }
        fetchListing();
    }, [params.listingId])

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl font-semibold">Loading...</p>}
            {error && <p className="text-center my-7 text-2xl text-red-700 font-semibold">Something Went Wrong!</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[60vh]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </main>
    )
}

export default Listing;
