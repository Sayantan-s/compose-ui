import { PolymorphicComponentProps } from "@utils/Polymorphic";

export type OmittedProps = "type" | "hidden" | "onChange";

export interface IFileProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    OmittedProps
  > {
  onFileChange?: (files: FileList | File) => void;
}

export interface IFileSelection {
  files: FileList | File | undefined;
  isFileSelected: boolean;
}

export interface IFileCTXProps extends IFileSelection {
  ref: React.RefObject<HTMLInputElement | null>;
}

export interface ITriggerBaseProps {
  children: React.ReactNode | ((values: IFileSelection) => React.ReactNode);
}

export type ITriggerExtendedProps<C extends React.ElementType> = Omit<
  PolymorphicComponentProps<C>,
  "children" | "onClick"
> &
  ITriggerBaseProps;
