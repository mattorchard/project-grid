import { h, FunctionComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useWindowEvent } from "../hooks/useWindowEvent";
import { asCssVar, palette, PaletteColor } from "../palette";
import { Box } from "./Box";
import "./PaletteColorPicker.css";

export const PaletteColorPicker: FunctionComponent<{
  value: PaletteColor;
  onChange: (color: PaletteColor) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useWindowEvent("click", isOpen ? closeMenu : null);
  useWindowEvent("blur", isOpen ? closeMenu : null);
  return (
    <div className="palette-color-picker">
      <button
        title="Change color"
        className="dot-button"
        style={{ "--assignment-color": asCssVar(value, 500) }}
        onClick={() => setIsOpen((o) => !o)}
      />
      {isOpen && (
        <Box as="ul" className="pc-menu" gap={0.25} flexDirection="column">
          {palette.map((color) => (
            <li key={color}>
              <Box
                as="button"
                type="button"
                className="pc-menu__option"
                onClick={() => onChange(color)}
                py={0.25}
              >
                <Box
                  className="dot-button"
                  mr={0.25}
                  style={{ backgroundColor: asCssVar(color) }}
                />
                {color}
              </Box>
            </li>
          ))}
        </Box>
      )}
    </div>
  );
};
