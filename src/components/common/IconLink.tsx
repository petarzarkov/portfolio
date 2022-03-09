import React, { FC } from "react";

export const IconLink: FC<{ title: string; iconSrc: string; link: string; size?: number }> =
({ title, iconSrc, link, size = 26 }) =>
  <a href={link} target="blank">
    <img title={title} alt={title} width={size} src={iconSrc} />
  </a>;