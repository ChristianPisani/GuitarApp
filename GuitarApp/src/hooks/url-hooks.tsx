import { useLocation } from "react-router-dom";

export const getCurrentRelativeUrl = () => {
  const location = useLocation();

  let pathName = location.pathname;
  if (pathName.endsWith("/")) pathName = pathName.slice(0, pathName.length - 1);

  return pathName;
};
