import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { FileQuestion, Loader, PlusIcon, Trash, X } from "lucide-react";
import { generateBasicAuthHeader } from "@/utils/basicAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTE_QA_CONTENT, ROUTE_QA_CONTENT_CREATE } from "@/constants/routes";
import BackButton from "@/components/back_button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface QAContent {
  id: number;
  language: string;
  name: string;
  titleId: string;
  createdOn: string | null;
  updatedOn: string | null;
  updatedBy: string | null;
  createdBy: string | null;
}

const QAContentTable: React.FC = () => {
  const [qaContents, setQAContents] = useState<QAContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<{ id: number; name: string }[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");

  // Fetch titles from API
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/titles", {
          headers: {
            "Content-Type": "application/json",
            ...generateBasicAuthHeader(),
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch titles: ${response.statusText}`);
        }
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };
    fetchTitles();
  }, []);

  // Get title name by titleId
  const getTitleName = (titleId: string | null): string => {
    if (!titleId) return "N/A"; // Handle cases where titleId is null
    const title = titles.find((t) => String(t.id) === String(titleId));
    // return title ? `${title.name} (${titleId})` : `Unknown (${titleId})`;
    return title ? `${title.name}` : `Unknown (${titleId})`;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchQAContent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v2/contents`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            ...generateBasicAuthHeader(),
          },
        });
        console.log("response", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: QAContent[] = await response.json();
        setQAContents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQAContent();
  }, []);
  const navigate = useNavigate();
  const handleCreate = () => {
    navigate(ROUTE_QA_CONTENT_CREATE); // Navigate to the QA editor page for new content
  };

  const handleRowClick = (id: number) => {
    window.location.href = `${ROUTE_QA_CONTENT}/${id}`;
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/v2/contents/${id}`, {
        method: "DELETE",
        headers: {
          ...generateBasicAuthHeader(),
        },
      });
      const updatedContents = qaContents.filter(
        (content) => content.id !== Number(id)
      );
      setQAContents(updatedContents);
      toast.success("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content. Please try again.");
    }
  };

  const confirmDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setContentToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Get unique languages from QA content
  const uniqueLanguages = [
    ...new Set(qaContents.map((item) => item.language)),
  ].filter(Boolean);

  const filteredContent = qaContents.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTitle =
      selectedTitle === "All" || item.titleId.toString() === selectedTitle;
    const matchesLanguage =
      selectedLanguage === "All" || item.language === selectedLanguage;
    return matchesSearch && matchesTitle && matchesLanguage;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTitle("All");
    setSelectedLanguage("All");
  };

  const hasActiveFilters =
    searchQuery || selectedTitle !== "All" || selectedLanguage !== "All";

  if (loading) {
    return (
      <div className="flex justify-center items-center my-24">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-5">
      {/* Create Button */}
      <div className="flex justify-between items-center my-4">
        <div className="flex gap-3">
          <BackButton path="/" />
          <h1 className="text-2xl font-semibold ">Q/A Content</h1>
        </div>
        <Button variant={"outline"} onClick={handleCreate}>
          <PlusIcon /> Create Q/A Content
        </Button>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="max-w-xs"
          />
          <Select value={selectedTitle} onValueChange={setSelectedTitle}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Titles</SelectItem>
              {titles.map((title) => (
                <SelectItem key={title.id} value={title.id.toString()}>
                  {title.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Languages</SelectItem>
              {uniqueLanguages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="" />
            Clear Filters
          </Button>
        )}
      </div>
      {/* Table Wrapper */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        {/* Table */}
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead>Content Name</TableHead>
              <TableHead>Language</TableHead>

              <TableHead>Game Title</TableHead>
              <TableHead className="w-64">Updated By</TableHead>
              <TableHead className="w-64">Updated Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileQuestion
                      className="h-12 w-12 text-gray-400 mb-2"
                      strokeWidth={1.5}
                    />
                    <p className="text-lg font-medium">No QA content found</p>
                    <p className="text-sm text-gray-400">
                      {searchQuery ||
                      selectedTitle !== "All" ||
                      selectedLanguage !== "All"
                        ? "Try adjusting your filters"
                        : "Create your first QA content to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredContent.map((content, index) => (
                <TableRow
                  onClick={() => handleRowClick(content.id)}
                  key={content.id}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium text-center">
                    {content.id}
                  </TableCell>

                  <TableCell>{content.name}</TableCell>
                  <TableCell>{content.language || "N/A"}</TableCell>
                  <TableCell> {getTitleName(content.titleId)}</TableCell>
                  <TableCell>{content.updatedBy || "N/A"}</TableCell>

                  <TableCell>
                    {content.updatedOn
                      ? moment(content.updatedOn)
                          .tz("America/Los_Angeles")
                          .format("DD MMM YYYY hh:mm:ss A z")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-500 hover:bg-red-50 p-2"
                      size="sm"
                      onClick={(e) => confirmDelete(content.id, e)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (contentToDelete) {
                  handleDelete(contentToDelete);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QAContentTable;
