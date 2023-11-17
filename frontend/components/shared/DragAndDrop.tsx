import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import {
  RiImage2Line,
  RiAddCircleFill,
  RiFileTextLine,
  RiCloseLine,
} from 'react-icons/ri';
import classNames from 'classnames';
import useTranslations from '../../hooks/useTranslation';

type DragDrop = {
  selectedFile: (file: File | undefined) => void;
  isInvalid: boolean;
};

const allowedFormats = ['image/png', 'image/jpeg', 'image/svg+xml'];

const DragDrop = ({ selectedFile, isInvalid }: DragDrop) => {
  const [dragIsOver, setDragIsOver] = useState(false);
  const [isTypeFileError, setTypeFileError] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const { format } = useTranslations();

  useEffect(() => {
    selectedFile(file);
  }, [file]);

  const isFileFormatAllowed = (fileType: string): boolean => {
    return allowedFormats.includes(fileType);
  };

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragIsOver(false);

    // Fetch the files
    const droppedFile = event.dataTransfer.files[0];

    if (isFileFormatAllowed(droppedFile.type)) {
      setFile(droppedFile);

      // Use FileReader to read file content
      const reader = new FileReader();

      reader.onerror = () => {
        setTypeFileError(true);
      };

      reader.readAsDataURL(droppedFile);

      return reader;
    } else {
      setTypeFileError(true);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isFileFormatAllowed(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        setTypeFileError(true);
      }
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={classNames(
          'drag-drop-file-container ',
          {
            'drag-drop-file-in-process': dragIsOver,
          },
          { 'drag-drop-file-error': isTypeFileError || isInvalid }
        )}
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
      {isTypeFileError && (
        <p className="custom-error-message">
          {format('form.invalid_file_format.message')}
        </p>
      )}
      {isInvalid && (
        <p className="custom-error-message">
          {format('form.required_field.message')}
        </p>
      )}
      {file && (
        <div className="drag-drop-file-selected-container">
          <div className="drag-drop-file-selected-properties-section">
            <RiFileTextLine className="drag-drop-file-selected-icon" />
            <div className="drag-drop-file-selected-properties">
              <p>{file.name}</p>
              <p>{file.size} kb</p>
            </div>
          </div>
          <div>
            <RiCloseLine
              className="drag-drop-file-selected-remove"
              onClick={() => setFile(undefined)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DragDrop;
