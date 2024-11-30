import "./ApplicationItem.css";
import { FaTrash } from "react-icons/fa";

function ApplicationItem({ application, onDelete }) {
  return (
    <tr>
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
