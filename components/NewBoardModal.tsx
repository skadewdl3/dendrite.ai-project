import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { CreateBoardInput } from "@/lib/types/board";

type Props = {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (data: CreateBoardInput) => void;
};
export default function NewBoardModal({
  show,
  handleClose,
  handleSubmit,
}: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit({
            name: (formData.get("boardName")?.toString() || "").trim(),
            description:
              formData.get("boardDescription")?.toString().trim() || null,
            public: formData.get("boardVisibility") == "public",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="boardName" className="mb-2">
            <Form.Label>Board Name</Form.Label>
            <Form.Control
              type="text"
              name="boardName"
              placeholder="Enter board name"
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="boardDescription" className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="boardDescription"
              rows={3}
              placeholder="Enter board description"
            />
          </Form.Group>
          <Form.Group controlId="boardVisibility">
            <Form.Label>Visibility</Form.Label>
            <Form.Select name="boardVisibility">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Board
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
