"use client";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import {
  CreateBoardResponse,
  CreateBoardInput,
  Board,
  DeleteBoardInput,
  DeleteBoardResponse,
} from "@/lib/types/board";
import Card from "react-bootstrap/Card";
import NewBoardModal from "@/components/home/NewBoardModal";
import { Trash, BoxArrowUpRight } from "react-bootstrap-icons";

type Props = {
  createBoardAction: (data: CreateBoardInput) => Promise<CreateBoardResponse>;
  deleteBoardAction: (data: DeleteBoardInput) => Promise<DeleteBoardResponse>;
  boards: Board[];
};

export default function Temp({
  createBoardAction,
  deleteBoardAction,
  boards,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(-1);

  const handleSubmit = async (data: CreateBoardInput) => {
    setLoading(true);
    const res = await createBoardAction(data);
    if (!res.success) {
      console.log(res.error);
    } else {
      console.log(res.data);
      window.location.reload();
    }
    setLoading(false);
  };

  const deleteBoard = async (id: number) => {
    setDeleting(true);
    setDeletingId(id);
    const res = await deleteBoardAction({ id });
    if (!res.success) {
      console.log(res.error);
    } else {
      console.log(res.data);
      window.location.reload();
    }
    setDeleting(false);
  };

  return (
    <div className="bruh">
      <NewBoardModal
        handleClose={() => setShowModal(false)}
        loading={loading}
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
              <Card style={{ width: "100%", height: "100%" }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex-col align-items-center">
                      <Card.Title>{board.name}</Card.Title>
                      {board.members.length > 1 ? (
                        <small className="text-muted">
                          Members: You and {board.members.length - 1} others
                        </small>
                      ) : (
                        <small className="text-muted">Members: You</small>
                      )}
                    </div>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="danger"
                        className="me-2 d-flex align-items-center justify-content-center"
                        style={{ width: "38px", height: "38px", padding: 0 }}
                        onClick={() => deleteBoard(board.id)}
                        disabled={deleting && deletingId === board.id}
                      >
                        {deleting && deletingId === board.id ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <Trash />
                        )}
                      </Button>
                      <Button
                        variant="primary"
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "38px", height: "38px", padding: 0 }}
                        disabled={deleting && deletingId === board.id}
                        href={`/board/${board.id}`}
                      >
                        <BoxArrowUpRight />
                      </Button>
                    </div>
                  </div>

                  {board.description && (
                    <Card.Text className="mt-2">
                      {board.description.length > 20
                        ? `${board.description.substring(0, 20)}...`
                        : board.description}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
