import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

function CreateListing() {

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);

    console.log(formData);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false);
                })
                .catch(() => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                });
        }
        else {
            setImageUploadError('You can only upload 6 images per listing');
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const filename = new Date().getDate() + file.name;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

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
                        <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" name="" id="images" accept="image/*" multiple />
                        <button type="button" onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-3">
                                <img src={url} alt="Listing Image" className="w-20 h-20 object-contain rounded-lg" />
                                <button onClick={() => handleRemoveImage(index)} type="button" className="text-red-700 p-3 uppercase hover:opacity-75">Delete</button>
                            </div>
                        ))
                    }
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
                </div>
            </form>
        </main>
    );
}

export default CreateListing;
