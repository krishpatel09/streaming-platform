"use client";

import * as React from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Mail, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockUsers = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", joined: "Mar 12, 2024", avatar: "AJ" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active", joined: "Jan 05, 2024", avatar: "BS" },
  { id: "u3", name: "Charlie Davis", email: "charlie@example.com", role: "Viewer", status: "Inactive", joined: "Feb 22, 2024", avatar: "CD" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">User Directory</h1>
          <p className="text-zinc-500 font-medium">Manage platform users, roles, and access controls.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input placeholder="Search users by name or email..." className="pl-9 bg-white border-zinc-200 focus:bg-white" />
        </div>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">User</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Role</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Joined Date</TableHead>
              <TableHead className="text-right text-zinc-500 uppercase text-[10px] font-bold tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-100 shadow-sm">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900">{user.name}</span>
                      <span className="text-xs text-zinc-500 font-medium">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                    <Shield className="h-3 w-3 text-indigo-600" />
                    {user.role}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={user.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-zinc-100 text-zinc-500 border-zinc-200"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {user.joined}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-zinc-200 shadow-lg text-zinc-900">
                      <DropdownMenuItem className="cursor-pointer hover:bg-zinc-50">
                        <Mail className="mr-2 h-4 w-4 text-zinc-400" /> Message User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-zinc-50">
                        <Shield className="mr-2 h-4 w-4 text-zinc-400" /> Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-100" />
                      <DropdownMenuItem className="text-red-500 hover:bg-red-50 cursor-pointer">
                        Suspend Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
