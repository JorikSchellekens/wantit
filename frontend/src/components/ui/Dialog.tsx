import { Button, Card, Stack, Typography } from "@mui/joy";
import React from "react";

export function Dialog({
  children,
  title,
  buttonTitle,
  style,
  isActive
}: { children: React.ReactNode; title: string, buttonTitle: string, style?: React.CSSProperties, isActive?: boolean}) {
  const [isOpen, setIsOpen] = React.useState(isActive || false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{buttonTitle}</Button>
      {isOpen && (
        <>
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
          overflowY: "auto",
          zIndex: 4,
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" >
              <Typography level="h3">{title}</Typography>
              <Button
                type="button"
                sx={{ position: "absolute", right: "15px", top: "15px" }}
                onClick={() => setIsOpen(false)}
              >
                x
              </Button>
            </Stack>
            {children}
        </Card>
        </>
      )}
    </div>
  );
}
