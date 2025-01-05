import { db, Board, eq } from "@db";
import Button from "react-bootstrap/Button";

export default async function BoardPage({
  params: paramsPromise,
}: {
  params: Promise<Record<string, string[]>>;
}) {
  const params = await paramsPromise;
  const boardId = parseInt(params.boardId[0] as string);

  const board = await db.select().from(Board).where(eq(Board.id, boardId));

  if (board.length == 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ marginTop: "200px" }}
      >
        <div>
          <h2 className="text-center mb-4">Board Not Found</h2>
          <p className="text-center text-muted mb-4">
            Sorry, the board you're looking for doesn't exist or may have been
            moved.
          </p>
          <div className="text-center">
            <Button href="/" className="btn btn-primary">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div> {boardId}</div>;
}
