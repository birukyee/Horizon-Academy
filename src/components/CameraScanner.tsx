import { useState, useCallback } from "react";
import { useZxing } from "react-zxing";

interface CameraScannerProps {
  onResult: (result: string) => void;
}

const CameraScanner = ({ onResult }: CameraScannerProps) => {
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
    onError(err) {
      if (err instanceof Error && err.message.includes("NotAllowedError")) {
        setError("Camera access denied. Please allow camera permissions.");
      }
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden">
        {/* Sonar pulse rings */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-2 rounded-lg border-2 border-primary/60 animate-sonar" />
          <div className="absolute inset-2 rounded-lg border-2 border-primary/40 animate-sonar [animation-delay:0.6s]" />
          <div className="absolute inset-2 rounded-lg border-2 border-primary/20 animate-sonar [animation-delay:1.2s]" />
        </div>

        {/* Glowing frame */}
        <div className="absolute inset-0 z-10 pointer-events-none rounded-lg ring-2 ring-primary/80 shadow-[0_0_30px_hsl(150_47%_55%/0.3)]" />

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary z-10" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary z-10" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary z-10" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary z-10" />

        <video ref={ref} className="w-full h-full object-cover" />
      </div>

      {error ? (
        <p className="text-destructive text-sm text-center">{error}</p>
      ) : (
        <p className="text-muted-foreground text-sm text-center">
          Position the QR code within the frame
        </p>
      )}
    </div>
  );
};

export default CameraScanner;
