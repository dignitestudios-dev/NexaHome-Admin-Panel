"use client";



import { useEffect, useState } from "react";

import {

  Table,

  TableBody,

  TableCell,

  TableHead,

  TableHeader,

  TableRow,

} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Eye } from "lucide-react";

import { useUsers } from "@/features/users/users.hooks";

import type { User } from "@/features/users/users.types";

import { formatDate } from "@/lib/date";

import Pagination from "@/components/global/pagination";

import { UserDetailsModal } from "./user-details-modal";



const USERS_PER_PAGE = 10;



function getInitials(name?: string) {

  if (!name) return "NA";

  return name

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part) => part[0]?.toUpperCase() ?? "")

    .join("");

}



function formatRole(role: string) {

  return role.charAt(0).toUpperCase() + role.slice(1);

}



export const UsersTable = ({ search = "" }: { search?: string }) => {

  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError, error } = useUsers(
    page,
    USERS_PER_PAGE,
    search
  );

  const users = data?.users ?? [];

  const totalPages = data?.totalPages ?? 1;



  const handlePrev = () => {

    if (page > 1) setPage((prev) => prev - 1);

  };



  const handleNext = () => {

    if (page < totalPages) setPage((prev) => prev + 1);

  };



  return (

    <>

      <div className="rounded-3xl overflow-hidden">

        <Table>

          <TableHeader>

            <TableRow className="font-light">

              <TableHead className="rounded-l-3xl">Name</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Join Date</TableHead>

              <TableHead>User Type</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="rounded-r-3xl text-center">Action</TableHead>

            </TableRow>

          </TableHeader>



          <TableBody>

            {isError ? (

              <TableRow>

                <TableCell colSpan={6} className="h-24 text-center text-red-600">

                  ⚠ {(error as Error)?.message ?? "Failed to load users."}

                </TableCell>

              </TableRow>

            ) : isLoading ? (

              <TableRow>

                <TableCell colSpan={6} className="h-24 text-center">

                  <div className="flex items-center justify-center">

                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />

                    <span className="ml-2">Loading...</span>

                  </div>

                </TableCell>

              </TableRow>

            ) : users.length ? (

              users.map((user) => {

                const status = user.isDeactivatedByAdmin ? "Inactive" : "Active";



                return (

                  <TableRow

                    key={user._id}

                    className="font-normal hover:bg-gray-50 transition-colors"

                  >

                    <TableCell>

                      <div className="flex items-center gap-2">

                        <Avatar className="h-10 w-10">

                          <AvatarImage

                            src={

                              typeof user.profilePicture === "string"

                                ? user.profilePicture

                                : user.profilePicture?.location ?? undefined

                            }

                            alt={user.name}

                          />

                          <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">

                            {getInitials(user.name)}

                          </AvatarFallback>

                        </Avatar>

                        <span>{user.name}</span>

                      </div>

                    </TableCell>



                    <TableCell>{user.email}</TableCell>



                    <TableCell>

                      {formatDate(user.joinDate)}

                    </TableCell>



                    <TableCell>{formatRole(user.role)}</TableCell>



                    <TableCell>

                      <span

                        className={`font-medium ${

                          status === "Active"

                            ? "text-[#16BC4E]"

                            : "text-[#FF0000]"

                        }`}

                      >

                        {status}

                      </span>

                    </TableCell>



                    <TableCell className="text-center">

                      <button

                        type="button"

                        onClick={() => setSelectedUser(user)}

                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F0F5F6] text-[#005864] hover:bg-[#e2eced] transition"

                        aria-label={`View ${user.name}`}

                      >

                        <Eye size={18} />

                      </button>

                    </TableCell>

                  </TableRow>

                );

              })

            ) : (

              <TableRow>

                <TableCell colSpan={6} className="h-24 text-center">

                  No users found.

                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>



      {!isLoading && !isError && totalPages > 1 && (

        <Pagination

          currentPage={page}

          totalPages={totalPages}

          onPrev={handlePrev}

          onNext={handleNext}

        />

      )}



      <UserDetailsModal

        open={!!selectedUser}

        user={selectedUser}

        onClose={() => setSelectedUser(null)}

        onUserUpdated={setSelectedUser}

      />

    </>

  );

};

