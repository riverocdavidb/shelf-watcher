
import React from "react";
import { Button } from "@/components/ui/button";
import { Import, FileText, Plus } from "lucide-react";
import { ExportStockMovementsBtn } from "./ExportStockMovementsBtn";

interface MovementActionButtonsProps {
  onAddClick: () => void;
  onImportClick: () => void;
}

const MovementActionButtons: React.FC<MovementActionButtonsProps> = ({
  onAddClick,
  onImportClick,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-2 mt-2 md:mt-0 items-center">
      <Button
        onClick={onImportClick}
        variant="outline"
        className="flex items-center"
      >
        <Import className="w-4 h-4 mr-1" /> Import CSV
      </Button>
      <ExportStockMovementsBtn>
        <FileText className="w-4 h-4 mr-1" /> Export CSV
      </ExportStockMovementsBtn>
      <Button
        onClick={onAddClick}
        className="bg-[#1EAEDB] text-white hover:bg-[#179AC0] font-semibold"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Movement
      </Button>
    </div>
  );
};

export default MovementActionButtons;
