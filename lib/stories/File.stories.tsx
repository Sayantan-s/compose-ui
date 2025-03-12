import type { Meta, StoryObj } from "@storybook/react";
import { File } from "@components/file";
import React from "react";

type Props = React.ComponentProps<typeof File>;

const meta: Meta<Props> = {
  component: File,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FileInput: Story = {
  args: {},
  render: function Render() {
    return (
      <File>
        <File.Trigger as="button">FileInput</File.Trigger>
      </File>
    );
  },
};
