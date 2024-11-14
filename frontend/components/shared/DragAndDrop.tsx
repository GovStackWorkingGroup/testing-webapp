import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import {
  RiImage2Line,
  RiAddCircleFill,
  RiFileTextLine,
  RiCloseLine,
} from 'react-icons/ri';
import classNames from 'classnames';
import useTranslations from '../../hooks/useTranslation';
import { formatTranslationType } from '../../service/types';

type DragDrop = {
  selectedFile: (file: File | undefined) => void;
  isInvalid: boolean;
  defaultFile: File | undefined;
  name?: string;
  uploadFileType: 'image' | 'document';
  customErrorMessage?: formatTranslationType;
};

const allowedFormats = ['image/png', 'image/jpeg', 'image/svg+xml'];
const allowedFormatsDocx = [
  'application/pdf',
  'application/msword',
  'text/plain',
];

const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE || `${1 * 1024 * 1024}`, 10); // Default to 1 MB in bytes

const DragDrop = ({
  selectedFile,
  isInvalid,
  defaultFile,
  name,
  uploadFileType,
  customErrorMessage,
}: DragDrop) => {
  const [dragIsOver, setDragIsOver] = useState(false);
  const [isTypeFileError, setTypeFileError] = useState<boolean>(false);
  const [isSizeError, setIsSizeError] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const { format } = useTranslations();

  useEffect(() => {
    if (defaultFile) {
      setFile(defaultFile);
    }
  }, [defaultFile]);

  useEffect(() => {
    selectedFile(file);
  }, [file]);

  const isFileFormatAllowed = (fileType: string): boolean => {
    if (uploadFileType === 'image') {
      return allowedFormats.includes(fileType);
    } else if (uploadFileType === 'document') {
      return allowedFormatsDocx.includes(fileType);
    } else {
      return false;
    }
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

  const handleFileValidation = (selectedFile: File) => {
    if (isFileFormatAllowed(selectedFile.type) && selectedFile.size <= MAX_FILE_SIZE) {
      setFile(selectedFile);
      setIsSizeError(false);
      setTypeFileError(false);
    } else if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(undefined);
      setIsSizeError(true);
      setTypeFileError(false);
    } else if (!isFileFormatAllowed(selectedFile.type)) {
      setFile(undefined);
      setIsSizeError(false);
      setTypeFileError(true);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);

    // Fetch the files
    const droppedFile = event.dataTransfer.files[0];

    handleFileValidation(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileValidation(selectedFile);
    }
  };

  const inputId = `files_${name}`;

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
        <label htmlFor={inputId} className="drag-drop-file-icons">
          <RiImage2Line className="drag-drop-file-icon-image" />
          <RiAddCircleFill className="drag-drop-file-icon-plus" />
        </label>
        <label htmlFor={inputId} className="drag-drop-file-text-1">
          {format('drag_drop.select_file.label')}
        </label>
        <label htmlFor={inputId} className="drag-drop-file-text-2">
          {format('drag_drop.or_drop.label')}
        </label>
        <label htmlFor={inputId} className="drag-drop-file-text-3">
          {uploadFileType === 'image' && format('drag_drop.image_format.label')}
          {uploadFileType === 'document' && format('drag_drop.doc_format.label')}
        </label>
        <input
          id={inputId}
          type="file"
          onChange={(e) => handleFileChange(e)}
          style={{ visibility: 'hidden' }}
        ></input>
      </div>
      {isSizeError && (
        <p className="custom-error-message">
          {format('form.invalid_file_size.message', { size: (MAX_FILE_SIZE / (1024 * 1024)).toString() })}
        </p>
      )}
      {isTypeFileError && (
        <p className="custom-error-message">
          {uploadFileType === 'image' &&
            format('form.invalid_image_file_format.message')}
          {uploadFileType === 'document' &&
            format('form.invalid_doc_file_format.message')}
        </p>
      )}
      {isInvalid && !isTypeFileError && !isSizeError && (
        <p className="custom-error-message">
          {customErrorMessage || format('form.required_field.message')}
        </p>
      )}
      {file && (
        <div className="drag-drop-file-selected-container">
          <div className="drag-drop-file-selected-properties-section">
            <RiFileTextLine className="drag-drop-file-selected-icon" />
            <div className="drag-drop-file-selected-properties">
              <p>{file.name}</p>
              <p>{(file.size / 1024).toFixed(2)} kb</p>
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
