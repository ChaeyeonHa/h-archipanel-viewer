import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

type VisualNode = {
  id: string;
  label: string;
  zone: string;
  floor: number;
  x: number;
  y: number;
  radius: number;
};

type VisualEdge = {
  source: string;
  target: string;
  strength?: string;
  line_type?: string;
};

type VisualPayload = {
  visual_nodes: VisualNode[];
  visual_edges: VisualEdge[];
};

export default function App() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [status, setStatus] = useState("Loading visual payload...");

  useEffect(() => {
    async function loadPayload() {
      try {
        const response = await fetch("/data/sample.json");
        const visualPayload: VisualPayload = await response.json();

        const rfNodes = visualPayload.visual_nodes.map((node) => ({
          id: node.id,
          position: { x: node.x, y: node.y },
          data: { label: node.label },
          style: {
            width: node.radius * 2,
            height: node.radius * 2,
            borderRadius: 999,
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              node.zone === "public"
                ? "#3B82F6"
                : node.zone === "semi-public" || node.zone === "semi-private"
                ? "#8B5CF6"
                : "#111827",
            color: "white",
            fontSize: 14,
            textAlign: "center",
          },
        }));

        const rfEdges = visualPayload.visual_edges.map((edge, index) => ({
          id: `e-${index}`,
          source: edge.source,
          target: edge.target,
          animated: edge.strength === "strong",
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
        setStatus("Loaded from /data/sample.json");
      } catch (error) {
        console.error(error);
        setStatus("Failed to load sample.json");
      }
    }

    loadPayload();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111827" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 16,
          left: 16,
          padding: "10px 14px",
          borderRadius: 12,
          background: "rgba(17, 24, 39, 0.85)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <strong>H Archipanel Viewer</strong>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{status}</div>
      </div>

      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}