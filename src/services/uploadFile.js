import axios from "axios";

export async function uploadFile(url, file, onProgress){
  await axios.put(
    url,
    file,
    {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: ({ total, loaded }) => {
        const percentage = Math.round((loaded * 100) / total);
        onProgress?.(percentage);
      }
  })
}