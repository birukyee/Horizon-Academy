import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload } from "lucide-react";
import CameraScanner from "./CameraScanner";
import FileUpload from "./FileUpload";
import VerificationResult from "./VerificationResult";
import { lookupEmployee, type Employee } from "@/lib/mockDatabase";

interface VerifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalState = "scan" | "result";

const VerifyModal = ({ open, onOpenChange }: VerifyModalProps) => {
  const [state, setState] = useState<ModalState>("scan");
  const [scannedData, setScannedData] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);

  const handleResult = useCallback(async (data: string) => {
    setScannedData(data);
    const emp = await lookupEmployee(data);
    setEmployee(emp);
    setState("result");
  }, []);

  const handleReset = useCallback(() => {
    setState("scan");
    setScannedData("");
    setEmployee(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) handleReset();
      onOpenChange(open);
    },
    [onOpenChange, handleReset]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/50 p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {state === "result"
                ? employee
                  ? "Identity Verified"
                  : "Verification Failed"
                : "Employee Verification"}
            </DialogTitle>
            <DialogDescription>
              {state === "result"
                ? employee
                  ? "Employee credentials confirmed."
                  : "No matching record found."
                : "Scan a QR code or upload an ID card to verify."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4">
          {state === "scan" ? (
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="camera" className="gap-2 font-display">
                  <Camera className="h-4 w-4" />
                  Use Camera
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2 font-display">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera">
                <CameraScanner onResult={handleResult} />
              </TabsContent>
              <TabsContent value="upload">
                <FileUpload onResult={handleResult} />
              </TabsContent>
            </Tabs>
          ) : (
            <VerificationResult
              employee={employee}
              scannedData={scannedData}
              onReset={handleReset}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyModal;
