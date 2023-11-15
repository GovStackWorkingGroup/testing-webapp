import React, { ChangeEvent, DragEvent, useState } from 'react';
import { RiImage2Line, RiAddCircleFill } from 'react-icons/ri';
import useTranslations from '../../hooks/useTranslation';

function DragDrop() {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<File>();

  const { format } = useTranslations();

  console.log('files', files);
  console.log('file', file);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    // Use FileReader to read file content
    droppedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error('There was an issue reading the file.');
      };

      reader.readAsDataURL(file);

      return reader;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="drag-drop-file-container"
      >
        <label htmlFor="files" className="drag-drop-file-icons">
          <RiImage2Line className="drag-drop-file-icon-image" />
          <RiAddCircleFill className="drag-drop-file-icon-plus" />
        </label>
        <label htmlFor="files" className="drag-drop-file-text-1">
          {format('drag_drop.select_file.label')}
        </label>
        <label htmlFor="files" className="drag-drop-file-text-2">
          {format('drag_drop.or_drop.label')}
        </label>
        <label htmlFor="files" className="drag-drop-file-text-3">
          {format('drag_drop.format.label')}
        </label>
        <input
          id="files"
          type="file"
          onChange={(e) => handleFileChange(e)}
          style={{ visibility: 'hidden' }}
        ></input>
      </div>
    </>
  );
}

export default DragDrop;
