import React from "react";

export function Spacer({ height = "1rem" }: { height?: string }) {
  return <div style={{ height }} />;
}
