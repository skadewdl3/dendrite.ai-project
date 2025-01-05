"use client";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { CreateBoardResponse, CreateBoardInput, Board } from "@types/board";
import Card from "react-bootstrap/Card";
import NewBoardModal from "@/components/NewBoardModal";

type Props = {
  createBoardAction: (data: CreateBoardInput) => Promise<CreateBoardResponse>;
  boards: Board[];
};

export default function Temp({ createBoardAction, boards }: Props) {
  const [showModal, setShowModal] = useState(false);
  const handleSubmit = (data: CreateBoardInput) => createBoardAction(data);

  return (
    <div className="bruh">
      <NewBoardModal
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
        show={showModal}
      />
      <div className="container d-flex justify-content-between align-items-center">
        <h2>Your Boards</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          New Board
        </Button>
      </div>
      <div className="container mt-4">
        <div className="row">
          {boards.map((board, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{board.name}</Card.Title>
                    <Button variant="primary" className="float-end">
                      View Board
                    </Button>
                  </div>
                  {board.members.length > 1 ? (
                    <small className="text-muted">
                      Members: You and {board.members.length - 1} others
                    </small>
                  ) : (
                    <small className="text-muted">Members: You</small>
                  )}
                  <div className="mt-2"></div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
