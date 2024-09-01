import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateListing() {
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingId = params.listingId;
                const res = await fetch(`/backend/listing/get/${listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message);
                    return;
                }
                setFormData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
            setUploading(true);
            setImageUploadError(null);

            const promises = Array.from(files).map(file => storeImage(file));

            Promise.all(promises)
                .then(urls => {
                    setFormData(prevData => ({
                        ...prevData,
                        imageUrls: [...prevData.imageUrls, ...urls],
                    }));
                    setUploading(false);
                })
                .catch(() => {
                    setImageUploadError('Image upload failed (2 MB max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload up to 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const filename = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => resolve(downloadURL));
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData(prevData => ({
            ...prevData,
            imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e) => {
        const { id, type, value, checked } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) {
                setError('You must upload at least one image');
                return;
            }
            if (+formData.regularPrice < formData.discountPrice) {
                setError("Discount price must be lower than regular price");
                return;
            }
            setLoading(true);
            setError(null);

            const formDataWithUserRef = { ...formData, userRef: currentUser._id };

            const res = await fetch(`/backend/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithUserRef),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            } else {
                navigate(`/listing/${data._id}`);
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='p-3 pb-20 max-w-4xl mx-auto'>
            <h1 className='text-center font-semibold text-3xl my-7'>Update a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                {/* left section */}
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength={60}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        maxLength={60}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className="flex gap-6 flex-wrap">
                        {['sale', 'rent'].map(type => (
                            <div className="flex gap-2" key={type}>
                                <input
                                    type="checkbox"
                                    id={type}
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={formData.type === type}
                                />
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </div>
                        ))}
                        {['parking', 'furnished', 'offer'].map(amenity => (
                            <div className="flex gap-2" key={amenity}>
                                <input
                                    type="checkbox"
                                    id={amenity}
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={formData[amenity]}
                                />
                                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        {['bedrooms', 'bathrooms', 'regularPrice', 'discountPrice'].map(field => (
                            <div className="flex items-center gap-3" key={field}>
                                <input
                                    className='p-3 border border-gray-300 rounded-lg'
                                    type="number"
                                    id={field}
                                    min={field === 'regularPrice' ? '50' : '1'}
                                    max='1000000'
                                    required
                                    onChange={handleChange}
                                    value={formData[field]}
                                />
                                <div className="text-center">
                                    <p>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                                    <p className='text-xs'>($ / Month)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* right section */}
                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">Images:<span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span></p>
                    <div className="flex items-center gap-3">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            accept="image/*"
                            multiple
                        />
                        <button
                            disabled={uploading}
                            type="button"
                            onClick={handleImageSubmit}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                            <img src={url} alt="Listing Image" className="w-20 h-20 object-contain rounded-lg" />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                type="button"
                                className="text-red-700 p-3 uppercase hover:opacity-75"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <button
                        disabled={loading || uploading}
                        type="submit"
                        className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    >
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}

export default UpdateListing;
