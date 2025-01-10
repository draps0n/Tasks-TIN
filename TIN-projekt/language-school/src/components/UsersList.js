import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";
import "../styles/UsersList.css";

function UsersList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const usersPerPage = 5;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxiosAuth();

  const handleAddUser = () => {
    navigate("/admin/users/register");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/users?page=${currentPage}&limit=${usersPerPage}`
        );
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [axios, currentPage, t]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="users-list-page">
      <h1>{t("usersList")}</h1>
      <button className="user-add-button" onClick={handleAddUser}>
        {t("addEmpTeach")}
      </button>
      {users.map((user) => (
        <UserListItem user={user} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default UsersList;
