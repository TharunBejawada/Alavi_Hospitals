"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useCallback } from "react";
import "react-quill-new/dist/quill.snow.css";
import { API_URL } from "../../config";

// Dynamic import with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

const RichTextEditor = ({ value, onChange }: EditorProps) => {
  // We need a ref to access the internal Quill instance to insert content manually
  const quillRef = useRef<any>(null);

  // --- Custom Image Handler ---
  const imageHandler = useCallback(() => {
    // 1. Create a hidden file input programmatically
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // 2. Listen for file selection
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
          // 3. Upload to your Backend (S3)
          const response = await fetch(`${API_URL}/api/blogs/uploadblogImage`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          const imageUrl = data.imageUrl;

          // 4. Insert the URL into the Editor
          const quill = quillRef.current.getEditor();
          
          // Get current cursor position (or 0 if lost focus)
          const range = quill.getSelection(true); 
          
          // Insert image embed
          quill.insertEmbed(range.index, "image", imageUrl);
          
          // Move cursor to next position
          quill.setSelection(range.index + 1);

        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Failed to upload image. Please try again.");
        }
      }
    };
  }, []);

  // Memoize modules to prevent re-rendering loops
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"], // The image button
        ["clean"],
      ],
      handlers: {
        image: imageHandler, // Override default Base64 handler with ours
      },
    },
  }), [imageHandler]);

  return (
    <div className="bg-white">
      <ReactQuill
        ref={quillRef} // Attach ref
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-64 mb-12" 
      />
    </div>
  );
};

export default RichTextEditor;