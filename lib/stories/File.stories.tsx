import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { File } from "@components/file";
import React from "react";
import { useArgs } from "@storybook/preview-api";

type Props = React.ComponentProps<typeof File>;

const meta: Meta<Props> = {
  component: File,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FileInput: Story = {
  args: {},
  render: function Render(args) {
    return (
      <File>
        <File.Trigger as="button">FileInput</File.Trigger>
      </File>
    );
  },
};
