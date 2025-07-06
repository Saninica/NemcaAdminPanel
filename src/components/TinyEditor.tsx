import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    tinymce: any;
  }
}

export default function TinyMCE({ nameProp, idProp, onContentChange }: {
  nameProp: string, idProp: string,
  onContentChange: (content: string) => void
}) {

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (editorRef.current) {
      // Dynamically load the TinyMCE script from your self-hosted location
      const script = document.createElement("script");
      script.src = "https://canilgu.dev/tinymce/tinymce.min.js";
      script.onload = () => {
        // Initialize TinyMCE after the script has loaded
        window.tinymce.init({
          // The DOM element to attach TinyMCE to
          target: editorRef.current,

          // Dimensions
          height: 320,
          width: 960,

          // Menubar, plugins, toolbar, etc.
          menubar: "file edit view insert format",
          plugins:
            "link image media pageembed  anchor codesample " +
            "charmap emoticons fullscreen preview save" +
            " code " +
            // Below are some from your partial config. Feel free to remove if not needed:
            "lists checklist backcolor casechange pagebreak",
          toolbar:
            "undo redo | bold italic underline strikethrough | " +
            "fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | " +
            "outdent indent | numlist bullist checklist | " +
            "removeformat | pagebreak | fullscreen preview save print | " +
            "insertfile | image | media | pageembed | link | anchor | codesample | ltr rtl | " +
            " code",

          license_key: 'gpl',
          // Image uploads
          images_upload_url: "http://185.23.72.79/admin-api/api/tinyfile/", // FastAPI endpoint
          automatic_uploads: true,
          file_picker_types: "image",
          document_base_url: "http://185.23.72.79/admin-api/",

          // Add your file picker callback
          file_picker_callback: (callback: any, _value: any, meta: any) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = function () {
                const file = (this as HTMLInputElement).files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                // Post to your FastAPI endpoint
                // http://127.0.0.1:8000/admin-api/api/tinyfile/
                fetch("http://185.23.72.79/admin-api/api/tinyfile/", {
                  method: "POST",
                  body: formData,
                  // If you need any headers, set them here
                  // headers: {
                  //   'X-CSRFToken': '...',
                  // },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    // Assuming your FastAPI returns { location: 'URL-to-file' }
                    callback(data.location);
                  })
                  .catch((error) => {
                    console.error("Error uploading image:", error);
                  });
              };
              input.click();
            }
          },

          // Additional config
          custom_undo_redo_levels: 10,
          promotion: false,

          // TinyMCE’s setup callback for reacting to content changes
          setup: (editor: any) => {
            editor.on("Change", () => {
              setContent(editor.getContent());
              onContentChange(editor.getContent());
            });
          },
        });
      };
      document.body.appendChild(script);

      // Cleanup to remove TinyMCE on unmount
      return () => {
        if (window.tinymce) {
          window.tinymce.remove(editorRef.current);
        }
      };
    }
  }, [[onContentChange]]);

  return (
    <>
      <textarea
        ref={editorRef}
        defaultValue="<p>Initial content here...</p>"
        id={idProp}
        className="block w-96 h-48"
        name={nameProp}
      />
      <p hidden>Editor Content:</p>
      <pre hidden>{content}</pre>
    </>
  );
}
