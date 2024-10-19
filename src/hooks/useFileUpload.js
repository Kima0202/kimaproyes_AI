import { useState } from 'react';

const useFileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  return { file, handleFileChange };
};

export default useFileUpload;
