import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Boxes,
  Cable,
  Cloud,
  Database,
  FileStack,
  FolderOpen,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Network,
  Radio,
  Server,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";

export const partIcons: Record<string, LucideIcon> = {
  frontend: Monitor,
  kong: Network,
  auth: KeyRound,
  agent: Bot,
  notify: Radio,
  mcp: Boxes,
  connector: Cable,
  redis: HardDrive,
  postgres: Database,
  clickhouse: Database,
  volume: FolderOpen,
  canvas: Globe,
  llm: Sparkles,
  resend: Mail,
  model_step: Sparkles,
  execute_now: Workflow,
  pause_hitl: MessageSquare,
  user: Shield,
  otel: Layers,
  adminer: Server,
  file: FileStack,
  cloud: Cloud,
};

export function NodeIcon({
  name,
  x,
  y,
  color,
  size = 16,
}: {
  name: string;
  x: number;
  y: number;
  color: string;
  size?: number;
}) {
  const Icon = partIcons[name] ?? Server;
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <Icon width={size} height={size} color={color} strokeWidth={1.75} aria-hidden />
    </g>
  );
}
