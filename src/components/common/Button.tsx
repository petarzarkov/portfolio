import React, { FC } from "react";
import { useSugarProvider } from "@hooks";

export const Button: FC<{ text: string; onPress: () => void; size?: number }> =
({ text, onPress, size = 1 }) => {
  const { colors } = useSugarProvider();

  return (
    <div>
      <button
        style={{
          width: 100 * size,
          color: colors.text,
          backgroundColor: colors.primary,
          borderRadius: 5,
          fontWeight: 700,
          borderWidth: 1,
          borderColor: colors.border
        }}
        onClick={onPress}
      >
        {text}
      </button>
    </div>
  );
};