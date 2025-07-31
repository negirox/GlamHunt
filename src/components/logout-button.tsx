'use client';

import { logout } from "@/app/admin/actions";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <form action={logout}>
            <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </form>
    )
}
