import { Employee } from "@/lib/mockDatabase";
import { ShieldCheck, ShieldX, User, Briefcase, Building2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationResultProps {
  employee: Employee | null;
  scannedData: string;
  onReset: () => void;
}

const VerificationResult = ({ employee, scannedData, onReset }: VerificationResultProps) => {
  const isVerified = !!employee;

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-fade-in">
      {/* Icon */}
      <div
        className={`p-5 rounded-full ${
          isVerified
            ? "bg-primary/10 shadow-[0_0_40px_hsl(150_47%_55%/0.3)]"
            : "bg-destructive/10 shadow-[0_0_40px_hsl(348_83%_47%/0.3)]"
        }`}
      >
        {isVerified ? (
          <ShieldCheck className="h-12 w-12 text-primary" />
        ) : (
          <ShieldX className="h-12 w-12 text-destructive" />
        )}
      </div>

      {/* Status badge */}
      <div
        className={`px-4 py-1.5 rounded-full text-sm font-display font-semibold tracking-wider uppercase ${
          isVerified
            ? "bg-primary/15 text-primary border border-primary/30"
            : "bg-destructive/15 text-destructive border border-destructive/30"
        }`}
      >
        {isVerified ? "Access Granted" : "Access Denied"}
      </div>

      {/* Employee details or error */}
      {isVerified && employee ? (
        <div className="w-full space-y-3">
          <DetailRow icon={User} label="Name" value={employee.name} />
          <DetailRow icon={KeyRound} label="Employee ID" value={employee.employee_id} />
          <DetailRow icon={Briefcase} label="Position" value={employee.position} />
          <DetailRow icon={Building2} label="Organization" value={employee.organization} />
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Clearance</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/15 text-primary border border-primary/20">
              {employee.clearance_level}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-foreground font-medium">Unrecognized Credential</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            The scanned data does not match any employee record in the system.
          </p>
          <p className="text-muted-foreground/60 text-xs font-mono mt-2 break-all">
            Data: {scannedData}
          </p>
        </div>
      )}

      <Button
        onClick={onReset}
        variant={isVerified ? "outline" : "destructive"}
        className="w-full mt-2"
      >
        {isVerified ? "Verify Another" : "Try Again"}
      </Button>
    </div>
  );
};

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-foreground font-medium">{value}</span>
      </div>
    </div>
  );
}

export default VerificationResult;
