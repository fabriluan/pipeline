import { IconPhotoUp, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./index.css";
import { getPresignedURL } from "./services/getPresignedURL";
import { uploadFile } from "./services/uploadFile";

function App() {
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploads((prevState) =>
        prevState.concat(acceptedFiles.map((file) => ({ file, progress: 0 })))
      );
    },
  });

  function handleRemoveUpload(removingIndex) {
    setUploads((prevState) => {
      const newState = [...prevState];
      newState.splice(removingIndex, 1);

      return newState;
    });
  }

  async function handleUpload() {
    try {
      setLoading(true);

      const uploadsUrl = await Promise.all(
        uploads.map(async ({ file }) => ({
          file,
          url: await getPresignedURL(file),
        }))
      );

      const response = await Promise.allSettled(
        uploadsUrl.map(({ url, file }, index) =>
          uploadFile(url, file, (progress) => {
            setUploads((prevState) => {
              const newState = [...prevState];
              const upload = newState[index];

              newState[index] = {
                ...upload,
                progress,
              };

              return newState;
            });
          })
        )
      );

      response.forEach((response, index) => {
        if (response.status === "rejected") {
          const fileWithError = uploads[index].name;
          console.log(`O upload do arquivo ${fileWithError} falhou`);
        }
      });

      setUploads([]);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div {...getRootProps()} className={isDragActive ? "box box2" : "box"}>
        <input {...getInputProps()} />

        <IconPhotoUp />

        <span>Adicione os arquivos</span>
        <small>No máximo 1gb</small>
      </div>

      {uploads.length > 0 && (
        <div className="files">
          <h2>{uploads.length} Arquivos selecionados </h2>

          {uploads.map(({ file, progress }, index) => (
            <div className="upload">
              <div className="file">
                <p>{file.name}</p>

                <button onClick={() => handleRemoveUpload(index)}>
                  <IconTrash />
                </button>
              </div>

              <input type="range" value={progress} />
            </div>
          ))}

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Carregando..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
