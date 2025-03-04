import React from "react";

export type PolymorphicComponentProps<C extends React.ElementType> = {
  as?: C;
  children?: React.ReactNode;
} & React.ComponentProps<C>;

export function Polymorphic<C extends React.ElementType = "div">({
  as,
  children,
  ...props
}: PolymorphicComponentProps<C>) {
  const Component = as || "div";
  return <Component {...props}>{children}</Component>;
}
