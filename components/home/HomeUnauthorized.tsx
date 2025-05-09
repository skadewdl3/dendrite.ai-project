"use client";
import { Button, Container } from "react-bootstrap";
import { authClient } from "@auth/client";
import Link from "next/link";

export default function HomeUnauthorized() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h1 className="mt-4 mb-4">Welcome to QuickDraw</h1>
        <p className="mb-4">You need to login to create a board.</p>
        <Link href="/login">
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </Container>
  );
}
