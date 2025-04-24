"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { authClient } from "@auth/client";
import { redirect } from "next/navigation";

type Props = {
  authenticated: boolean;
};

const NavBar = ({ authenticated }: Props) => {
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  const signIn = () => {
    redirect("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand href="/">QuickDraw</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {authenticated && (
              <Nav.Link href="/invitations">Invitations</Nav.Link>
            )}
            <Nav.Link onClick={authenticated ? signOut : signIn}>
              {authenticated ? "Sign Out" : "Sign In"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
