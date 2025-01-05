"use client";
import { useEffect, useState } from "react";
import { authClient } from "@auth/client";

export default function Temp() {
  const signInTest = async () => {
    const response = await authClient.signIn.oauth2({
      providerId: "keycloak",
    });
    console.log(response);
  };

  return (
    <div>
      <button onClick={signInTest}>Sign In</button>
    </div>
  );
}
