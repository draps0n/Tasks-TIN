import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import CourseStudentsListItem from "./CourseStudentsListItem";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function CourseStudentsList({ groupId, takenPlaces, setTakenPlaces }) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [generalError, setGeneralError] = useState("");
  const studentsPerPage = 4;

  useEffect(() => {
    const fetchGroupStudents = async () => {
      try {
        const response = await axios.get(
          `/groups/${groupId}/students?page=${currentPage}&limit=${studentsPerPage}`
        );
        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group students:", error);
        toast.error(t("errorFetchingCourseStudents"));
        setGeneralError(t("errorFetchingCourseStudents"));
      }
    };

    fetchGroupStudents();
  }, [groupId, axios, currentPage, t]);

  const refreshStudents = async () => {
    try {
      const response = await axios.get(
        `/groups/${groupId}/students?page=${
          takenPlaces % studentsPerPage === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage
        }&limit=${studentsPerPage}`
      );

      // Cofnięcie strony, jeśli to był ostatni student na stronie (poza stroną pierwszą)
      if (takenPlaces % studentsPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTakenPlaces((prev) => prev - 1);
    } catch (error) {
      console.error("Error fetching group students:", error);
      toast.error(t("errorFetchingCourseStudents"));
      setGeneralError(t("errorFetchingCourseStudents"));
    }
  };

  const updateStudentAbsences = (studentId, absences) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, absences } : student
      )
    );
  };

  if (loading) {
    return <Loading error={generalError} />;
  }

  if (students.length === 0) {
    return <h3>{t("noStudents")}</h3>;
  }

  return (
    <div className="course-students-list">
      <h3>{t("studentsList")}</h3>
      <ul>
        {students.map((student) => (
          <CourseStudentsListItem
            key={student.id}
            student={student}
            groupId={groupId}
            refreshStudents={refreshStudents}
            updateStudentAbsences={updateStudentAbsences}
          />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default CourseStudentsList;
