import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Approver {
  id: number;
  name: string;
  role_name: string;
}

interface DropdownProps {
  requestType: string;
  hierarchy: number;
  onSelect: (approverId: number) => void;
}

const Drop: React.FC<DropdownProps> = ({ requestType, hierarchy, onSelect }) => {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprover, setSelectedApprover] = useState<string>("");

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/next-approvers?type=${requestType}&hierarchy=${hierarchy}`,
          {
            headers: { Authorization: token },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch approvers");
        }

        const data: Approver[] = await response.json();
        setApprovers(data);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchApprovers();
  }, [requestType, hierarchy]);

  return (
    <Select onValueChange={(value) => {
      setSelectedApprover(value);
      onSelect(Number(value));
    }}>
      <SelectTrigger className="w-full border rounded p-2">
        <SelectValue placeholder="Select Next Approver" />
      </SelectTrigger>
      <SelectContent>
        {approvers.length > 0 ? (
          approvers.map((approver) => (
            <SelectItem key={approver.id} value={approver.id.toString()}>
              {approver.name} ({approver.role_name})
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            No approvers available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default Drop;