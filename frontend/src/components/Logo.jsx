import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return <Link to="/" className={`flex items-center gap-2 font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
    <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-white/10" : "bg-ink text-white"}`}><Scale size={17}/></span>
    <span>LEXORA <span className="text-wine">AI</span></span>
  </Link>;
}
