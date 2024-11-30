import "./ApplicationListItem.css";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

function ApplicationItem({ application, onDelete }) {
  const navigate = useNavigate();
  const onRowClick = (id) => {
    navigate(`/applications/${id}`);
  };
  return (
    <tr onClick={() => onRowClick(application.id)} className="clickable">
      <td>{application.fname}</td>
      <td>{application.lname}</td>
      <td>{application.email}</td>
      <td>{application.language}</td>
      <td>{application.formattedDate}</td>
      <td>
        <button
          className="delete-button"
          onClick={() => onDelete(application.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default ApplicationItem;
