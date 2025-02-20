import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import CaseDetailsPage from "../CaseDetailsPage/CaseDetailsPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDisclosure } from "@mantine/hooks";
import { Badge } from "@/components/ui/badge";
import { getCaseBadge } from "@/lib/utils";
import { getAllCases, getAllUsers, getTitles } from "@/api";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import AlertMessage from "@/components/AlertError";
import BackButton from "@/components/back_button";
import { FileQuestion } from "lucide-react";

interface CaseContent {
  id: number;
  userId: number;
  caseType: string;
  title: number;
  status: string;
  createdOn: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Title {
  id: number;
  name: string;
}

const CaseDetailsTable = () => {
  const [caseContent, setCaseContent] = useState<CaseContent[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [caseIdFilter, setCaseIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [fetchUsers, setFetchUsers] = useState<User[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [opened, handlers] = useDisclosure(false);
  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Re-opened", value: "RE_OPENED" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchTitles();
    fetchCaseContent();
    fetchAllUsers();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await getTitles();
      setTitles(response);
    } catch (error) {
      toast.error("Failed to fetch titles");
      console.error("Error fetching titles:", error);
      // setError("Failed to fetch titles");
    }
  };

  const fetchCaseContent = async () => {
    try {
      const data = await getAllCases();
      setCaseContent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      setFetchUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const getTitleName = (titleId: number) => {
    const title = titles.find((t) => t.id === titleId);
    return title ? title.name : "Unknown";
  };

  const getAssignedTo = (userId: number | null): any => {
    if (!userId)
      return (
        <Badge
          variant={"secondary"}
          className="text-gray-700 bg-gray-50 border-gray-300"
        >
          Unassigned
        </Badge>
      ); //Handle cases where ase is not assigned to any user"; //Handle cases where ase is not assigned to any user
    const assignedTo = fetchUsers.find((u) => u.id == userId);
    return assignedTo
      ? `${assignedTo.firstName + " " + assignedTo.lastName}`
      : `Unknown (${userId})`;
  };

  const getFormattedDate = (date: string) => {
    if (date) {
      const timestampInPDT = moment(date).tz("America/Los_Angeles");
      const format = "MMM DD YYYY hh:mm:ss a z";
      return timestampInPDT
        .format(format)
        .replace(/\bam\b/, "AM")
        .replace(/\bpm\b/, "PM");
    } else {
      return null;
    }
  };

  const handleRowClick = (id: number) => {
    setSelectedCaseId(id);
    handlers.open();
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchCaseContent();
  };

  const filteredCaseContents = caseContent.filter((caseContent) => {
    const matchesCaseId = caseContent.id.toString().includes(caseIdFilter);
    const matchesStatus =
      !statusFilter ||
      statusFilter === "ALL" ||
      caseContent.status === statusFilter;
    return matchesCaseId && matchesStatus;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage title="Error" type="destructive">
          {error}
        </AlertMessage>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton path="/" />
          <h1 className="text-2xl font-semibold">Case Details</h1>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Filter by Case ID"
              value={caseIdFilter}
              onChange={(e) => setCaseIdFilter(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-center w-24">CASE ID</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Case Description</TableHead>
              <TableHead>Game Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              {/* <TableHead>Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCaseContents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileQuestion
                      className="h-12 w-12 text-gray-400 mb-2"
                      strokeWidth={1.5}
                    />
                    <p className="text-lg font-medium">No cases found</p>
                    <p className="text-sm text-gray-400">
                      There are no cases available at the moment
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCaseContents.map((caseItem) => (
                <TableRow
                  key={caseItem.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCaseId(caseItem.id);
                    setSheetOpen(true);
                  }}
                >
                  <TableCell className="text-center">{caseItem.id}</TableCell>
                  <TableCell className="capitalize">
                    {getAssignedTo(caseItem.userId)}
                  </TableCell>
                  <TableCell>{caseItem.caseType}</TableCell>
                  <TableCell>{getTitleName(caseItem.title)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCaseBadge(caseItem.status).variant}
                    >
                      {getCaseBadge(caseItem.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>{getFormattedDate(caseItem.createdOn)}</TableCell>
                  {/* <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      // onClick={() => navigate(ROUTE_CASES + "/" + caseItem.id)}
                      onClick={() => {
                        setSelectedCaseId(caseItem.id);
                        setSheetOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Case Details Sheet */}
      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent className="p-5 max-w-[50rem] min-h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Case Details - {selectedCaseId}</DialogTitle>
          </DialogHeader>
          <CaseDetailsPage
            caseId={selectedCaseId}
            refresh={() => {
              fetchCaseContent(), setSheetOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDetailsTable;
