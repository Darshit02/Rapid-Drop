"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const files = useQuery(api.files.getFiles)
  const createFile = useMutation(api.files.createFile)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
          <Button>SignOut</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>SignIn</Button>
        </SignInButton>
      </SignedOut>
      <Button onClick={() => {
        createFile({
          name: "hello world"
        })
      }}>Click Me</Button>

      {files?.map((file) => {
        return <div key={file._id}>
          {file.name}
        </div>

      })
      }
    </main>
  );
}
