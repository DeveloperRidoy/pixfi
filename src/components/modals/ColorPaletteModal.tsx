import { useState } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

type TColorPaletteModalProps = {
  onColorSelect: (color: string) => void;
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
};

const defaultColors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#808080",
  "#A52A2A",
  "#FFA500",
  "#008000",
  "#800080",
  "#C0C0C0",
  "#333333",
];

const ColorPaletteModal: React.FC<TColorPaletteModalProps> = ({
  onColorSelect,
  open = false,
  onClose = () => {},
}) => {
  const [customColor, setCustomColor] = useState("");

  const handleSelect = (color: string) => {
    onColorSelect(color);
    document.getElementById("color-cancel-btn")?.click(); // Close dialog
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-max">
        <AlertDialogHeader>
          <AlertDialogTitle>Select a Color</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid grid-cols-5 gap-2 py-4">
          {defaultColors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: color }}
              onClick={() => handleSelect(color)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 py-2">
          <Input
            placeholder="#000000"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => handleSelect(customColor)}
            disabled={!/^#[0-9A-Fa-f]{6}$/.test(customColor)}
          >
            Use Code
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel id="color-cancel-btn" onClick={onClose}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ColorPaletteModal;
