import React, { FC } from "react";
import { BasicStats, Card } from "@components";

export const Home: FC = () => {
  return (
    <>
      <Card avatarSize={"full"} />
      <BasicStats />
    </>
  );
};
