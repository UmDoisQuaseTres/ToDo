import { HTMLProps } from "react";

export default function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full h-40 resize-none rounded-lg outline-none p-2 border-gray-300 border-2"
      {...rest}
    ></textarea>
  );
}
