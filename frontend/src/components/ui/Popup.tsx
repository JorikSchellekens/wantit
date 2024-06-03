import { Button, Card, Stack, Typography } from "@mui/joy";
import React, { ReactNode, CSSProperties } from "react";

export default function Popup({
  children,
  title,
  setIsOpen,
  style
}: { children: ReactNode; title: string, setIsOpen: (isOpen: boolean) => void, style?: CSSProperties}) {

  return (
    <div>
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 3,
        }}
          onClick={() => setIsOpen(false)}
        />
        <Card sx={{
          ...style,
          position: "fixed",
          top:"50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 4,
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="px-4 py-2">
              <Typography level="h3">{title}</Typography>
              <Button
                type="button"
                onClick={() => {console.log("clicked"); setIsOpen(false)}}
                className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                x
              </Button>
            </Stack>
            {children}
        </Card>
    </div>
  );
}
