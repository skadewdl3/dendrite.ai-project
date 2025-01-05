"use client";
import { useEffect, useState } from "react";
import { authClient } from "@auth/client";

export default function Temp() {
  const signInTest = async () => {
    const response = await authClient.signIn.oauth2({
      providerId: "keycloak",
      callbackURL: "/dashboard",
    });
    console.log(response);
  };

  useEffect(() => {
    console.log("hi");
    signInTest();
  });

  return <div>Temp</div>;
}
