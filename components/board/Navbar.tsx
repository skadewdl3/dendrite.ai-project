"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { authClient } from "@auth/client";
import InviteModal from "./InviteModal";
import { useState } from "react";

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
    authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/",
    });
  };

  const openInviteNav = () => {
    const event = new Event("open-invite-modal");
    document.dispatchEvent(event);
  };

  return (
    <Navbar bg="light" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand href="/">QuickDraw</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#" onClick={openInviteNav}>
              Invite
            </Nav.Link>
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
