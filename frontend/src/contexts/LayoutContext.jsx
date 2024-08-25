import { createContext } from "react";

export const LayoutContext = createContext();
const [child, setChild] = useState(null);

export const LayoutProvider = ({ children }) => {
  return <LayoutContext.Provider>{children}</LayoutContext.Provider>;
};
