import { PolymorphicComponentProps } from "@utils/Polymorphic";
import { DetailedReactHTMLElement } from "react";

export type OmittedProps = "type" | "hidden" | "onChange";

export type IFiles = File[] | File;

export interface IFileProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    OmittedProps
  > {
  onFileChange?: (files: IFiles) => void;
  maxSize?: number;
}

export interface IFileSelection {
  files: IFiles | undefined;
  isFileSelected: boolean;
}

export interface IFileDragStatus {
  isDragging: boolean;
  isError: boolean;
  errorMessage: string | null;
  isFileSelected: boolean;
}

export interface IFileCTXProps extends IFileSelection {
  ref: React.RefObject<HTMLInputElement | null>;
  errorMessage: string | null;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  handleFiles: (files: File[]) => void;
}

export interface IChildprops<T> {
  children: React.ReactNode | ((values: T) => React.ReactNode);
}

export interface IChildrenProps<TElement> {
  children:
    | DetailedReactHTMLElement<any, any>
    | ((value: TElement) => DetailedReactHTMLElement<any, any>);
}

export type ITriggerExtendedProps<C extends React.ElementType = "div"> = Omit<
  PolymorphicComponentProps<C>,
  "children" | "onClick"
> &
  IChildprops<IFileSelection>;
