import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { InviteMemberResponse } from "@/lib/types/board";

type Props = {
  show: boolean;
  handleClose: () => void;
  handleSubmit: (email: string) => Promise<InviteMemberResponse>;
  loading: boolean;
};
export default function InviteModal({
  show,
  handleClose,
  loading,
  handleSubmit,
}: Props) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email")?.toString() || "";
          if (email.length == 0) return;
          handleSubmit(email);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Invite Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="email" className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email address"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating...
              </>
            ) : (
              "Create Board"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
