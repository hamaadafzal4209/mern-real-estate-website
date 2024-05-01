import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatar: currentUser.avatar
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          })
          .catch((error) => {
            console.log("Error getting download URL:", error);
          });
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      if (res.status === 404) {
        dispatch(deleteUserFailure('User not found'));
        return;
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/backend/auth/signout');
      const data = await res.json();

      if (res.status === 404) {
        dispatch(signOutUserFailure('User not found'));
        return;
      }

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/backend/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(false);
        return;
      }

      setUserListing(data);

    } catch (error) {
      showListingsError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/backend/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId));

    } catch (error) {
      console.log(error.message)
    }

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-bold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange} />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='h-24 w-24 self-center border-2 rounded-full cursor-pointer object-cover' />
        <p className='text-center text-sm'>
          {fileUploadError && <span className='text-center text-red-700'>Error Image Upload</span>}
          {filePercentage > 0 && filePercentage < 100 && (
            <span>{`Uploading ${filePercentage}%`}</span>
          )}
          {filePercentage === 100 && (
            <span className='text-center text-green-700'>
              Image Successfully Uploaded
            </span>
          )}
        </p>
        <input type="text" placeholder='username' className='p-3 border rounded-lg' id='username' value={formData.username} onChange={handleChange} />
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id='email' value={formData.email} onChange={handleChange} />
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg font-semibold hover:bg-slate-600 disabled:bg-slate-500'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white text-center p-3 rounded-lg uppercase font-semibold hover:bg-green-800' to="/create-listing">
          Craete Listing Page
        </Link>
      </form>
      <div className="flex items-center justify-between my-4">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer hover:underline'>Delete Account </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer hover:underline'>Sign Out </span>
      </div>
      <p className='text-red-700'>{error && error}</p>
      <p className='text-green-700'>{updateSuccess && 'User is updated succesfully!'}</p>
      <button onClick={handleShowListings} className='text-green-700 rounded-lg w-full p-3'>Show Listings</button>
      <p className='text-red-700'>{showListingsError ? 'Error Showing Listings' : ''}</p>
      {
        userListing && userListing.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl text-center font-semibold mt-7'>Your Listing</h1>
          {userListing.map((listing) => (
            <div className="flex items-center gap-4 justify-between rounded-lg border p-3" key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <img className='h-[70px] w-[70px] object-contain' src={listing.imageUrls[0]} alt="listing cover" />
              </Link>
              <Link className="hover:underline text-slate-700 font-semibold flex-1 truncate" to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col font-semibold items-center">
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default Profile;
