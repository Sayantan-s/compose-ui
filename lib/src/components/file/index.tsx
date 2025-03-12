import React, {
  createContext,
  FC,
  JSX,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Polymorphic } from "@utils/Polymorphic";
import {
  IChildprops,
  IFileCTXProps,
  IFileDragStatus,
  IFileProps,
  ITriggerExtendedProps,
} from "./type";

// File Component

const FileCTX = createContext<IFileCTXProps | null>(null);

const useFileCTX = (currentComponent: string) => {
  const ctx = useContext(FileCTX);
  if (!ctx)
    throw new Error(
      `${currentComponent} should be used inside the root File component`
    );
  return ctx;
};

const Root: FC<IFileProps> = ({
  children,
  onFileChange,
  multiple,
  accept,
  maxSize,
  ...rest
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | File>();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (eve) => {
    const { files } = eve.target;
    const fileList = Array.from(files!);
    const fileInput = multiple ? fileList : fileList[0];
    onFileChange?.(fileInput);
    setSelectedFiles(fileInput);
    setIsFileSelected(true);
  };

  const validateFiles = useCallback(
    (files: File[]) =>
      Array.from(files).filter((file) => {
        if (maxSize && file.size > maxSize) {
          setErrorMessage(`File ${file.name} exceeds size limit.`);
          return false;
        }
        if (accept && !accept.split(",").includes(file.type)) {
          setErrorMessage(`File ${file.name} is not a valid type.`);
          return false;
        }
        return true;
      }),
    []
  );

  const handleFiles = (files: File[]) => {
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setSelectedFiles(multiple ? validFiles : validFiles[0]);
      onFileChange?.(multiple ? validFiles : validFiles[0]);
      setErrorMessage(null);
    }
  };

  return (
    <FileCTX
      value={{
        ref: fileRef,
        files: selectedFiles,
        isFileSelected,
        errorMessage,
        isDragging,
        setIsDragging,
        handleFiles,
      }}
    >
      <input
        {...rest}
        type="file"
        hidden
        ref={fileRef}
        onChange={handleChange}
        multiple={multiple}
      />
      {children}
    </FileCTX>
  );
};

// File.Trigger Component

const Trigger = <T extends React.ElementType = keyof JSX.IntrinsicElements>({
  children,
  as,
  ...rest
}: ITriggerExtendedProps<T>) => {
  const ctx = useFileCTX("File.Trigger");
  const handleTrigger = () => ctx?.ref.current?.click();
  const element = as || "button";
  return (
    <Polymorphic as={element} {...rest} onClick={handleTrigger}>
      {typeof children === "function"
        ? children?.({
            files: ctx?.files,
            isFileSelected: ctx?.isFileSelected!,
          })
        : children}
    </Polymorphic>
  );
};

// File.Dropzone Component

const Dropzone: FC<IChildprops<IFileDragStatus>> = ({ children }) => {
  const ctx = useFileCTX("File.Dropzone");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    ctx.setIsDragging(true);
  };

  const handleDragLeave = () => ctx.setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    ctx.setIsDragging(false);
    if (e.dataTransfer.files) ctx.handleFiles(Array.from(e.dataTransfer.files));
  };

  const conditionalChildren =
    typeof children === "function"
      ? children?.({
          isFileSelected: ctx?.isFileSelected!,
          isDragging: ctx?.isDragging,
          isError: !!ctx.errorMessage,
          errorMessage: ctx.errorMessage,
        })
      : children;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {conditionalChildren}
    </div>
  );
};

export const File = Object.assign(Root, { Trigger, Dropzone });
