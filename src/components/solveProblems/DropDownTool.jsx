import React from 'react'


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { Hammer, PenTool, LineChart, Calculator, ImagePlus, Bot, Check } from 'lucide-react'


// import { styles } from '../../pages/SolveProblems'
import { TOOL_REGISTRY } from './toolRegistry';



function DropDownTool({ activeTools, onToggleTool, onOpenAIChat }) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 min-w-[100px] px-4 py-2 rounded-lg border border-[#c7c4d6] bg-transparent text-[#4441c4] font-semibold text-[13px] cursor-pointer transition-colors hover:bg-[#4441c4]/5 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          <Hammer size={14} />
          Tools
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.entries(TOOL_REGISTRY).map(([toolId, tool]) => {
          const ToolIcon = tool.icon;
          const isActive = activeTools.includes(toolId);
          return (
            <DropdownMenuItem key={toolId} onClick={() => onToggleTool(toolId)}>
              <ToolIcon size={14} className="mr-2 text-[#4441c4]" />
              <span className="text-[#4441c4]">{tool.label}</span>
              {isActive && <Check size={14} className="ml-auto text-[#4441c4]" />}
            </DropdownMenuItem>
          );
        })}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropDownTool;