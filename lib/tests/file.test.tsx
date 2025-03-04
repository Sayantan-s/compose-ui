import { render, fireEvent, screen } from "@testing-library/react";
import { File as FileInput } from "@components/file"; // Assuming your component is in File.tsx
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("File Component", () => {
  it("renders children correctly", () => {
    render(
      <FileInput>
        <div data-testid="test-child">Test Child</div>
      </FileInput>
    );
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("triggers FileInput input when Trigger is clicked", () => {
    const { getByText, getByLabelText } = render(
      <FileInput>
        <FileInput.Trigger>Click Me</FileInput.Trigger>
      </FileInput>
    );

    const button = getByText("Click Me");
    const fileInput = screen.getByLabelText("Choose file") as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("calls onFileChange with selected file (single)", () => {
    const onFileChange = vi.fn();
    const { getByText, getByLabelText } = render(
      <FileInput onFileChange={onFileChange}>
        <FileInput.Trigger as="button">Click Me</FileInput.Trigger>
      </FileInput>
    );

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const fileInput = screen.getByLabelText("Choose file") as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("calls onFileChange with selected files (multiple)", () => {
    const onFileChange = vi.fn();
    const { getByText, getByLabelText } = render(
      <FileInput onFileChange={onFileChange} multiple>
        <FileInput.Trigger as="button">Click Me</FileInput.Trigger>
      </FileInput>
    );

    const file1 = new File(["hello"], "hello.txt", { type: "text/plain" });
    const file2 = new File(["world"], "world.txt", { type: "text/plain" });
    const fileInput = screen.getByLabelText("Choose file") as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });
    expect(onFileChange).toHaveBeenCalledWith([file1, file2]);
  });

  it("renders custom trigger element", () => {
    const { getByTestId } = render(
      <FileInput>
        <FileInput.Trigger as="div" data-testid="custom-trigger">
          Custom Trigger
        </FileInput.Trigger>
      </FileInput>
    );

    expect(getByTestId("custom-trigger")).toBeInTheDocument();
  });

  it("renders trigger with function as children", () => {
    const { getByText } = render(
      <FileInput>
        <FileInput.Trigger as="button">
          {() => <span>Dynamic Trigger</span>}
        </FileInput.Trigger>
      </FileInput>
    );

    expect(getByText("Dynamic Trigger")).toBeInTheDocument();
  });

  it("passes rest props to the input element", () => {
    render(
      <FileInput accept="image/*" data-testid="FileInput-input">
        <FileInput.Trigger as="button">Click Me</FileInput.Trigger>
      </FileInput>
    );

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    expect(fileInput.accept).toBe("image/*");
  });
});
