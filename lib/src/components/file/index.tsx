import React, { createContext, FC, useContext, useRef, useState } from "react";
import { Polymorphic } from "@utils/Polymorphic";
import { IFileCTXProps, IFileProps, ITriggerExtendedProps } from "./type";

// File

const FileCTX = createContext<IFileCTXProps | null>(null);

const Root: FC<IFileProps> = ({
  children,
  onFileChange,
  multiple,
  ...rest
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | File>();
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (eve) => {
    const { files } = eve.target;
    const fileList = files!;
    const fileInput = multiple ? fileList : fileList[0];
    onFileChange?.(fileInput);
    setSelectedFiles(fileInput);
    setIsFileSelected(true);
  };

  return (
    <FileCTX value={{ ref: fileRef, files: selectedFiles, isFileSelected }}>
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

// File.Trigger

const Trigger = <T extends React.ElementType>({
  children,
  as,
  ...rest
}: ITriggerExtendedProps<T>) => {
  const ctx = useContext(FileCTX);
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

export const File = Object.assign(Root, { Trigger });
