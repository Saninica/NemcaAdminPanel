import { useEffect, useRef, useState } from "react";



declare global {
    interface Window {
      tinymce: any; // Replace `any` with the correct type if needed from TinyMCE types
    }
  }

export default function TinyMCE() {
  const editorRef = useRef<HTMLTextAreaElement | null>(null); // Reference to the textarea
  const [content, setContent] = useState<string>(""); // State to hold editor content

  useEffect(() => {
    if (editorRef.current) {
      // Load the self-hosted TinyMCE script
      const script = document.createElement("script");
      script.src = "https://canilgu.dev/tinymce/tinymce.min.js";
      script.onload = () => {
        // Initialize TinyMCE after the script loads
        window.tinymce.init({
          target: editorRef.current,
          plugins: "lists link image table",
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
          setup: (editor: any) => {
            editor.on("Change", (e: any) => {
              // Update content state on change
              console.log(e);

              setContent(editor.getContent());
            });
          },
        });
      };
      document.body.appendChild(script);

      // Cleanup function to remove TinyMCE instance on unmount
      return () => {
        if (window.tinymce) {
          window.tinymce.remove(editorRef.current);
        }
      };
    }
  }, []);

  return (
    <div className="w-96 h-48">
      <textarea
        ref={editorRef}
        defaultValue="<p>Initial content here...</p>"
        id="tiny-editor"
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <p>Editor Content:</p>
      <pre>{content}</pre>
    </div>
  );
}
