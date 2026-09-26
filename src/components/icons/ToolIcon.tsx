import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import CompressIcon from "@mui/icons-material/Compress";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HttpIcon from "@mui/icons-material/Http";
import KeyIcon from "@mui/icons-material/Key";
import TableChartIcon from "@mui/icons-material/TableChart";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ElementType } from "react";
import type { ToolIconName } from "@/lib/tools/types";

const icons = {
  "data-object": DataObjectIcon,
  compress: CompressIcon,
  code: CodeIcon,
  table: TableChartIcon,
  http: HttpIcon,
  key: KeyIcon,
  "auto-awesome": AutoAwesomeIcon,
} satisfies Record<ToolIconName, ElementType<SvgIconProps>>;

export function ToolIcon({ name, fontSize = "small" }: { name: ToolIconName; fontSize?: SvgIconProps["fontSize"] }) {
  const Icon = icons[name];
  return <Icon fontSize={fontSize} />;
}
