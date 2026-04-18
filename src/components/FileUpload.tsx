import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Loader2 } from "lucide-react";

interface FileUploadProps {
  onResult: (result: string) => void;
}

const FileUpload = ({ onResult }: FileUploadProps) => {
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setFileName(file.name);
      setProcessing(true);

      // Simulate AI processing delay
      setTimeout(() => {
        // Simulate: 70% chance of finding a valid QR, 30% unknown
        const mockIds = ["EMP-001", "EMP-002", "EMP-003", "EMP-004", "UNKNOWN"];
        const randomId = mockIds[Math.floor(Math.random() * mockIds.length)];
        setProcessing(false);
        onResult(randomId);
      }, 2500);
    },
    [onResult]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: processing,
  });

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute inset-0 rounded-full animate-pulse-glow" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-foreground font-medium font-display">Processing ID Card</p>
          <p className="text-muted-foreground text-sm">Scanning for QR codes in {fileName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-4 py-12 px-6
        border-2 border-dashed rounded-lg cursor-pointer
        transition-all duration-300
        ${isDragActive
          ? "border-primary bg-primary/5 shadow-[0_0_30px_hsl(150_47%_55%/0.15)]"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className={`p-4 rounded-full transition-colors ${isDragActive ? "bg-primary/10" : "bg-muted"}`}>
        {isDragActive ? (
          <FileImage className="h-8 w-8 text-primary" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="text-center space-y-1">
        <p className="text-foreground font-medium">
          {isDragActive ? "Drop the image here" : "Drag & drop an ID card image"}
        </p>
        <p className="text-muted-foreground text-sm">
          or click to browse · PNG, JPG, WEBP
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
