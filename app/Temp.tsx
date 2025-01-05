"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { authClient } from "@auth/client";
import { useState } from "react";
import { CreateBoardResponse } from "@/lib/types/board";

type Props = {
  createBoardAction: (name: string) => Promise<CreateBoardResponse>;
};

export default function Temp({ createBoardAction }: Props) {
  const [boardName, setBoardName] = useState("");

  const signInTest = async () => {
    await authClient.signIn.oauth2({
      providerId: "keycloak",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createBoardAction(boardName);
    console.log(res);
  };

  return (
    <div className="bruh">
      <Button onClick={signInTest}>Sign In</Button>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Board Name</Form.Label>
          <InputGroup>
            <Form.Control
              value={boardName}
              type="text"
              placeholder="Enter board name"
              onChange={(e) => setBoardName(e.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Button type="submit">Create Board</Button>
        </Form.Group>
      </Form>
    </div>
  );
}
