import { h, FunctionComponent } from "preact";
import { Box } from "./Box";

export const NonIdealState: FunctionComponent<{
  title: string;
}> = ({ title, children }) => {
  return (
    <Box
      className="non-ideal-state card"
      flexDirection="column"
      alignItems="center"
    >
      <Box as="h4" className="h4" mb={0.25}>
        {title}
      </Box>
      <p className="non-ideal-state__body">{children}</p>
    </Box>
  );
};
