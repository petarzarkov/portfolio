import React, { CSSProperties, FC } from "react";
import { headerOne } from "@styles";

export const Header: FC<{ title: string; style?: CSSProperties }> = ({ title, style }) => <h1
  style={{ ...headerOne(), marginTop: 0, ...style && style }}>
  {title}
</h1>;