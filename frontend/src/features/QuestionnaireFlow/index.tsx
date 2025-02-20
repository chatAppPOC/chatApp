import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import dagre from "@dagrejs/dagre";
import { generateBasicAuthHeader } from "@/utils/basicAuth";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getLanguages, getTitles } from "@/api";
import { ROUTE_QA_CONTENT } from "@/constants/routes";
import BackButton from "@/components/back_button";

// Add icons import
const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const AddIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

interface NodeData {
  label: string;
  type: "question" | "answer" | "solution";
  onEdit?: (id: string, newValue: string) => void;
  onAdd?: (id: string, type: "question" | "answer" | "solution") => void;
  onDelete?: (id: string) => void;
  hasQuestion?: boolean;
  hasSolution?: boolean;
  id?: string;
}

const NodeActions = ({ onEdit, onDelete, id, label }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editValue, setEditValue] = useState(label);

  const handleEdit = () => {
    if (editValue.trim()) {
      onEdit?.(id, editValue);
      setShowEditDialog(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowEditDialog(open);
    if (open) {
      setEditValue(label);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={showEditDialog} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit"
          >
            <EditIcon />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>
              Make changes to the node content. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Textarea
                id="edit-value"
                placeholder="Enter node content"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  }
                }}
                // className="min-h-[80px] resize-none"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleEdit}
              disabled={!editValue.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <button
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete this node and all its connections. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const QuestionNode: React.FC<{ data: NodeData; isConnectable: boolean }> = ({
  data,
  isConnectable,
}) => (
  <div className="relative p-4 rounded-lg bg-blue-50 border border-blue-300 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 min-h-[160px]">
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
    />

    <div className="flex flex-col gap-2 ">
      <div className="flex justify-between ">
        <div className="font-bold text-blue-700">Question</div>
        <NodeActions
          onEdit={data.onEdit}
          onDelete={data.onDelete}
          id={data.id}
          label={data.label}
        />
      </div>
      <div className="break-words">{data.label}</div>
      <div className="flex justify-center mt-4">
        <Button
          size="sm"
          variant="default"
          onClick={() => data.onAdd?.(data.id, "answer")}
        >
          <AddIcon /> Add Answer
        </Button>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
    />
  </div>
);

const AnswerNode: React.FC<{ data: NodeData; isConnectable: boolean }> = ({
  data,
  isConnectable,
}) => {
  const showQuestionButton = !data.hasQuestion && !data.hasSolution;
  const showSolutionButton = !data.hasQuestion && !data.hasSolution;

  return (
    <div className="relative p-4 rounded-lg bg-green-50 border border-green-500/80 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 min-h-[160px]">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />

      <div className="flex flex-col gap-2 ">
        <div className="flex justify-between ">
          <div className="font-bold text-green-700">Answer</div>
          <NodeActions
            onEdit={data.onEdit}
            onDelete={data.onDelete}
            id={data.id}
            label={data.label}
          />
        </div>
        <div className="break-words">{data.label}</div>
        <div className="flex justify-center gap-4 mt-4">
          {showQuestionButton && (
            <Button
              size="sm"
              variant="default"
              onClick={() => data.onAdd?.(data.id!, "question")}
            >
              <AddIcon /> Add Question
            </Button>
          )}
          {showSolutionButton && (
            <Button
              size="sm"
              className="bg-orange-400 "
              onClick={() => data.onAdd?.(data.id!, "solution")}
            >
              <AddIcon /> Add Solution
            </Button>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
};

const SolutionNode: React.FC<{ data: NodeData; isConnectable: boolean }> = ({
  data,
  isConnectable,
}) => (
  <Card className="relative p-3 bg-yellow-50 border border-yellow-500/80 shadow-md hover:shadow-lg transition-shadow duration-300 w-80 min-h-[160px]">
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
    />

    <div className="flex flex-col gap-1 ">
      <div className="flex justify-between ">
        <div className="font-bold text-yellow-700">Solution</div>
        <NodeActions
          onEdit={data.onEdit}
          onDelete={data.onDelete}
          id={data.id}
          label={data.label}
        />
      </div>
      <div className="break-words">{data.label}</div>
    </div>
  </Card>
);

const nodeTypes = {
  question: QuestionNode,
  answer: AnswerNode,
  solution: SolutionNode,
};

const fetchInitialData = async (contentId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v2/content?contentId=${contentId}`,
      {
        headers: {
          ...generateBasicAuthHeader(),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return null;
  }
};

// Function to convert initial data to nodes and edges
const convertInitialDataToFlow = (data: any) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeCounter = 1;

  // Recursive function to process questions and their answers
  const processQuestion = (
    question: string,
    answers: any[] | null | undefined,
    startX: number,
    startY: number,
    parentId?: string
  ) => {
    const questionId = `q${nodeCounter++}`;

    // Add question node
    nodes.push({
      id: questionId,
      type: "question",
      position: { x: startX, y: startY },
      data: {
        label: question,
        type: "question",
        id: questionId,
      },
    });

    // If this is a nested question, connect it to its parent answer
    if (parentId) {
      edges.push({
        id: `e${parentId}-${questionId}`,
        source: parentId,
        target: questionId,
      });
    }

    // Process each answer if answers exist
    if (answers && Array.isArray(answers)) {
      answers.forEach((answer: any, index: number) => {
        if (!answer) return; // Skip if answer is null or undefined

        const answerId = `a${nodeCounter++}`;
        const xOffset = index * 300;

        // Add answer node
        nodes.push({
          id: answerId,
          type: "answer",
          position: { x: startX + xOffset, y: startY + 150 },
          data: {
            label: answer.answer,
            type: "answer",
            id: answerId,
          },
        });

        // Connect question to answer
        edges.push({
          id: `e${questionId}-${answerId}`,
          source: questionId,
          target: answerId,
        });

        // If answer has a solution
        if (answer.solution) {
          const solutionId = `s${nodeCounter++}`;
          nodes.push({
            id: solutionId,
            type: "solution",
            position: { x: startX + xOffset, y: startY + 300 },
            data: {
              label: answer.solution,
              type: "solution",
              id: solutionId,
            },
          });

          edges.push({
            id: `e${answerId}-${solutionId}`,
            source: answerId,
            target: solutionId,
          });
        }

        // If answer has nested questions, process them recursively
        if (answer.questions) {
          processQuestion(
            answer.questions.question,
            answer.questions.answers,
            startX + xOffset + 150,
            startY + 450,
            answerId
          );
        }
      });
    }
  };

  // Start processing from the root question
  if (data && data.questions) {
    processQuestion(data.questions.question, data.questions.answers, 250, 0);
  }

  return { nodes, edges };
};

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 500;
const nodeHeight = 236;

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

export default function QuestionnaireFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<
    "question" | "answer" | "solution"
  >("question");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    id: "",
    languageId: "",
    name: "",
    titleId: "",
  });
  const [metadataErrors, setMetadataErrors] = useState({
    name: "",
    languageId: "",
    titleId: "",
  });
  const navigate = useNavigate();
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);
  const { id } = useParams();
  const [titles, setTitles] = useState([]);
  const [languages, setLanguages] = useState([]);

  const isCreate = id === "create";

  const createDefaultFlow = () => {
    const defaultData = {
      questions: {
        question: "Enter your question here",
        answers: [],
      },
    };

    const { nodes: initialNodes, edges: initialEdges } =
      convertInitialDataToFlow(defaultData);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      "LR"
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setIsLoading(false);
  };

  const fetchAdditionalData = async () => {
    try {
      const titles_res = await getTitles();
      setTitles(titles_res);
      const languages_res = await getLanguages();
      setLanguages(languages_res);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchInitialData(id);
      const qs = data?.content?.questionare;
      setMetadata({
        id: data.id || "",
        languageId: data.languageId || "",
        name: data.name || "",
        titleId: data.titleId || "",
      });
      if (qs) {
        const { nodes: initialNodes, edges: initialEdges } =
          convertInitialDataToFlow(qs);
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(initialNodes, initialEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isCreate) {
      loadInitialData();
    } else {
      createDefaultFlow();
      setShowMetadataDialog(true); // Open metadata dialog for new flow
    }
  }, [id, isCreate]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleEdit = useCallback((id: string, newValue: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: newValue } };
        }
        return node;
      })
    );
  }, []);

  const handleAdd = useCallback(
    (parentId: string, type: "question" | "answer" | "solution") => {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newId = `${type}-${Date.now()}`;
      const defaultLabels = {
        question: "New Question",
        answer: "New Answer",
        solution: "New Solution",
      };

      const isPositionOccupied = (
        x: number,
        y: number,
        padding: number = 50
      ) => {
        return nodes.some(
          (node) =>
            Math.abs(node.position.x - x) < padding * 4 &&
            Math.abs(node.position.y - y) < padding * 3
        );
      };

      const findSuitablePosition = (baseX: number, baseY: number) => {
        let x = baseX;
        let y = baseY;
        let offset = 200;
        let attempts = 0;
        const maxAttempts = 8;

        while (isPositionOccupied(x, y) && attempts < maxAttempts) {
          switch (attempts % 4) {
            case 0:
              x = baseX + offset;
              break;
            case 1:
              x = baseX - offset;
              break;
            case 2:
              x = baseX;
              y = baseY + offset;
              break;
            case 3:
              x = baseX;
              y = baseY + offset + 200;
              offset += 200;
              break;
          }
          attempts++;
        }

        return { x, y };
      };

      const basePosition = {
        x: parentNode.position.x,
        y: parentNode.position.y + 200,
      };

      const newPosition = findSuitablePosition(basePosition.x, basePosition.y);

      const newNode: Node = {
        id: newId,
        type,
        position: newPosition,
        data: { label: defaultLabels[type], type },
      };

      const newEdge: Edge = {
        id: `e${parentId}-${newId}`,
        source: parentId,
        target: newId,
      };

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === parentId && node.data.type === "answer") {
            return {
              ...node,
              data: {
                ...node.data,
                hasQuestion: type === "question",
                hasSolution: type === "solution",
              },
            };
          }
          return node;
        })
      );

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const connectedEdges = edges.filter(
        (edge) => edge.source === id || edge.target === id
      );

      setNodes((nds) =>
        nds.map((node) => {
          const isParentNode = connectedEdges.some(
            (edge) => edge.source === node.id
          );
          if (isParentNode && node.data.type === "answer") {
            return {
              ...node,
              data: {
                ...node.data,
                hasQuestion: false,
                hasSolution: false,
              },
            };
          }
          return node;
        })
      );

      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [edges]
  );

  const handleSave = useCallback(() => {
    const findNode = (id: string) => nodes.find((node) => node.id === id);

    const findAnswers = (nodeId: string) => {
      const answerEdges = edges.filter((edge) => edge.source === nodeId);
      if (!answerEdges.length) return null;

      return answerEdges
        .map((edge) => {
          const answerNode = findNode(edge.target);
          if (!answerNode || answerNode.type !== "answer") return null;

          // Find if this answer has a question or solution
          const childEdge = edges.find((e) => e.source === answerNode.id);
          if (!childEdge)
            return {
              answer: answerNode.data.label,
              questions: null,
              solution: null,
            };

          const childNode = findNode(childEdge.target);
          if (!childNode) return null;

          if (childNode.type === "question") {
            return {
              answer: answerNode.data.label,
              questions: {
                question: childNode.data.label,
                answers: findAnswers(childNode.id),
              },
              solution: null,
            };
          } else if (childNode.type === "solution") {
            return {
              answer: answerNode.data.label,
              questions: null,
              solution: childNode.data.label,
            };
          }

          return null;
        })
        .filter(Boolean);
    };

    // Find root question node (node without incoming edges)
    const rootNodeId = nodes.find(
      (node) =>
        node.type === "question" &&
        !edges.some((edge) => edge.target === node.id)
    )?.id;

    if (!rootNodeId) {
      console.log("No root question found");
      return;
    }

    const rootNode = findNode(rootNodeId);
    if (!rootNode) return;

    // Create the final structure
    const flowData = {
      questionare: {
        questions: {
          question: rootNode.data.label,
          answers: findAnswers(rootNode.id),
        },
      },
    };

    // Create a formatted version for better readability
    const formattedJson = JSON.stringify(flowData, null, 2);
    console.log("Flow Hierarchy:", formattedJson);

    // Also save the raw data for backup
    // const flowDataRaw = {
    //   nodes: nodes.map(({ id, type, position, data }) => ({
    //     id,
    //     type,
    //     position,
    //     data: {
    //       label: data.label,
    //       type: data.type,
    //       hasQuestion: data.hasQuestion,
    //       hasSolution: data.hasSolution,
    //     },
    //   })),
    //   edges: edges.map(({ id, source, target }) => ({
    //     id,
    //     source,
    //     target,
    //   })),
    // };

    // console.log("Raw Flow Data:", JSON.stringify({ nodes, edges }, null, 2));

    const saveData = async () => {
      try {
        const payload = flowData;

        const response = await axios("http://localhost:8080/api/v2/content", {
          method: isCreate ? "POST" : "PUT",
          params: {
            titleId: metadata.titleId,
            name: metadata.name,
            languageId: metadata.languageId,
            contentId: isCreate ? undefined : id,
          },
          headers: {
            ...generateBasicAuthHeader(),
          },
          data: payload,
        });

        // Show success message or handle response
        toast.success(
          isCreate ? "Flow created successfully!" : "Flow updated successfully!"
        );
        if (isCreate) {
          console.log(response);

          navigate(`${ROUTE_QA_CONTENT}/${response.data.id}`);
        } else {
          loadInitialData();
        }
      } catch (error) {
        console.error("Error saving flow data:", error);
        toast.error(
          error?.response?.message ||
            "Failed to save flow data. Please try again."
        );
      }
    };

    saveData();
  }, [nodes, edges, metadata, id, isCreate]);

  const getNodeData = useCallback(
    (node: Node) => ({
      ...node.data,
      onEdit: handleEdit,
      onAdd: handleAdd,
      onDelete: handleDelete,
      id: node.id,
    }),
    [handleEdit, handleAdd, handleDelete]
  );

  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  const validateMetadata = () => {
    const errors = {
      name: "",
      languageId: "",
      titleId: "",
    };
    let isValid = true;

    console.log(metadata);

    if (!metadata.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!metadata.languageId) {
      errors.languageId = "Language ID is required";
      isValid = false;
    }

    if (!metadata.titleId) {
      errors.titleId = "Title ID is required";
      isValid = false;
    }

    setMetadataErrors(errors);
    return isValid;
  };

  const handleMetadataSave = () => {
    if (validateMetadata()) {
      setShowMetadataDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading flow diagram...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full fixed top-16 z-10 left-0 bottom-0 flex flex-col">
      <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
        <div className="flex gap-2 items-center">
          <BackButton path={ROUTE_QA_CONTENT} />
          <h1 className="text-xl font-semibold text-gray-800">
            Chat Flow Builder
          </h1>
        </div>

        <div className="flex gap-4">
          <Button
            size="sm"
            variant="default"
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Flow
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: getNodeData(node),
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          defaultViewport={{
            x: 0,
            y: 0,
            zoom: 0.8,
          }}
        >
          <Panel
            position="top-left"
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Content Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMetadataDialog(true)}
              >
                <EditIcon />
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium ">Name:</span> {metadata.name}
              </p>
              <p>
                <span className="font-medium">Title:</span>{" "}
                {titles.find(
                  (t: any) => t.id.toString() === metadata.titleId.toString()
                )?.name || metadata.titleId}
              </p>
              <p>
                <span className="font-medium">Language:</span>{" "}
                {languages.find(
                  (l: any) => l.id.toString() === metadata.languageId.toString()
                )?.name || metadata.languageId}
              </p>
            </div>
          </Panel>

          <Panel position="top-right">
            {/* <Button onClick={() => onLayout("TB")}>vertical layout</Button> */}
            <Button
              onClick={() => onLayout("LR")}
              variant={"outline"}
              size={"sm"}
            >
              Auto layout
            </Button>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
        </ReactFlow>

        <Dialog
          open={showMetadataDialog}
          onOpenChange={(open) => {
            // Only allow closing if all fields are valid
            if (!open && validateMetadata()) {
              setShowMetadataDialog(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Content Meta Data</DialogTitle>
              <DialogDescription>
                All fields are required. Please fill in the content details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={metadata.name}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`${metadataErrors.name ? "border-red-500" : ""}`}
                  />
                  {metadataErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {metadataErrors.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="languageId" className="text-right">
                  Language ID <span className="text-red-500">*</span>
                </label>
                <div className="col-span-3">
                  <Select
                    value={metadata.languageId.toString()}
                    onValueChange={(value) =>
                      setMetadata((prev) => ({
                        ...prev,
                        languageId: value,
                      }))
                    }
                    disabled={!isCreate}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        metadataErrors.languageId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang: any) => (
                        <SelectItem key={lang.id} value={lang.id.toString()}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {metadataErrors.languageId && (
                    <p className="text-red-500 text-sm mt-1">
                      {metadataErrors.languageId}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="titleId" className="text-right">
                  Title ID <span className="text-red-500">*</span>
                </label>
                <div className="col-span-3">
                  <Select
                    value={metadata.titleId.toString()}
                    onValueChange={(value) =>
                      setMetadata((prev) => ({
                        ...prev,
                        titleId: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={`w-full ${
                        metadataErrors.titleId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles.map((title: any) => (
                        <SelectItem key={title.id} value={title.id.toString()}>
                          {title.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {metadataErrors.titleId && (
                    <p className="text-red-500 text-sm mt-1">
                      {metadataErrors.titleId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleMetadataSave}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
