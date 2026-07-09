import { Hammer, PenTool, LineChart, Calculator as CalcIcon, ImagePlus, Bot, SquareSigma } from 'lucide-react'
import DrawTool from "./DrawTool";
import GraphTool from "./GraphTool";
import MathKeyboardTool from "./MathKeyboardTool";
import UploadPictureTool from "./UploadPictureTool";
import Calculator from './Calculator';

export const TOOL_REGISTRY = {
  draw: { label: "Draw", icon: PenTool, component: DrawTool },
  graph: { label: "Graph", icon: LineChart, component: GraphTool },
  uploadPicture: { label: "Upload Picture", icon: ImagePlus, component: UploadPictureTool },
  calculator: {
    label: "Calculator", icon: CalcIcon, component: Calculator
  },
};

