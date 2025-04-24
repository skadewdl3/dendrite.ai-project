"use client";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { Invitation } from "@/lib/types/board";

type Props = {
  invitations: Invitation[];
  accpetInvitationAction: (invitation: Invitation) => void;
  rejectInvitationAction: (invitation: Invitation) => void;
};

export default function Invitations({
  invitations,
  accpetInvitationAction,
  rejectInvitationAction,
}: Props) {
  useEffect(() => {
    console.log(invitations);
  }, []);

  return (
    <div>
      <div className="container d-flex justify-content-between align-items-center">
        <h2>Pending invitations</h2>
      </div>
      <div className="container mt-4">
        {invitations.filter((i) => i.status == "pending").length > 0 ? (
          <div>
            {invitations.map((invitation, i) => (
              <div key={i} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Board: {invitation.boardId}</h5>
                    <p className="mb-0">From: {invitation.from}</p>
                  </div>
                  <div>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => accpetInvitationAction(invitation)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => rejectInvitationAction(invitation)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending invitations</p>
        )}
      </div>

      <div className="container mt-4">
        {invitations.filter((i) => i.status != "pending").length > 0 ? (
          <div>
            {invitations.map((invitation, i) => (
              <div key={i} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Board: {invitation.boardId}</h5>
                    <p className="mb-0">From: {invitation.from}</p>
                  </div>
                  <div>
                    <p
                      style={{
                        color:
                          invitation.status == "accepted" ? "green" : "red",
                        textTransform: "capitalize",
                      }}
                    >
                      {invitation.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending invitations</p>
        )}
      </div>
    </div>
  );
}
