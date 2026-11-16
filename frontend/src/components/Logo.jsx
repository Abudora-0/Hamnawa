import { Link } from "react-router-dom";
import { WaveMark } from "./icons";

function Logo() {
  return (
    <Link className="brand" to="/" aria-label="Hamnawa home">
      <WaveMark />
      <span>Hamnawa</span>
      <span className="brand-urdu" lang="ur">ہم نوا</span>
    </Link>
  );
}

export default Logo;
