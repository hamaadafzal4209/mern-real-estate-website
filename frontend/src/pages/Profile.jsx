import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  },[file])

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
        // When the upload is complete, get the download URL
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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-bold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <input type="text" placeholder='username' className='p-3 border rounded-lg' id='username' />
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id='email' />
        <input type="text" placeholder='password' className='p-3 border rounded-lg' id='password' />
        <button className='bg-slate-700 text-white p-3 rounded-lg font-semibold hover:bg-slate-600 disabled:bg-slate-500'>Update</button>
      </form>
      <div className="flex items-center justify-between mt-4">
        <span className='text-red-700 cursor-pointer hover:underline'>Delete Account </span>
        <span className='text-red-700 cursor-pointer hover:underline'>Sign Out </span>
      </div>
    </div>
  );
}

export default Profile;
