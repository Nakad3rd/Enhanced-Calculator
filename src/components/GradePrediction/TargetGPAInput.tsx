import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TargetGPAInputProps {
  currentCGPA: number;
  onTargetSet: (target: number) => void;
}

export const TargetGPAInput = ({ currentCGPA, onTargetSet }: TargetGPAInputProps) => {
  const { toast } = useToast();

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (target < 0 || target > 4.0) {
      toast({
        title: "Invalid Target GPA",
        description: "Target GPA must be between 0.0 and 4.0",
        variant: "destructive",
      });
      return;
    }
    onTargetSet(target);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="target-gpa">Target CGPA</Label>
      <Input
        id="target-gpa"
        type="number"
        step="0.1"
        min="0"
        max="4.0"
        placeholder="Enter target CGPA"
        onChange={handleTargetChange}
        className="bg-gray-800 border-gold-dark/20 text-gold-light"
      />
      <p className="text-sm text-gold-light/80">
        Current CGPA: {currentCGPA.toFixed(2)}
      </p>
    </div>
  );
};